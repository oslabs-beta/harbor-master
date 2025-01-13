import { AsyncMiddleware, Middleware } from "types/Middleware";
import { UserModel } from "../config/mongoConfig";
import { renderDateViewCalendar } from "@mui/x-date-pickers";

const createUser: AsyncMiddleware = async (req,res,next) => {
  const username = res.locals.username;
  const email = res.locals.email;
  const token = res.locals.token;
  const newUser = await UserModel.create({
    githubHandle:username,
    email:email
  });
  res.locals.userID = newUser._id;
  return next();
}

const checkUser: AsyncMiddleware = async (req,res,next) => {
  console.log('in check user');
  const username = res.locals.username;
  const user = await UserModel.findOne({githubHandle:username});
  console.log(user,'user');
  if(user === null) return next();
  res.locals.user = user;
  if(user?.githubHandle === null) return next();
  else{
    return res.redirect('/account');
  }
}

const getUsername: AsyncMiddleware = async (req, res, next) => {
  if(res.locals.project) console.log(res.locals.project);
  const token = req.cookies.githubAuthToken;
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const user = await response.json();
  res.locals.username = user.login;
  return next();
}

const verifyUser: AsyncMiddleware = async (req, res, next) => {
  const { username } = res.locals;
  const user = await UserModel.findOne({githubHandle:username});
  return res.status(200).json(user);
}

const getRepositories: AsyncMiddleware = async (req, res, next) => {
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

const getUser: AsyncMiddleware = async (req,res,next) => {
  const user = await UserModel.findOne({githubHandle:res.locals.username});
  res.json(user);
}

module.exports = {
  createUser,
  getUsername,
  verifyUser,
  getRepositories,
  checkUser,
  getUser
}