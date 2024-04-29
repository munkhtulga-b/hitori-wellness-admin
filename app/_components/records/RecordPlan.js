"use client";

import $api from "@/app/_api";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
import RecordTableFilters from "./RecordTableFilters";
import { Modal, Select } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import _ from "lodash";
import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
import CreatePlanModal from "./plan/CreatePlanModal";
import { toast } from "react-toastify";

const columns = [
  {
    title: "名称",
    dataIndex: ["name", "code"],
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
    title: "初月会費（税込）",
    dataIndex: "first_month_price",
    customStyle: "",
    type: "price",
  },
  {
    title: "月会費（税込）",
    dataIndex: "monthly_price",
    customStyle: "",
    type: "price",
  },
  {
    title: "更新日時",
    dataIndex: "updated_at",
    customStyle: "",
    type: "date",
  },
];

const RecordPlan = ({ studios }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [list, setList] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedRow(null);
      setModalKey((prev) => prev + 1);
    }
  }, [isModalOpen]);

  const fetchPlans = async (queries) => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.plan.getMany(queries);
    if (isOk) {
      setList(data);
    }
    setIsLoading(false);
  };

  const createPlan = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.plan.create(body);
    if (isOk) {
      await fetchPlans();
      setModalKey((prev) => prev + 1);
      setIsModalOpen(false);
      toast.success("Plan created");
    }
    setIsRequesting(false);
  };

  const updatePlan = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.plan.update(selectedRow.id, body);
    if (isOk) {
      await fetchPlans();
      setModalKey((prev) => prev + 1);
      setIsModalOpen(false);
      toast.success("Plan updated");
    }
    setIsRequesting(false);
  };

  const onFilterChange = (filter) => {
    const shallow = _.merge(filters, filter);
    setFilters(shallow);
    fetchPlans(shallow);
  };

  const onFilterClear = (filterKey) => {
    if (filters) {
      const shallow = _.omit(filters, filterKey);
      setFilters(shallow);
      fetchPlans(shallow);
    }
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6">
        <RecordTableFilters
          onAdd={() => setIsModalOpen(true)}
          onSearch={(value) => onFilterChange({ name: value })}
          onSearchClear={() => onFilterClear("name")}
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
        title="プラン新規登録"
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
        <CreatePlanModal
          data={selectedRow}
          studios={studios}
          modalKey={modalKey}
          isRequesting={isRequesting}
          onComplete={selectedRow ? updatePlan : createPlan}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default RecordPlan;
