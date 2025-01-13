import { AsyncMiddleware} from "types/Middleware";
import EncryptionService from "../services/EncryptionService";
const { APP_CLIENT_ID, APP_CLIENT_SECRET, GH_REDIRECT_URI } = process.env;
const encryptionService = new EncryptionService();
const scope = 'user:email'
interface Email{
  email:string,
  primary:boolean,
  verified:boolean,
  visibility:string
}

const gitLogin: AsyncMiddleware = async (req,res,next) => {
  const state = encryptionService.encrypt('harbor-master');
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${APP_CLIENT_ID}&redirect_uri=${GH_REDIRECT_URI}&state=${state}&scope=${scope}`;
  res.redirect(githubAuthUrl);
}

const gitCookie: AsyncMiddleware = async (req, res, next) => {
  console.log('in gitCookie');
  
  const code = req.query.code;
  const state = req.query?.state;

  if (encryptionService.decrypt(state as string) !== 'harbor-master') {
    return next({
      log: 'authController.callback: state from request does not match. This may be a malicious request',
      status: 403,
      message: { err: 'You are not authorized to perform this action' }
    });
  }

  try {
    const response = await fetch(`https://github.com/login/oauth/access_token?client_id=${APP_CLIENT_ID}&client_secret=${APP_CLIENT_SECRET}&code=${code}&redirect_uri=${GH_REDIRECT_URI}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    }).then(data=>data.json());

    const { access_token,token_type } = response;

    if (!access_token) {
      throw new Error('No access token returned');
    }

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`, 
      },
    });

    const userData = await userResponse.json();
    
    if (!userData.login) {
      throw new Error('No username found in GitHub response');
    }

    const emails:Email[] = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }).then(response=>response.json());

    const primaryEmail = emails.find(email => email.primary)!.email;
  
    console.log('GitHub Username:', userData.login);
    console.log('Github Email:', primaryEmail);

    res.cookie('githubAuthToken', access_token, { httpOnly: true });
    res.locals.token = access_token;
    res.locals.username = userData.login;
    res.locals.email = primaryEmail;

    console.log('Successfully authenticated');

    return next();
  } catch (error) {
    console.error('Error in GitHub callback:', error);
    return next({
      log: `authController.callback: ${error instanceof Error ? error.message : error}`,
      message: { err: 'Server error while trying to log in with GitHub' },
    });
  }
};

module.exports = {
  gitCookie,
  gitLogin
}