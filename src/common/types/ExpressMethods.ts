import { NextFunction, Request, Response } from "express";

export type ExpressMethod = (req: Request, res: Response, next: NextFunction) => void;
export type AsyncExpressMethod = (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined | void>;