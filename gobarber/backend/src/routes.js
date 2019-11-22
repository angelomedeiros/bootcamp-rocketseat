import { Router } from "express";
import multer from "multer";

import multerConfig from "./config/multer";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import AuthMiddleware from "./app/middlewares/auth";
import FileController from "./app/controllers/FileController";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

// routes.use(AuthMiddleware); // All routes from here will apply middleware

routes.put("/users", AuthMiddleware, UserController.update);

routes.post("/files", AuthMiddleware, upload.single("file"), FileController.store);

export default routes;
