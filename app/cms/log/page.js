"use client";

import { Modal, Pagination, Select } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import $api from "@/app/_api";
import { useEffect, useState } from "react";
import PageHeader from "@/app/_components/PageHeader";
import RecordTableFilters from "@/app/_components/records/RecordTableFilters";
import EEnumLogOperations from "@/app/_enums/EEnumLogOperations";
import _ from "lodash";
import BaseTable from "@/app/_components/tables/BaseTable";
import EEnumLogDataTypes from "@/app/_enums/EEnumLogDataTypes";

const columns = [
  {
    title: "対象データベース",
    dataIndex: "changed_field",
    enum: EEnumLogDataTypes,
    customStyle: "",
    type: null,
  },
  {
    title: "対象データ ",
    dataIndex: "new_value",
    nestedDataIndex: "id",
    type: "nestedObjectItem",
  },
  {
    title: "タスク",
    dataIndex: "action",
    enum: EEnumLogOperations,
    customStyle: "",
    type: null,
  },
  {
    title: "実行者 ",
    dataIndex: "mail_address",
    customStyle: "",
    type: null,
  },
  {
    title: "日時",
    dataIndex: "updated_at",
    customStyle: "",
    type: "date",
  },
];

const SystemLog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [filters, setFilters] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    count: 10,
    total: 0,
  });

  useEffect(() => {
    fetchLog({
      page: pagination.current - 1,
      limit: pagination.count,
    });
  }, []);

  const fetchLog = async (queries) => {
    setIsLoading(true);
    const { isOk, data, range } = await $api.admin.log.getMany(queries);
    if (isOk) {
      setList(data);
      if (range) {
        setPagination((prev) => ({ ...prev, total: range.split("/")[1] }));
      }
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
    fetchLog(queries);
  };

  const onFilterClear = (filterKey) => {
    if (filters) {
      const shallow = _.omit(filters, filterKey);
      setFilters(shallow);
      fetchLog(shallow);
    }
  };

  const onPaginationChange = (page, pageSize) => {
    if (pagination.count == pageSize) {
      setPagination((prev) => ({ ...prev, current: page }));
    } else {
      setPagination((prev) => ({ ...prev, current: 1, count: pageSize }));
    }
    const queries = _.merge(filters, { page: page - 1, limit: pageSize });
    fetchLog(queries);
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6">
        <PageHeader title={`ログ`} />
        <RecordTableFilters
          onAdd={null}
          onSearch={(value) => onFilterChange({ email: value })}
          onSearchClear={() => onFilterClear("email")}
        >
          <>
            <Select
              allowClear
              size="large"
              style={{
                width: 120,
              }}
              options={_.map(EEnumLogOperations, (value) => ({
                label: value.label,
                value: value.value,
              }))}
              onChange={(value) =>
                value
                  ? onFilterChange({ action: value })
                  : onFilterClear("action")
              }
              placeholder="タスク"
            />
            <Select
              disabled={!EEnumLogDataTypes}
              allowClear
              size="large"
              style={{
                width: 200,
              }}
              options={_.map(EEnumLogDataTypes, (type) => ({
                label: type.label,
                value: type.value,
              }))}
              onChange={(value) => {
                value
                  ? onFilterChange({ table: value })
                  : onFilterClear("table");
              }}
              placeholder="対象データ"
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

export default SystemLog;
