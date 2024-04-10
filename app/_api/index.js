// Auth API
import login from "./auth/LoginController";

// Admin API
import * as admin from "./cms/AdminController";
import * as access from "./cms/AdminAccessController";
import * as studio from "./cms/StudioController";

const $api = {
  auth: {
    login,
  },
  admin: {
    admin,
    studio,
    access,
  },
};

export default $api;
