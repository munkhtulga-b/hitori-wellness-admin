"use client";

import $api from "@/app/_api";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
import RecordTableFilters from "./RecordTableFilters";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import EEnumReservationStatus from "@/app/_enums/EEnumReservationStatus";

const columns = [
  {
    title: "氏名",
    dataIndex: [["last_name", "first_name"], "id"],
    nestedDataIndex: "member",
    imageIndex: null,
    styles: [
      "tw-leading-[22px] tw-tracking-[0.14px]",
      "tw-text-sm tw-tracking-[0.12px]",
    ],
    customStyle: "",
    type: "stackedList",
  },
  {
    title: "登録店舗",
    dataIndex: "m_studio",
    nestedDataIndex: "name",
    customStyle: "",
    type: "nestedObjectItem",
  },
  {
    title: "プログラム",
    dataIndex: "m_program",
    nestedDataIndex: "name",
    customStyle: "",
    type: "nestedObjectItem",
  },
  {
    title: "営業時間 ",
    dataIndex: "created_at",
    customStyle: "",
    type: "date",
  },
  {
    title: "予約タイムスロット",
    dataIndex: ["start_at", "end_at"],
    customStyle: "",
    type: "date",
  },
  {
    title: "ステータス",
    dataIndex: "status",
    enum: [
      {
        id: EEnumReservationStatus.ACTIVE,
        text: "予約中",
        style: "tw-bg-aquaLight tw-text-aquaMedium",
      },
      {
        id: EEnumReservationStatus.CANCELLED,
        text: "キャンセル済み",
        style: "tw-bg-bgTag tw-text-grayMedium",
      },
      {
        id: EEnumReservationStatus.AUTOMATIC_CANCELLATION,
        text: "無断キャンセル",
        style: "tw-bg-bgCancelled tw-text-cancelled",
      },
      {
        id: EEnumReservationStatus.CHECK_IN,
        text: "チェックイン",
        style: "tw-bg-bgActive tw-text-statusActive",
      },
      {
        id: EEnumReservationStatus.CHECK_OUT,
        text: "チェックアウト",
        style: "tw-bg-bgActive tw-text-statusActive",
      },
    ],
    customStyle: "",
    type: "status",
  },
];

const RecordReservation = () => {
  const [isLoading, setIsLoading] = useState(false);
  // const [isRequesting, setIsRequesting] = useState(false);
  const [list, setList] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [modalKey, setModalKey] = useState(0);
  // const [filters, setFilters] = useState({});
  // const [pagination, setPagination] = useState({
  //   page: 1,
  //   count: 10
  // })
  // const [queries, setQueries] = useState({});

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.reservation.getMany();
    if (isOk) {
      setList(data);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6">
        <RecordTableFilters onAdd={() => setIsModalOpen(true)} />
        <BaseTable
          tableId="admin-table"
          columns={columns}
          data={list}
          isLoading={isLoading}
          isCheckable={true}
          checkedRows={checkedRows}
          onRowCheck={(rows) => setCheckedRows(rows)}
        />
      </div>

      <Modal
        title="店舗新規登録"
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        styles={{
          header: {
            marginBottom: 24,
          },
          content: {
            padding: 40,
          },
        }}
        closeIcon={<CloseOutlined style={{ fontSize: 24 }} />}
      >
        Create Reservation Modal
      </Modal>
    </>
  );
};

export default RecordReservation;
