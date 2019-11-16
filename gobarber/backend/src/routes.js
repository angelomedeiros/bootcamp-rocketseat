import { Router } from "express";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import AuthMiddleware from "./app/middlewares/auth";

const routes = new Router();

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

// routes.use(AuthMiddleware); // All routes from here will apply middleware

routes.put("/users", AuthMiddleware, UserController.update);

export default routes;
