"use client";

import $api from "@/app/_api";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
import RecordTableFilters from "@/app/_components/records/RecordTableFilters";
import { Modal, Pagination, Select } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import _ from "lodash";
import EEnumPaymentStatus from "@/app/_enums/EEnumPaymentStatus";
import PageHeader from "@/app/_components/PageHeader";

const columns = [
  {
    title: "商品",
    dataIndex: ["id", "name"],
    nestedDataIndex: ["t_member_plan", "t_member_ticket"],
    customStyle: "",
    type: "flexList",
  },
  {
    title: "日時",
    dataIndex: "purchased_at",
    customStyle: "",
    type: "date",
  },
  {
    title: "ステータス",
    dataIndex: "payment_type",
    enum: [
      {
        id: EEnumPaymentStatus.FAILED.value,
        text: EEnumPaymentStatus.FAILED.label,
        style: "tw-bg-bgCancelled tw-text-cancelled",
      },
      {
        id: EEnumPaymentStatus.PAID.value,
        text: EEnumPaymentStatus.PAID.label,
        style: "tw-bg-bgActive tw-text-statusActive",
      },
    ],
    customStyle: "",
    type: "status",
  },
  {
    title: "メンバー・登録店舗",
    dataIndex: "m_program",
    nestedDataIndex: "name",
    customStyle: "",
    type: "nestedObjectItem",
  },
  {
    title: "支払い方法 ",
    dataIndex: ["brand", "card_last4"],
    nestedDataIndex: "payment_card_details",
    prefixes: ["", "XXXX XXXX XXXX"],
    customStyle: "",
    styles: [],
    type: "stackedList",
  },
  {
    title: "合計",
    dataIndex: "price",
    customStyle: "",
    type: "price",
  },
];

const PurchaseHistory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [modalKey, setModalKey] = useState(0);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    count: 10,
    total: 0,
  });
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async (queries) => {
    setIsLoading(true);
    const { isOk, data, range } = await $api.admin.purchase.getMany(
      queries
        ? queries
        : {
            page: pagination.current - 1,
            limit: pagination.count,
          }
    );
    if (isOk) {
      setList(data);
      setPagination((prev) => ({ ...prev, total: range.split("/")[1] }));
    }
    setIsLoading(false);
  };

  const onFilterChange = (filter) => {
    const shallowFilters = _.merge(filters, filter);
    const shallowPagination = {
      limit: pagination.count,
      page: pagination.current - 1,
    };
    const queries = _.merge(shallowFilters, shallowPagination);
    setFilters(queries);
    fetchPurchases(queries);
  };

  const onFilterClear = (filterKey) => {
    if (filters) {
      const shallow = _.omit(filters, filterKey);
      setFilters(shallow);
      fetchPurchases(shallow);
    }
  };

  const onPaginationChange = (page, pageSize) => {
    if (pagination.count == pageSize) {
      setPagination((prev) => ({ ...prev, current: page }));
    } else {
      setPagination((prev) => ({ ...prev, current: 0, count: pageSize }));
    }
    const queries = _.merge(filters, { page: page - 1, limit: pageSize });
    fetchPurchases(queries);
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6">
        <PageHeader title={`購入履歴`} />
        <RecordTableFilters
          onAdd={null}
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
              options={_.map(EEnumPaymentStatus, (value) => ({
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
        {selectedRow?.id}
      </Modal>
    </>
  );
};

export default PurchaseHistory;
