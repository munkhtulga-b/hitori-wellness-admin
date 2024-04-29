"use client";

import $api from "@/app/_api";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
import RecordTableFilters from "./RecordTableFilters";
import { Modal, Select } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import CreateCouponModal from "./coupon/CreateCouponModal";
import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
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
    title: "予約タイムスロット",
    dataIndex: ["start_at", "end_at"],
    customStyle: "",
    type: "date",
  },
  {
    title: "更新日時",
    dataIndex: "updated_at",
    customStyle: "",
    type: "date",
  },
];

const RecordCoupon = ({ studios }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [list, setList] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedRow(null);
      setModalKey((prev) => prev + 1);
    }
  }, [isModalOpen]);

  const fetchCoupons = async (queries) => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.coupon.getMany(queries);
    if (isOk) {
      setList(data);
    }
    setIsLoading(false);
  };

  const createCoupon = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.coupon.create(body);
    if (isOk) {
      await fetchCoupons(filters);
      setModalKey((prev) => prev + 1);
      setIsModalOpen(false);
    }
    setIsRequesting(false);
  };

  const updateCoupon = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.coupon.update(selectedRow.id, body);
    if (isOk) {
      await fetchCoupons(filters);
      setModalKey((prev) => prev + 1);
      setIsModalOpen(false);
    }
    setIsRequesting(false);
  };

  const deleteCoupons = async () => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.coupon.deleteMany({
      ids: _.map(checkedRows, "id"),
    });
    if (isOk) {
      await fetchCoupons(filters);
      setCheckedRows([]);
      toast.success("Coupons deleted");
    }
    setIsRequesting(false);
  };

  const onFilterChange = (filter) => {
    const shallowFilters = _.merge(filters, filter);
    setFilters(shallowFilters);
    fetchCoupons(shallowFilters);
  };

  const onFilterClear = (filterKey) => {
    if (filters) {
      const shallow = _.omit(filters, filterKey);
      setFilters(shallow);
      fetchCoupons(shallow);
    }
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6">
        <RecordTableFilters
          onAdd={() => setIsModalOpen(true)}
          onDelete={deleteCoupons}
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
                width: 200,
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
        title="クーポン新規登録"
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
        <CreateCouponModal
          data={selectedRow}
          onComplete={selectedRow ? updateCoupon : createCoupon}
          onCancel={() => setIsModalOpen(false)}
          modalKey={modalKey}
          isRequesting={isRequesting}
          studios={studios}
        />
      </Modal>
    </>
  );
};

export default RecordCoupon;
