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
import * as coupon from "./cms/CouponController";
import * as staff from "./cms/StaffController";
import * as file from "./cms/FileUploadController";

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
    coupon,
    staff,
    file,
  },
};

export default $api;
