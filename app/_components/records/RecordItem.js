"use client";

import $api from "@/app/_api";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
import RecordTableFilters from "./RecordTableFilters";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { EEnumStudioStatus } from "@/app/_enums/EEnumStudioStatus";
import CreateItemModal from "./item/CreateItemModal";

const columns = [
  {
    title: "名称",
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
    title: "カテゴリー",
    dataIndex: "item_type",
    customStyle: "",
    type: null,
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
    title: "金額（税込）",
    dataIndex: "prices",
    nestedDataIndex: "price",
    customStyle: "",
    type: "nestedListItem",
    nestType: "price",
  },
  {
    title: "更新日時",
    dataIndex: "updated_at",
    customStyle: "",
    type: "date",
  },
];

const RecordItem = () => {
  const [isLoading, setIsLoading] = useState(false);
  //   const [isRequesting, setIsRequesting] = useState(false);
  const [list, setList] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //   const [modalKey, setModalKey] = useState(0);
  //   const [filters, setFilters] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.item.getMany();
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
        title="商品新規登録"
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
        <CreateItemModal />
      </Modal>
    </>
  );
};

export default RecordItem;
