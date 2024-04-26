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

  useEffect(() => {
    const tabKey = searchParams.get("tab");
    if (tabKey) {
      setActiveKey(tabKey);
    } else {
      setActiveKey(tabItems[0].key);
    }
  }, []);

  useEffect(() => {
    fetchStudios();
  }, []);

  const onTabChange = (key) => {
    setActiveKey(key);
    router.push(pathname + "?" + createQueryString("tab", `${key}`));
  };

  const fetchStudios = async () => {
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
      children: <RecordStudio studioCategoryNames={studioCategoryNames} />,
    },
    {
      key: "users",
      label: "メンバー",
      children: <RecordUser studios={studioOptions} />,
    },
    {
      key: "programs",
      label: "プログラム",
      children: <RecordProgram studios={studioOptions} />,
    },
    {
      key: "staff",
      label: "スタッフ",
      children: <RecordStaff studios={studioOptions} />,
    },
    {
      key: "items",
      label: "商品",
      children: <RecordItem studios={studioOptions} />,
    },
    {
      key: "plans",
      label: "プラン",
      children: <RecordPlan studios={studioOptions} />,
    },
    {
      key: "coupons",
      label: "クーポン",
      children: <RecordCoupon studios={studioOptions} />,
    },
    {
      key: "reservations",
      label: "予約",
      children: <RecordReservation studios={studioOptions} />,
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

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6">
        <PageHeader title={pageTitle()} />
        <Tabs activeKey={activeKey} items={tabItems} onChange={onTabChange} />
      </div>
    </>
  );
};

export default RecordsPage;
