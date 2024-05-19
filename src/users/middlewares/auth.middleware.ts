import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { UserDocument, UsersService } from "../user/users.service";
import { Types,  } from "mongoose";

export interface ExpressRequest extends Request {
  user?: UserDocument;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers["authorization"]) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = req.headers["authorization"].split(" ")[1];

    try {
      const decoded = verify(token, "JWT_SECRET") as { userId: Types.ObjectId };
      if (!decoded) {
        return res.status(401).json({status:401, message: "Unauthorized" });
      }
      if (!Types.ObjectId.isValid(decoded.userId)) {
        return res.status(401).json({status:401, message: "Unauthorized" });
      }
      const user = await this.userService.findById(decoded.userId);
      req.user = user;
      next();
    } catch (e) {
      req.user = null;
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
}
