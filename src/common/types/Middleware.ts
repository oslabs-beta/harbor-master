import { NextFunction, Request, Response } from "express";
import Error from "interfaces/Error";

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;
export type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined | void>;
export type ErrorHandlingMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => void;