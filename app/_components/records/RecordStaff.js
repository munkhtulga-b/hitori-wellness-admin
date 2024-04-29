"use client";

import $api from "@/app/_api";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
import RecordTableFilters from "./RecordTableFilters";
import { Modal, Select } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import _ from "lodash";
import { toast } from "react-toastify";
import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
import CreateStaffModal from "./staff/CreateStaffModal";

const columns = [
  {
    title: "氏名",
    dataIndex: ["name", "code"],
    imageIndex: null,
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
    title: "登録店舗",
    dataIndex: "studio_ids",
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

const RecordStaff = ({ studios }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [list, setList] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedRow(null);
      setModalKey((prev) => prev + 1);
    }
  }, [isModalOpen]);

  const fetchStaff = async (filters) => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.staff.getMany(filters);
    if (isOk) {
      setList(data);
    }
    setIsLoading(false);
  };

  const createStaff = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.staff.create(body);
    if (isOk) {
      await fetchStaff();
      setModalKey((prev) => prev + 1);
      setIsModalOpen(false);
      toast.success("Staff created successfully");
    }
    setIsRequesting(false);
  };

  const updateStaff = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.staff.update(selectedRow.id, body);
    if (isOk) {
      await fetchStaff();
      setModalKey((prev) => prev + 1);
      setIsModalOpen(false);
      toast.success("Staff updated successfully");
    }
    setIsRequesting(false);
  };

  const deleteStaff = async () => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.staff.deleteMany({
      ids: _.map(checkedRows, "id"),
    });
    if (isOk) {
      setCheckedRows([]);
      await fetchStaff();
      toast.success("Staff deleted successfully");
    }
    setIsRequesting(false);
  };

  const onFilterChange = (filter) => {
    const shallow = _.merge(filters, filter);
    setFilters(shallow);
    fetchStaff(shallow);
  };

  const onFilterClear = (filterKey) => {
    if (filters) {
      const shallow = _.omit(filters, filterKey);
      setFilters(shallow);
      fetchStaff(shallow);
    }
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6">
        <RecordTableFilters
          onAdd={() => setIsModalOpen(true)}
          studios={studios}
          checkedRows={checkedRows}
          onDelete={deleteStaff}
          onSearch={(value) => onFilterChange({ name: value })}
          onSearchClear={() => onFilterClear("name")}
          isRequesting={isRequesting}
        >
          <>
            <Select
              disabled={!studios}
              allowClear
              size="large"
              style={{
                width: 120,
              }}
              options={studios}
              onChange={(value) => {
                value
                  ? onFilterChange({ studioId: value })
                  : onFilterClear("studioId");
              }}
              placeholder="登録店舗"
            />
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
        <CreateStaffModal
          data={selectedRow}
          modalKey={modalKey}
          onCancel={() => setIsModalOpen(false)}
          studios={studios}
          isRequesting={isRequesting}
          onConfirm={selectedRow ? updateStaff : createStaff}
        />
      </Modal>
    </>
  );
};

export default RecordStaff;
