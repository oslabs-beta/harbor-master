import encryptionService from "../services/EncryptionService";
import { UserModel } from "../config/mongoConfig";
import { NextFunction, Request, Response } from "express";

const { APP_CLIENT_ID, APP_CLIENT_SECRET } = process.env;

class UserController {

  public githubLogin(req: Request, res: Response, next: NextFunction) {
    const GITHUB_AUTH_STATE = encryptionService.encrypt('harbor-master');
    const LOGIN_REDIRECT_URI = 'http://127.0.0.1:3000/auth-callback'; // for local only, not sure about prod
    return res.redirect(`https://github.com/login/oauth/authorize?client_id=${APP_CLIENT_ID}&redirect_uri=${LOGIN_REDIRECT_URI}&state=${GITHUB_AUTH_STATE}`);
  }

  public async callback(req: Request, res: Response, next: NextFunction) {
    const { code, state } = req.query;
    if (encryptionService.decrypt(state as string) !== 'harbor-master') return next({ log: 'authController.callback: state from request does not match. This may be a malicious request', status: 403, message: { err: 'You are not authorized to perform this action'} } );
    try {
      const response = await fetch(`https://github.com/login/oauth/access_token?client_id=${APP_CLIENT_ID}&client_secret=${APP_CLIENT_SECRET}&code=${code}`, 
        { method: 'POST',
          headers: {
            Accept: 'application/json'
          }
        }
      );
      const githubResponse = await response.json();
      const { access_token, token_type } = githubResponse;
      res.cookie('githubAuthToken', access_token, { httpOnly: true });
      res.locals.token = access_token;
      return res.redirect('http://localhost:8080')
    } 
    catch (error) {
      return next({ 
        log: `authController.callback: ${error}`, 
        message: { err: 'Server error while trying to log in with GitHub' } 
      });
    }
  };

  public async getUser(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.githubAuthToken;
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const user = await response.json();
    res.locals.login = user.login;
    res.locals.email = user.email;
    return next();
  }

  public async verifyUser(req: Request, res: Response, next: NextFunction) {
    const { login, email } = res.locals;
    const user = await UserModel.findOne({ email }) || await UserModel.create({ email, githubHandle: login });
    res.locals.user = user;
    return next();
  }

  public async getRepositories(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.githubAuthToken;
    const response = await fetch('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const repos = await response.json();
    res.locals.repos = repos;
    return next();
  };

}

export default new UserController();