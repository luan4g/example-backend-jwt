import { Request, Response, NextFunction } from "express";

class ProjectController {
  async index(req: Request, res: Response) {
    res.send({ ok: "true", id: req.userId });
  }
}

export default ProjectController;
