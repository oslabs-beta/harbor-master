import { Request, Response, NextFunction } from 'express';

export default interface AuthController {
  githubLogin: (req: Request, res: Response, next: NextFunction) => void
  callback: (req: Request, res: Response, next: NextFunction) => Promise<void>
}