import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const authConfig = require("../config/auth");

module.exports = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.status(401).send({ error: "Token not informed" });

  const parts = authHeader.split(" ");

  if (parts.length !== 2) return res.status(401).send({ error: "Token error" });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: "Badly formatted Token" });

  jwt.verify(token, authConfig.secret, (err: any, decoded: any) => {
    if (err) res.status(401).send({ error: "Token invalid" });

    req.userId = decoded.id;
    return next();
  });
};
