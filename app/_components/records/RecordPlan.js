"use client";

import $api from "@/app/_api";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
import RecordTableFilters from "./RecordTableFilters";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import _ from "lodash";
import { toast } from "react-toastify";
import { EEnumStudioStatus } from "@/app/_enums/EEnumStudioStatus";
import CreateStudioModal from "./studio/CreateStudioModal";

const columns = [
  {
    title: "氏名",
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
        id: EEnumStudioStatus.ACTIVE,
        text: "有効",
        style: "tw-bg-bgActive tw-text-statusActive",
      },
      {
        id: EEnumStudioStatus.INACTIVE,
        text: "無効",
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

const RecordPlan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [list, setList] = useState(null);
  const [studios, setStudios] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    fetchPlans();
    fetchStudios();
  }, []);

  const fetchPlans = async () => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.plan.getMany();
    if (isOk) {
      setList(data);
    }
    setIsLoading(false);
  };

  const fetchStudios = async () => {
    const { isOk, data } = await $api.admin.studio.getMany();
    if (isOk) {
      const sorted = _.map(data, ({ id: value, name: label }) => ({
        value,
        label,
      }));
      setStudios(sorted);
    }
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6">
        <RecordTableFilters
          onAdd={() => setIsModalOpen(true)}
          studios={studios}
        />
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
        closeIcon={
          <CloseOutlined
            style={{ position: "absolute", right: 30, top: 30, fontSize: 24 }}
          />
        }
      >
        <CreateStudioModal
          isRequesting={isRequesting}
          modalKey={modalKey}
          onConfirm={(params) => createStudio(params)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default RecordPlan;
