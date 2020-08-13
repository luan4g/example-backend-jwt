import express from "express";

const routes = express.Router();

const authMiddlewares = require("./middlewares/auth");

import UserController from "./controllers/UserController";
import ProjectController from "./controllers/ProjectController";

const userController = new UserController();
const projectController = new ProjectController();

// routes.use(authMiddlewares);

routes.post("/create-user", userController.create);
routes.post("/signin", userController.index);
routes.post("/forgot-password", userController.update);
routes.post("/reset-password", userController.reset);

routes.get("/projects", authMiddlewares, projectController.index);

export default routes;
