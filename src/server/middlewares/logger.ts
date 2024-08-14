import express, { Request, Response, NextFunction } from 'express';

function loggerMiddleware(
  request: express.Request,
  response: express.Response,
  next: any
) {
  console.log(`${request.method} ${request.path}`);
  next();
}

export default loggerMiddleware;
