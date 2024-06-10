"use client";

import $api from "@/app/_api";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
import RecordTableFilters from "@/app/_components/records/RecordTableFilters";
import { Pagination, Select } from "antd";
import _ from "lodash";
import EEnumPaymentStatus from "@/app/_enums/EEnumPaymentStatus";
import PageHeader from "@/app/_components/PageHeader";
import $csv from "@/app/_resources/csv-data-fetchers";

const columns = [
  {
    title: "商品",
    dataIndex: ["name", "code"],
    nestedDataIndex: "item",
    imageIndex: null,
    styles: [
      "tw-leading-[22px] tw-tracking-[0.14px]",
      "tw-text-sm tw-tracking-[0.12px]",
    ],
    customStyle: "",
    type: "stackedList",
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
    title: "メンバー",
    dataIndex: "member",
    nestedDataIndex: ["last_name", "first_name"],
    customStyle: "",
    type: "nestedObjectItem",
  },
  {
    title: "登録店舗",
    dataIndex: "studio",
    nestedDataIndex: "name",
    customStyle: "",
    type: "nestedObjectItem",
  },
  {
    title: "支払い方法 ",
    dataIndex: ["brand", "card_last4"],
    nestedDataIndex: "payment_card_details",
    prefixes: ["", "XXXX XXXX XXXX"],
    customStyle: "noEvent",
    styles: [],
    type: "stackedList",
  },
  {
    title: "合計金額",
    dataIndex: "price",
    customStyle: "",
    type: "price",
  },
];

const PurchaseHistory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState(null);
  // const [modalKey, setModalKey] = useState(0);
  const [studios, setStudios] = useState(null);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    count: 10,
    total: 0,
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportRawData, setExportRawData] = useState(null);

  useEffect(() => {
    fetchPurchases();
    fetchStudios();
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

  const fetchStudios = async () => {
    const { isOk, data } = await $api.admin.studio.getMany();
    if (isOk) {
      setStudios(
        _.map(data, ({ id: value, name: label }) => ({ value, label }))
      );
    }
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
      setPagination((prev) => ({ ...prev, current: 1, count: pageSize }));
    }
    const queries = _.merge(filters, { page: page - 1, limit: pageSize });
    fetchPurchases(queries);
  };

  const onExport = async () => {
    setIsExporting(true);
    const { isOk, data } = await $csv.purchases();
    if (isOk) {
      setExportRawData(data);
    }
    setIsExporting(false);
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6">
        <PageHeader
          title={`購入履歴`}
          isExportable={true}
          exportKey={"purchases"}
          data={exportRawData}
          setData={setExportRawData}
          isExporting={isExporting}
          onExport={onExport}
        />
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
            <Select
              disabled={!studios}
              allowClear
              size="large"
              style={{
                width: 240,
              }}
              options={studios}
              onChange={(value) => {
                value
                  ? onFilterChange({ studioId: value })
                  : onFilterClear("studioId");
              }}
              placeholder="登録店舗"
            />
          </>
        </RecordTableFilters>
        <BaseTable
          tableId="admin-table"
          columns={columns}
          data={list}
          isLoading={isLoading}
          isCheckable={false}
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
    </>
  );
};

export default PurchaseHistory;
