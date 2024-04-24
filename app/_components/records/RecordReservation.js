"use client";

import $api from "@/app/_api";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
import RecordTableFilters from "./RecordTableFilters";
import { Modal, Pagination } from "antd";
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
        id: EEnumReservationStatus.ACTIVE.value,
        text: EEnumReservationStatus.ACTIVE.label,
        style: "tw-bg-aquaLight tw-text-aquaMedium",
      },
      {
        id: EEnumReservationStatus.CANCELLED.value,
        text: EEnumReservationStatus.CANCELLED.label,
        style: "tw-bg-bgTag tw-text-grayMedium",
      },
      {
        id: EEnumReservationStatus.AUTOMATIC_CANCELLATION.value,
        text: EEnumReservationStatus.AUTOMATIC_CANCELLATION.label,
        style: "tw-bg-bgCancelled tw-text-cancelled",
      },
      {
        id: EEnumReservationStatus.CHECK_IN.value,
        text: EEnumReservationStatus.CHECK_IN.label,
        style: "tw-bg-bgActive tw-text-statusActive",
      },
      {
        id: EEnumReservationStatus.CHECK_OUT.value,
        text: EEnumReservationStatus.CHECK_OUT.label,
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
  const [pagination, setPagination] = useState({
    current: 1,
    count: 10,
    total: 0,
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async (queries) => {
    setIsLoading(true);
    const { isOk, data, range } = await $api.admin.reservation.getMany(
      queries
        ? queries
        : { page: pagination.current - 1, limit: pagination.count }
    );
    if (isOk) {
      setList(data);
      setPagination((prev) => ({ ...prev, total: range.split("/")[1] }));
    }
    setIsLoading(false);
  };

  const onPaginationChange = (page, pageSize) => {
    if (pagination.count == pageSize) {
      setPagination((prev) => ({ ...prev, current: page }));
    } else {
      setPagination((prev) => ({ ...prev, current: 0, count: pageSize }));
    }
    fetchReservations({
      page: pagination.count == pageSize ? page - 1 : 0,
      limit: pageSize,
    });
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
        <section className="tw-flex tw-justify-center">
          <Pagination
            current={pagination.current}
            pageSize={pagination.count}
            total={pagination.total}
            onChange={(page, pageSize) => onPaginationChange(page, pageSize)}
          />
        </section>
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
