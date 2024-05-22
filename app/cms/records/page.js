"use client";

import { useCallback, useEffect, useState } from "react";
import { Tabs, FloatButton } from "antd";
import { VerticalAlignTopOutlined } from "@ant-design/icons";
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

  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);
  const [activeKey, setActiveKey] = useState("studios");
  const [studioFilterOptions, setStudioFilterOptions] = useState([]);
  const [studioEditOptions, setStudioEditOptions] = useState([]);
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

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
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
    const { isOk, data } = await $api.admin.studio.getMany({ list: true });
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
      setStudioEditOptions(studios);
    }
  };

  const fetchStudios = async (queries) => {
    setIsLoading(true);
    const { isOk, data, range } = await $api.admin.studio.getMany(queries);
    if (isOk) {
      setStudios(data);
      if (!studioFilterOptions?.length) {
        const options = _.map(data, ({ id: value, name: label }) => ({
          value,
          label,
        }));
        setStudioFilterOptions(options);
      }
      console.log(range, "asdasd");
      setPagination((prev) => ({ ...prev, total: range.split("/")[1] }));
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
    const { isOk, data, range } = await $api.admin.program.getMany(queries);
    if (isOk) {
      setPrograms(data);
      setPagination((prev) => ({ ...prev, total: range.split("/")[1] }));
    }
    setIsLoading(false);
  };

  const fetchStaff = async (filters) => {
    setIsLoading(true);
    const { isOk, data, range } = await $api.admin.staff.getMany(filters);
    if (isOk) {
      setStaff(data);
      setPagination((prev) => ({ ...prev, total: range.split("/")[1] }));
    }
    setIsLoading(false);
  };

  const fetchItems = async (queries) => {
    setIsLoading(true);
    const { isOk, data, range } = await $api.admin.item.getMany(queries);
    if (isOk) {
      setItems(data);
      setPagination((prev) => ({ ...prev, total: range.split("/")[1] }));
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
    const { isOk, data, range } = await $api.admin.coupon.getMany(queries);
    if (isOk) {
      setCoupons(data);
      setPagination((prev) => ({ ...prev, total: range.split("/")[1] }));
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
          pagination={pagination}
          setPagination={setPagination}
        />
      ),
    },
    {
      key: "users",
      label: "メンバー",
      children: (
        <RecordUser
          studioEditOptions={studioEditOptions}
          studioFilterOptions={studioFilterOptions}
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
          studioEditOptions={studioEditOptions}
          studioFilterOptions={studioFilterOptions}
          fetchData={fetchPrograms}
          isLoading={isLoading}
          list={programs}
          pagination={pagination}
          setPagination={setPagination}
        />
      ),
    },
    {
      key: "staff",
      label: "スタッフ",
      children: (
        <RecordStaff
          studioEditOptions={studioEditOptions}
          studioFilterOptions={studioFilterOptions}
          fetchData={fetchStaff}
          isLoading={isLoading}
          list={staff}
          pagination={pagination}
          setPagination={setPagination}
        />
      ),
    },
    {
      key: "items",
      label: "商品",
      children: (
        <RecordItem
          studioEditOptions={studioEditOptions}
          studioFilterOptions={studioFilterOptions}
          fetchData={fetchItems}
          list={items}
          isLoading={isLoading}
          pagination={pagination}
          setPagination={setPagination}
        />
      ),
    },
    {
      key: "plans",
      label: "プラン",
      children: (
        <RecordPlan
          studioEditOptions={studioEditOptions}
          studioFilterOptions={studioFilterOptions}
          fetchData={fetchPlans}
          list={plans}
          isLoading={isLoading}
          pagination={pagination}
          setPagination={setPagination}
        />
      ),
    },
    {
      key: "coupons",
      label: "クーポン",
      children: (
        <RecordCoupon
          studioEditOptions={studioEditOptions}
          studioFilterOptions={studioFilterOptions}
          fetchData={fetchCoupons}
          list={coupons}
          isLoading={isLoading}
          pagination={pagination}
          setPagination={setPagination}
        />
      ),
    },
    {
      key: "reservations",
      label: "予約",
      children: (
        <RecordReservation
          studioEditOptions={studioEditOptions}
          studioFilterOptions={studioFilterOptions}
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

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Show button when user scrolls to bottom
  const toggleVisibility = () => {
    if (window.scrollY > 100) {
      // Show button after scrolling down 300px
      setIsScrollTopVisible(true);
    } else {
      setIsScrollTopVisible(false);
    }
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
        <Tabs
          destroyInactiveTabPane
          activeKey={activeKey}
          items={tabItems}
          onChange={onTabChange}
        />
        {isScrollTopVisible && (
          <FloatButton
            icon={<VerticalAlignTopOutlined />}
            onClick={() => scrollToTop()}
          />
        )}
      </div>
    </>
  );
};

export default RecordsPage;
