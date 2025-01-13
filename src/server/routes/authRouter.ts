import express, { Request, Response, NextFunction } from 'express';
const {gitLogin,gitCookie} = require('../controllers/authController');
const {createUser,checkUser} = require('../controllers/userController');

const router = express.Router();

router.get('/github', gitLogin,(req,res)=>{
  if(res.locals.token && res.locals.username){
    res.status(200).send('Successfully logged in');
  }
});

router.get('/github/callback',gitCookie,checkUser,createUser,(req, res) => {
  console.log('finna redirect');
  return res.redirect('/account');
});

export default router;