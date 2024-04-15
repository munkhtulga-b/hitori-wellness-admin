"use client";

import { useCallback, useEffect, useState } from "react";
import { Tabs } from "antd";
import PageHeader from "@/app/_components/PageHeader";
import RecordStudio from "@/app/_components/records/RecordStudio";
import RecordPlan from "@/app/_components/records/RecordPlan";
import RecordReservation from "@/app/_components/records/RecordReservation";
import RecordProgram from "@/app/_components/records/RecordProgram";
import RecordTicket from "@/app/_components/records/RecordTicket";
import RecordUser from "@/app/_components/records/RecordUser";
import RecordStaff from "@/app/_components/records/RecordStaff";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const tabItems = [
  {
    key: "studios",
    label: "店舗",
    children: <RecordStudio />,
  },
  {
    key: "users",
    label: "メンバー",
    children: <RecordUser />,
  },
  {
    key: "programs",
    label: "プログラム",
    children: <RecordProgram />,
  },
  {
    key: "staff",
    label: "スタッフ",
    children: <RecordStaff />,
  },
  {
    key: "items",
    label: "商品",
    children: <></>,
  },
  {
    key: "plans",
    label: "プラン",
    children: <RecordPlan />,
  },
  {
    key: "tickets",
    label: "チケット",
    children: <RecordTicket />,
  },
  {
    key: "coupons",
    label: "クーポン",
    children: <></>,
  },
  {
    key: "reservations",
    label: "予約",
    children: <RecordReservation />,
  },
];

const RecordsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [activeKey, setActiveKey] = useState("studios");

  useEffect(() => {
    const tabKey = searchParams.get("tab");
    if (tabKey) {
      setActiveKey(tabKey);
    } else {
      setActiveKey(tabItems[0].key);
    }
  }, []);

  const onTabChange = (key) => {
    setActiveKey(key);
    router.push(pathname + "?" + createQueryString("tab", `${key}`));
  };

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6">
        <PageHeader title={`店舗`} />
        <Tabs activeKey={activeKey} items={tabItems} onChange={onTabChange} />
      </div>
    </>
  );
};

export default RecordsPage;
