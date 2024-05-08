"use client";

import $api from "@/app/_api";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
import RecordTableFilters from "./RecordTableFilters";
import { Modal, Select } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import CreateProgramModal from "./program/CreateProgramModal";
import { toast } from "react-toastify";
import _ from "lodash";
import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";

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
    enum: [
      {
        id: EEnumDatabaseStatus.ACTIVE.value,
        text: EEnumDatabaseStatus.ACTIVE.label,
        style: "tw-bg-bgActive tw-text-statusActive",
      },
      {
        id: EEnumDatabaseStatus.INACTIVE.value,
        text: EEnumDatabaseStatus.INACTIVE.label,
        style: "tw-bg-bgTag tw-text-statusInactive",
      },
    ],
    customStyle: "",
    type: "status",
  },
  {
    title: "更新日時",
    dataIndex: "updated_at",
    customStyle: "",
    type: "date",
  },
];

const RecordProgram = ({ list, fetchData, isLoading }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [checkedRows, setCheckedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const createProgram = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.program.create(body);
    if (isOk) {
      await fetchData();
      setModalKey((prev) => prev + 1);
      setIsModalOpen(false);
      toast.success("登録されました。");
    }
    setIsRequesting(false);
  };

  const updateProgram = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.program.update(selectedRow.id, body);
    if (isOk) {
      await fetchData();
      setIsModalOpen(false);
      setModalKey((prev) => prev + 1);
      toast.success("更新されました。");
    }
    setIsRequesting(false);
  };

  const deletePrograms = async () => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.program.deleteMany({
      ids: _.map(checkedRows, "id"),
    });
    if (isOk) {
      await fetchData(filters);
      setCheckedRows([]);
      toast.success("登録されました。");
    }
    setIsRequesting(false);
  };

  const onFilterChange = (filter) => {
    const shallowFilters = _.merge(filters, filter);
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

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6 tw-h-full">
        <RecordTableFilters
          onAdd={() => {
            setSelectedRow(null);
            setIsModalOpen(true);
          }}
          onDelete={deletePrograms}
          onSearch={(value) => onFilterChange({ name: value })}
          onSearchClear={() => onFilterClear("name")}
          checkedRows={checkedRows}
          isRequesting={isRequesting}
        >
          <>
            <Select
              allowClear
              size="large"
              style={{
                width: 120,
              }}
              options={[
                {
                  value: EEnumDatabaseStatus.ACTIVE.value,
                  label: EEnumDatabaseStatus.ACTIVE.label,
                },
                {
                  value: EEnumDatabaseStatus.INACTIVE.value,
                  label: EEnumDatabaseStatus.INACTIVE.label,
                },
              ]}
              onChange={(value) =>
                value
                  ? onFilterChange({ status: value })
                  : onFilterClear("status")
              }
              placeholder="ステータス"
            />
          </>
        </RecordTableFilters>
        <BaseTable
          tableId="admin-table"
          columns={columns}
          data={list}
          isLoading={isLoading}
          isCheckable={true}
          checkedRows={checkedRows}
          onRowCheck={(rows) => setCheckedRows(rows)}
          onClickName={(row) => {
            setSelectedRow(row);
            setIsModalOpen(true);
          }}
        />
      </div>

      <Modal
        title={selectedRow ? "プログラム情報" : "新規プログラム登録"}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        styles={{
          header: {
            marginBottom: 24,
          },
          content: {
            padding: 40,
          },
        }}
        closeIcon={<CloseOutlined style={{ fontSize: 24 }} />}
        destroyOnClose
      >
        <CreateProgramModal
          data={selectedRow}
          modalKey={modalKey}
          onBack={() => {
            setIsModalOpen(false);
          }}
          onComplete={!selectedRow ? createProgram : updateProgram}
          isRequesting={isRequesting}
        />
      </Modal>
    </>
  );
};

export default RecordProgram;
