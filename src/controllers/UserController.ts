import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mailer from "../modules/mailer";

import knex from "../database/connection";
const authConfig = require("../config/auth");

function generateToken(params = {}) {
  const token = jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });

  return token;
}

class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const [EmailRegisted] = await knex("users").where("email", email);
    if (EmailRegisted)
      return res.status(400).send({ error: "This user already exist" });

    const user = {
      name,
      email,
      password,
    };

    const hash = await bcrypt.hash(password, 10);
    user.password = hash;

    const insertedUser = await knex("users").insert(user);

    user.password = undefined;

    const token = generateToken({ id: insertedUser[0] });

    res.send({ user, token });
  }

  async index(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await knex("users").where("email", email).select("*").first();

    if (!user) return res.status(400).send({ error: "User not found" });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).send({ error: "Password invalid" });

    user.password = undefined;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    const token = generateToken({ id: user.id });

    return res.send({ user, token });
  }

  async update(req: Request, res: Response) {
    const { email } = req.body;

    const user = await knex("users").where("email", email).select("*").first();

    if (!user) return res.status(400).send({ error: "User not found!" });

    const token = crypto.randomBytes(20).toString("hex");

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await knex("users").where("email", email).select("*").update({
      passwordResetToken: token,
      passwordResetExpires: now,
    });

    const mail = {
      from: "ak1r4gh0st@gmail.com",
      to: email,
      subject: "Reset password",
      template: "auth/forgot-password",
      context: {
        token,
      },
    };

    mailer.sendMail(mail, (err) => {
      if (err) return res.status(400).send({ error: err });

      return res.send();
    });
  }

  async reset(req: Request, res: Response) {
    const { email, token, password } = req.body;

    const user = await knex("users").where("email", email).select("*").first();

    if (!user) return res.status(400).send({ error: "User not found" });

    if (token !== user.passwordResetToken)
      return res.status(400).send({ error: "Token invalid" });

    const now = new Date();

    if (now > user.passwordResetExpires)
      return res.status(400).send({ error: "Token expired, get a new token" });

    const hash = await bcrypt.hash(password, 10);

    await knex("users").where("email", email).select("*").update({
      password: hash,
    });

    user.password = undefined;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    return res.send(user);
  }
}

export default UserController;
