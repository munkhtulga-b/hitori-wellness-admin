// Auth API
import login from "./auth/LoginController";

// Admin API
import * as admin from "./cms/AdminController";
import * as access from "./cms/AdminAccessController";
import * as studio from "./cms/StudioController";
import * as user from "./cms/UserController";
import * as program from "./cms/ProgramController";
import * as reservation from "./cms/ReservationController";
import * as item from "./cms/ItemController";
import * as plan from "./cms/PlanController";

const $api = {
  auth: {
    login,
  },
  admin: {
    admin,
    studio,
    access,
    user,
    program,
    reservation,
    item,
    plan,
  },
};

export default $api;
