import $api from "../_api";

const fetchAdmins = async () => {
  const { isOk, data } = await $api.admin.admin.getMany();
  return {
    isOk,
    data,
  };
};

const fetchStudios = async () => {
  const { isOk, data } = await $api.admin.studio.getMany();
  return {
    isOk,
    data,
  };
};

const fetchUsers = async () => {
  const { isOk, data } = await $api.admin.user.getMany();
  return {
    isOk,
    data,
  };
};

const fetchPrograms = async () => {
  const { isOk, data } = await $api.admin.program.getMany();
  return {
    isOk,
    data,
  };
};

const fetchStaff = async () => {
  const { isOk, data } = await $api.admin.staff.getMany();
  return {
    isOk,
    data,
  };
};

const fetchItems = async () => {
  const { isOk, data } = await $api.admin.item.getMany();
  return {
    isOk,
    data,
  };
};

const fetchPlans = async () => {
  const { isOk, data } = await $api.admin.plan.getMany();
  return {
    isOk,
    data,
  };
};

const fetchCoupons = async () => {
  const { isOk, data } = await $api.admin.coupon.getMany();
  return {
    isOk,
    data,
  };
};

const fetchReservations = async () => {
  const { isOk, data } = await $api.admin.reservation.getMany();
  return {
    isOk,
    data,
  };
};

const fetchPurchases = async () => {
  const { isOk, data } = await $api.admin.purchase.getMany();
  return {
    isOk,
    data,
  };
};

const $csv = {
  admins: fetchAdmins,
  studios: fetchStudios,
  users: fetchUsers,
  programs: fetchPrograms,
  staff: fetchStaff,
  items: fetchItems,
  plans: fetchPlans,
  coupons: fetchCoupons,
  reservations: fetchReservations,
  purchases: fetchPurchases,
};

export default $csv;
