import { Request, Response, NextFunction } from "express";
import AuthController from 'interfaces/AuthController';

const authController: AuthController = {} as AuthController;

const { APP_CLIENT_ID, APP_CLIENT_SECRET } = process.env; // generate these with GitHub and add to .env file

authController.githubLogin = (req: Request, res: Response, next: NextFunction): void => {
  const GITHUB_AUTH_STATE = ''; // should be random string
  const LOGIN_REDIRECT_URI = 'localhost:8080/auth-callback'; // for local only, not sure about prod
  res.locals.state = GITHUB_AUTH_STATE; // store to compare to state that comes back in request to callback
  return res.redirect(`https://github.com/login/oauth/authorize?client_id=${APP_CLIENT_ID}&redirect_uri=${LOGIN_REDIRECT_URI}&state=${GITHUB_AUTH_STATE}`);
}

authController.callback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { code, state } = req.query;
  if (state !== res.locals.state) return next({ }) // this is an issue, throw error
  try {
    const response = await fetch(`https://github.com/login/oauth/access_token?client_id=${APP_CLIENT_ID}&client_secret=${APP_CLIENT_SECRET}&code=${code}`, 
      { method: 'POST' }
    );
    const githubResponse = await response.json();
    const { access_token, expires_in, refresh_token, refresh_token_expires_in, scope, token_type } = githubResponse;
    res.cookie('githubAuthToken', access_token, { httpOnly: true });
    return res.redirect('/');
  } 
  catch {
    return next({ }); // throw error
  }
};

export default authController;