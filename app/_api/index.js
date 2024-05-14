// Auth API
import login from "./auth/LoginController";
import password from "./auth/PasswordController";

// Admin API
import * as admin from "./cms/AdminController";
import * as access from "./cms/AdminAccessController";
import * as studio from "./cms/StudioController";
import * as user from "./cms/UserController";
import * as program from "./cms/ProgramController";
import * as reservation from "./cms/ReservationController";
import * as item from "./cms/ItemController";
import * as ticket from "./cms/TicketController";
import * as plan from "./cms/PlanController";
import * as coupon from "./cms/CouponController";
import * as staff from "./cms/StaffController";
import * as file from "./cms/FileUploadController";
import * as staffSlot from "./cms/InstructorSlotController";
import * as shiftSlot from "./cms/ShiftSlotController";
import * as purchase from "./cms/PurchaseController";
import * as post from "./cms/PostJPController";

const $api = {
  auth: {
    login,
    password,
  },
  admin: {
    admin,
    studio,
    access,
    user,
    program,
    reservation,
    item,
    ticket,
    plan,
    coupon,
    staff,
    file,
    staffSlot,
    shiftSlot,
    purchase,
    post,
  },
};

export default $api;
