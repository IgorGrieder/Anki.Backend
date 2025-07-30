import { Router } from "express";
import LoginService from "../services/loginService.js";
import Utils from "../utils/utils.js";
import {
  badRequest,
  internalServerErrorCode,
  noContentCode,
  notFoundCode,
  okCode,
} from "../constants/codeConstants.js";
import {
  emailAlreadyUsed,
  invalidArguments,
  logoutMessage,
  passwordChanged,
  unauthorizedMessage,
  unexpectedError,
  usernameAlreadyUsed,
  userNotFound,
} from "../constants/messageConstants.js";
import { jwt, maxAge, sameSite } from "../constants/jwtConstants.js";

// Router instance
const userRoutes = new Router();

// Middlewares ----------------------------------------------------------------
const validateLogIn = (req, res, next) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.status(badRequest).json({
      logged: false,
      message: invalidArguments,
    });
  }

  next();
};

const validatePasswordChange = (req, res, next) => {
  const { login, oldPassword, newPassword } = req.body;
  if (!login || !oldPassword || !newPassword) {
    return res.status(badRequest).json({
      logged: false,
      message: invalidArguments,
    });
  }

  next();
};

const validateCreateAccount = async (req, res, next) => {
  const { username, email, password } = req.body;
  let result;

  if (!username || !email || !password) {
    return res.status(badRequest).json({
      accountCreated: false,
      message: invalidArguments,
    });
  }

  result = await LoginService.findUser(username, false);

  if (result) {
    return res.status(badRequest).json({
      accountCreated: false,
      message: usernameAlreadyUsed,
    });
  }

  result = await LoginService.findUser(email, true);

  if (result) {
    return res.status(badRequest).json({
      accountCreated: false,
      message: emailAlreadyUsed,
    });
  }

  next();
};

// Routes ---------------------------------------------------------------------
userRoutes.post(
  "/change-password",
  validatePasswordChange,
  async (req, res) => {
    const { login, oldPassword, newPassword } = req.body;

    const result = await LoginService.updatePassword(
      login,
      oldPassword,
      newPassword
    );

    if (result.passwordUpdated) {
      return res.status(okCode).json({
        passwordChanged: true,
        message: passwordChanged,
      });
    }

    // User Not Found
    if (result.code === notFoundCode) {
      return res.status(result.code).json({
        passwordChanged: false,
        message: userNotFound,
      });
    }

    // Internal server error
    if (result.code === internalServerErrorCode) {
      return res.status(result.code).json({
        passwordChanged: false,
        message: unexpectedError,
      });
    }
  }
);

export default userRoutes;
