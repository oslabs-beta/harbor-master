import { Request, Response, NextFunction } from "express";

class ErrorController {
  constructor () { }

  handleError(err: Error, req: Request, res: Response, next: NextFunction) {
    const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: 'An error occurred', 
  };
  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);
  res.status(errorObj.status).json(errorObj.message);
  }
}

export default new ErrorController();