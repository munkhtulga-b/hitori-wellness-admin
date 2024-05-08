"use client";

import { useCallback, useEffect, useState } from "react";
import { Tabs } from "antd";
import PageHeader from "@/app/_components/PageHeader";
import RecordStudio from "@/app/_components/records/RecordStudio";
import RecordPlan from "@/app/_components/records/RecordPlan";
import RecordReservation from "@/app/_components/records/RecordReservation";
import RecordProgram from "@/app/_components/records/RecordProgram";
import RecordUser from "@/app/_components/records/RecordUser";
import RecordStaff from "@/app/_components/records/RecordStaff";
import RecordItem from "@/app/_components/records/RecordItem";
import RecordCoupon from "@/app/_components/records/RecordCoupon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import $api from "@/app/_api";
import _ from "lodash";

const RecordsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [activeKey, setActiveKey] = useState("studios");
  const [studioOptions, setStudioOptions] = useState([]);
  const [studioCategoryNames, setStudioCategoryNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    count: 10,
    total: 0,
  });

  const [studios, setStudios] = useState(null);
  const [users, setUsers] = useState(null);
  const [programs, setPrograms] = useState(null);
  const [staff, setStaff] = useState(null);
  const [items, setItems] = useState(null);
  const [plans, setPlans] = useState(null);
  const [coupons, setCoupons] = useState(null);
  const [reservations, setReservations] = useState(null);

  useEffect(() => {
    const tabKey = searchParams.get("tab");
    if (tabKey) {
      setActiveKey(tabKey);
    } else {
      setActiveKey(tabItems[0].key);
    }
  }, []);

  useEffect(() => {
    fetchStudioOptions();
  }, []);

  const onTabChange = (key) => {
    setActiveKey(key);
    setPagination({
      current: 1,
      count: 10,
      total: 0,
    });
    router.push(pathname + "?" + createQueryString("tab", `${key}`));
  };

  const fetchStudioOptions = async () => {
    const { isOk, data } = await $api.admin.studio.getMany();
    if (isOk && data?.length) {
      const studios = _.map(data, ({ id: value, name: label }) => ({
        value,
        label,
      }));
      const categoryNames = _.map(
        data,
        ({ category_name: value, category_name: label }) => ({
          value,
          label,
        })
      );
      const categoryNamesSorted = _.uniqBy(categoryNames, "value");
      setStudioCategoryNames(categoryNamesSorted);
      setStudioOptions(studios);
    }
  };

  const fetchStudios = async (queries) => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.studio.getMany(queries);
    if (isOk) {
      setStudios(data);
    }
    setIsLoading(false);
  };

  const fetchUsers = async (queries) => {
    setIsLoading(true);
    const { isOk, data, range } = await $api.admin.user.getMany(
      queries
        ? queries
        : {
            page: pagination.current - 1,
            limit: pagination.count,
          }
    );
    if (isOk) {
      setUsers(data);
      setPagination((prev) => ({ ...prev, total: range.split("/")[1] }));
    }
    setIsLoading(false);
  };

  const fetchPrograms = async (queries) => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.program.getMany(queries);
    if (isOk) {
      setPrograms(data);
    }
    setIsLoading(false);
  };

  const fetchStaff = async (filters) => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.staff.getMany(filters);
    if (isOk) {
      setStaff(data);
    }
    setIsLoading(false);
  };

  const fetchItems = async (queries) => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.item.getMany(queries);
    if (isOk) {
      setItems(data);
    }
    setIsLoading(false);
  };

  const fetchPlans = async (queries) => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.plan.getMany(queries);
    if (isOk) {
      setPlans(data);
    }
    setIsLoading(false);
  };

  const fetchCoupons = async (queries) => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.coupon.getMany(queries);
    if (isOk) {
      setCoupons(data);
    }
    setIsLoading(false);
  };

  const fetchReservations = async (queries) => {
    setIsLoading(true);
    const { isOk, data, range } = await $api.admin.reservation.getMany(
      queries
        ? queries
        : { page: pagination.current - 1, limit: pagination.count }
    );
    if (isOk) {
      setReservations(data);
      setPagination((prev) => ({ ...prev, total: range.split("/")[1] }));
    }
    setIsLoading(false);
  };

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const tabItems = [
    {
      key: "studios",
      label: "店舗",
      children: (
        <RecordStudio
          studioCategoryNames={studioCategoryNames}
          list={studios}
          fetchData={fetchStudios}
          isLoading={isLoading}
        />
      ),
    },
    {
      key: "users",
      label: "メンバー",
      children: (
        <RecordUser
          studios={studioOptions}
          fetchData={fetchUsers}
          isLoading={isLoading}
          list={users}
          pagination={pagination}
          setPagination={setPagination}
        />
      ),
    },
    {
      key: "programs",
      label: "プログラム",
      children: (
        <RecordProgram
          studios={studioOptions}
          fetchData={fetchPrograms}
          isLoading={isLoading}
          list={programs}
        />
      ),
    },
    {
      key: "staff",
      label: "スタッフ",
      children: (
        <RecordStaff
          studios={studioOptions}
          fetchData={fetchStaff}
          isLoading={isLoading}
          list={staff}
        />
      ),
    },
    {
      key: "items",
      label: "商品",
      children: (
        <RecordItem
          studios={studioOptions}
          fetchData={fetchItems}
          list={items}
          isLoading={isLoading}
        />
      ),
    },
    {
      key: "plans",
      label: "プラン",
      children: (
        <RecordPlan
          studios={studioOptions}
          fetchData={fetchPlans}
          list={plans}
          isLoading={isLoading}
        />
      ),
    },
    {
      key: "coupons",
      label: "クーポン",
      children: (
        <RecordCoupon
          studios={studioOptions}
          fetchData={fetchCoupons}
          list={coupons}
          isLoading={isLoading}
        />
      ),
    },
    {
      key: "reservations",
      label: "予約",
      children: (
        <RecordReservation
          studios={studioOptions}
          list={reservations}
          isLoading={isLoading}
          fetchData={fetchReservations}
          pagination={pagination}
          setPagination={setPagination}
        />
      ),
    },
  ];

  const pageTitle = () => {
    let result = "店舗";
    if (activeKey === "users") {
      result = "メンバー";
    } else if (activeKey === "programs") {
      result = "プログラム";
    } else if (activeKey === "staff") {
      result = "スタッフ";
    } else if (activeKey === "items") {
      result = "商品";
    } else if (activeKey === "plans") {
      result = "プラン";
    } else if (activeKey === "tickets") {
      result = "チケット";
    } else if (activeKey === "coupons") {
      result = "クーポン";
    } else if (activeKey === "reservations") {
      result = "予約";
    }
    return result;
  };

  const exportData = () => {
    let result = [];
    if (activeKey === "studios") {
      result = studios;
    }
    if (activeKey === "users") {
      result = users;
    }
    if (activeKey === "programs") {
      result = programs;
    }
    if (activeKey === "staff") {
      result = staff;
    }
    if (activeKey === "items") {
      result = items;
    }
    if (activeKey === "plans") {
      result = plans;
    }
    if (activeKey === "coupons") {
      result = coupons;
    }
    if (activeKey === "reservations") {
      result = reservations;
    }
    return result;
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6">
        <PageHeader
          title={pageTitle()}
          isExportable={true}
          exportKey={activeKey}
          data={exportData()}
        />
        <Tabs activeKey={activeKey} items={tabItems} onChange={onTabChange} />
      </div>
    </>
  );
};

export default RecordsPage;
