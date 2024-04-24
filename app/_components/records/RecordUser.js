"use client";

import $api from "@/app/_api";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
import RecordTableFilters from "./RecordTableFilters";
import { Modal, Select, Pagination } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
import _ from "lodash";
import CreateUserModal from "./user/CreateUserModal";
import { toast } from "react-toastify";

const columns = [
  {
    title: "氏名",
    dataIndex: [["last_name", "first_name"], "id"],
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
    dataIndex: "t_member_plan",
    nestedObject: "studio",
    nestedDataIndex: "name",
    customStyle: "",
    type: "singleListObjectItem",
  },
  {
    title: "ブラン",
    dataIndex: "t_member_plan",
    nestedObject: "plan",
    nestedDataIndex: "name",
    customStyle: "",
    type: "singleListObjectItem",
  },
  {
    title: "メールアドレス",
    dataIndex: "mail_address",
    customStyle: "",
    type: null,
  },
  {
    title: "更新日時",
    dataIndex: "updated_at",
    customStyle: "",
    type: "date",
  },
];

const RecordUser = ({ studios }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [list, setList] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [filters, setFilters] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    count: 10,
    total: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (queries) => {
    setIsLoading(true);
    const { isOk, data, range } = await $api.admin.user.getMany(
      queries
        ? queries
        : {
            page: pagination.current,
            limit: pagination.count,
          }
    );
    if (isOk) {
      setList(data);
      setPagination((prev) => ({ ...prev, total: range.split("/")[1] }));
    }
    setIsLoading(false);
  };

  const createUser = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.user.create(body);
    if (isOk) {
      await fetchUsers();
      setModalKey((prev) => prev + 1);
      setIsModalOpen(false);
      toast.success("User created");
    }
    setIsRequesting(false);
  };

  const deleteUsers = async () => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.user.deleteMany({
      ids: _.map(checkedRows, "id"),
    });
    if (isOk) {
      await fetchUsers(filters);
      setCheckedRows([]);
      toast.success("Users deleted");
    }
    setIsRequesting(false);
  };

  const onFilterChange = (filter) => {
    const shallowFilters = _.merge(filters, filter);
    const shallowPagination = {
      limit: pagination.count,
      page: pagination.current - 1,
    };
    const queries = _.merge(shallowFilters, shallowPagination);
    setFilters(queries);
    fetchUsers(queries);
  };

  const onFilterClear = (filterKey) => {
    if (filters) {
      const shallow = _.omit(filters, filterKey);
      setFilters(shallow);
      fetchUsers(shallow);
    }
  };

  const onPaginationChange = (page, pageSize) => {
    if (pagination.count == pageSize) {
      setPagination((prev) => ({ ...prev, current: page }));
    } else {
      setPagination((prev) => ({ ...prev, current: 0, count: pageSize }));
    }
    const queries = _.merge(filters, { page: page - 1, limit: pageSize });
    fetchUsers(queries);
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6 tw-h-full">
        <RecordTableFilters
          onAdd={() => setIsModalOpen(true)}
          onDelete={deleteUsers}
          studios={studios}
          onSearch={(value) => onFilterChange({ name: value })}
          onSearchClear={() => onFilterClear("name")}
          checkedRows={checkedRows}
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
        />
        <section className="tw-justify-self-end tw-flex tw-justify-center">
          <Pagination
            current={pagination.current}
            pageSize={pagination.count}
            total={pagination.total}
            onChange={(page, pageSize) => onPaginationChange(page, pageSize)}
          />
        </section>
      </div>

      <Modal
        title="メンバー詳細"
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
        <CreateUserModal
          modalKey={modalKey}
          onBack={() => setIsModalOpen(false)}
          onComplete={createUser}
          isRequesting={isRequesting}
        />
      </Modal>
    </>
  );
};

export default RecordUser;
