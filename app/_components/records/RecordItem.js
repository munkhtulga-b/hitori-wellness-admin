"use client";

import $api from "@/app/_api";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
import RecordTableFilters from "./RecordTableFilters";
import { Modal, Select } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
import EEnumItemTypes from "@/app/_enums/EEnumItemTypes";
import CreateItemModal from "./item/CreateItemModal";
import _ from "lodash";
import { toast } from "react-toastify";

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

const RecordItem = ({ studios, list, fetchData, isLoading }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const itemTypes = _.map(EEnumItemTypes, (value) => ({
    value: value.value,
    label: value.label,
  }));
  const [checkedRows, setCheckedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const createItem = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.item.create(body);
    if (isOk) {
      await fetchData();
      setModalKey((prev) => prev + 1);
      setIsModalOpen(false);
      toast.success("登録されました。");
    }
    setIsRequesting(false);
  };

  const updateItem = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.item.update(selectedRow.id, body);
    if (isOk) {
      await fetchData();
      setModalKey((prev) => prev + 1);
      setIsModalOpen(false);
      toast.success("更新されました。");
    }
    setIsRequesting(false);
  };

  const deleteItems = async () => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.item.deleteMany({
      ids: _.map(checkedRows, "id"),
    });
    if (isOk) {
      await fetchData();
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
      <div className="tw-flex tw-flex-col tw-gap-6">
        <RecordTableFilters
          onAdd={() => {
            setSelectedRow(null);
            setIsModalOpen(true);
          }}
          onDelete={deleteItems}
          onSearch={(value) => onFilterChange({ name: value })}
          checkedRows={checkedRows}
          isRequesting={isRequesting}
        >
          <>
            <Select
              disabled={!itemTypes?.length}
              allowClear
              size="large"
              style={{
                width: 120,
              }}
              options={itemTypes}
              onChange={(value) =>
                value
                  ? onFilterChange({ itemType: value })
                  : onFilterClear("itemType")
              }
              placeholder="カテゴリー"
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
        title={selectedRow ? "アイテム情報" : "新規アイテム登録"}
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
        destroyOnClose
      >
        <CreateItemModal
          data={selectedRow}
          modalKey={modalKey}
          studios={studios}
          onComplete={selectedRow ? updateItem : createItem}
          onBack={() => setIsModalOpen(false)}
          isRequesting={isRequesting}
        />
      </Modal>
    </>
  );
};

export default RecordItem;
