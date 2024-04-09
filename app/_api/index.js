// Auth API
import login from "./auth/LoginController";

// Admin API
import * as admin from "./cms/AdminController";

const $api = {
  auth: {
    login,
  },
  admin: {
    admin,
  },
};

export default $api;
