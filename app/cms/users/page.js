"use client";

import $api from "@/app/_api";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";

const columns = [
  {
    title: "管理ユーザーID",
    dataIndex: "mail_address",
    customStyle: "",
    type: null,
  },
  {
    title: "権限タイプ",
    dataIndex: "level_type",
    customStyle: "",
    type: "levelType",
  },
  {
    title: "店舗",
    dataIndex: "studios",
    customStyle: "",
    type: "tagList",
  },
  {
    title: "更新日時",
    dataIndex: "updated_at",
    customStyle: "",
    type: "date",
  },
];

const UsersPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [admins, setAdmins] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async (queries) => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.admin.getMany(queries);
    if (isOk) {
      setAdmins(data);
    }
    setIsLoading(false);
  };

  const onSearch = (value) => {
    if (value?.length) {
      fetchAdmins({ mailAddress: value });
    }
  };

  return (
    <>
      <BaseTable
        columns={columns}
        data={admins}
        isLoading={isLoading}
        isCheckable={true}
        onSearch={onSearch}
      />
    </>
  );
};

export default UsersPage;
