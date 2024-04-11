"use client";

import $api from "@/app/_api";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
// import { Modal } from "antd";
// import { CloseOutlined } from "@ant-design/icons";
// import _ from "lodash";
// import { toast } from "react-toastify";

const columns = [
  {
    title: "名称",
    dataIndex: ["name", "code"],
    imageIndex: "thumbnail_code",
    styles: [
      "tw-leading-[22px] tw-tracking-[0.14px]",
      "tw-text-sm tw-tracking-[0.12px]",
    ],
    customStyle: "",
    type: "stackedList",
  },
  {
    title: "ステータス",
    dataIndex: "status",
    customStyle: "",
    type: "status",
  },
  {
    title: "エリア",
    dataIndex: "prefecture",
    customStyle: "",
    type: null,
  },
  {
    title: "営業時間 ",
    dataIndex: "timeperiod_details",
    customStyle: "",
    type: "timePeriod",
  },
  {
    title: "更新日時",
    dataIndex: "updated_at",
    customStyle: "",
    type: "date",
  },
];

const UsersPage = () => {
  //   const [isLoading, setIsLoading] = useState(false);
  //   const [isRequesting, setIsRequesting] = useState(false);
  const [list, setList] = useState(null);
  //   const [studios, setStudios] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  //   const [isModalOpen, setIsModalOpen] = useState(false);
  //   const [modalKey, setModalKey] = useState(0);
  //   const [filters, setFilters] = useState(null);

  useEffect(() => {
    fetchStudios();
  }, []);

  const fetchStudios = async () => {
    const { isOk, data } = await $api.admin.studio.getMany();
    if (isOk) {
      //   const sorted = _.map(data, ({ id: value, name: label }) => ({
      //     value,
      //     label,
      //   }));
      //   setStudios(sorted);
      setList(data);
    }
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6">
        <BaseTable
          tableId="admin-table"
          columns={columns}
          data={list}
          //   isLoading={isLoading}
          isCheckable={true}
          checkedRows={checkedRows}
          onRowCheck={(rows) => setCheckedRows(rows)}
        />
      </div>
    </>
  );
};

export default UsersPage;
