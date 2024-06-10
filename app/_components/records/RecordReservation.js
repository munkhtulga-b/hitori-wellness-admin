"use client";

import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
import RecordTableFilters from "./RecordTableFilters";
import { Modal, Pagination, Select } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import EEnumReservationStatus from "@/app/_enums/EEnumReservationStatus";
import _ from "lodash";
import ReservationDetailsModal from "./reservation/ReservationDetailsModal";
import $api from "@/app/_api";

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
    title: "予約日時",
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
    ],
    customStyle: "",
    type: "status",
  },
  {
    title: "予約作成",
    dataIndex: "created_at",
    customStyle: "",
    type: "date",
  },
];

const RecordReservation = ({
  studioFilterOptions,
  list,
  fetchData,
  isLoading,
  pagination,
  setPagination,
}) => {
  const [programs, setPrograms] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [modalKey, setModalKey] = useState(0);
  const [filters, setFilters] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetchData();
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    const { isOk, data } = await $api.admin.program.getMany();
    if (isOk) {
      const sorted = _.map(data, ({ id: value, name: label }) => ({
        value,
        label,
      }));
      setPrograms(sorted);
    }
  };

  const onFilterChange = (filter) => {
    const shallowFilters = _.merge(filters, filter, {
      page: 0,
      limit: pagination.count,
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
    setFilters(shallowFilters);
    fetchData(shallowFilters);
  };

  const onFilterClear = (filterKey) => {
    if (filters) {
      const shallow = _.omit(filters, filterKey);
      setFilters(shallow);
      fetchData(shallow);
    }
  };

  const onPaginationChange = (page, pageSize) => {
    if (pagination.count == pageSize) {
      setPagination((prev) => ({ ...prev, current: page }));
    } else {
      setPagination((prev) => ({ ...prev, current: 1, count: pageSize }));
    }
    const queries = _.merge(filters, { page: page - 1, limit: pageSize });
    fetchData(queries);
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6">
        <RecordTableFilters
          onAdd={null}
          onSearch={(value) => onFilterChange({ name: value })}
          onSearchClear={() => onFilterClear("name")}
        >
          <>
            <Select
              disabled={!studioFilterOptions}
              allowClear
              size="large"
              style={{
                width: 240,
              }}
              options={studioFilterOptions}
              onChange={(value) => {
                value
                  ? onFilterChange({ studioId: value })
                  : onFilterClear("studioId");
              }}
              placeholder="登録店舗"
            />
            <Select
              disabled={!programs}
              allowClear
              size="large"
              style={{
                width: 240,
              }}
              options={programs}
              onChange={(value) => {
                value
                  ? onFilterChange({ program: value })
                  : onFilterClear("program");
              }}
              placeholder="プログラム"
            />
            <Select
              allowClear
              size="large"
              style={{
                width: 150,
              }}
              options={_.map(EEnumReservationStatus, (value) => ({
                label: value.label,
                value: value.value,
              }))}
              onChange={(value) =>
                value
                  ? onFilterChange({ status: value })
                  : onFilterClear("status")
              }
              placeholder="ステータス"
            />
            <Select
              allowClear
              size="large"
              style={{
                width: 150,
              }}
              options={[]}
              // onChange={(value) =>
              //   value
              //     ? onFilterChange({ staff: value })
              //     : onFilterClear("staff")
              // }
              placeholder="スタッフ"
            />
          </>
        </RecordTableFilters>
        <BaseTable
          tableId="admin-table"
          columns={columns}
          data={list}
          isLoading={isLoading}
          isCheckable={false}
          onClickName={(row) => {
            setSelectedRow(row);
            setIsModalOpen(true);
          }}
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
        title="予約情報"
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
        <ReservationDetailsModal
          data={selectedRow}
          fetchList={fetchData}
          closeModal={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default RecordReservation;
