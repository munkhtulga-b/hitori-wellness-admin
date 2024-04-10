"use client";

import $api from "@/app/_api";
import AdminTableFilters from "@/app/_components/admins/TableFilters";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import AddModal from "@/app/_components/admins/AddModal";
import _ from "lodash";
import { toast } from "react-toastify";
import PageHeader from "@/app/_components/PageHeader";

const columns = [
  {
    title: "管理ユーザーID",
    dataIndex: "mail_address",
    customStyle: "",
    type: null,
  },
  {
    title: "権限タイプ",
    dataIndex: "level_type",
    customStyle: "",
    type: "levelType",
  },
  {
    title: "店舗",
    dataIndex: "studios",
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

const UsersPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [admins, setAdmins] = useState(null);
  const [studios, setStudios] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    fetchAdmins();
    fetchStudios();
  }, []);

  const fetchAdmins = async (queries) => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.admin.getMany(queries);
    if (isOk) {
      setAdmins(data);
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

  const registerAdmin = async (params) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.admin.create(params);
    if (isOk) {
      await fetchAdmins();
      setIsModalOpen(false);
      setModalKey((prev) => prev + 1);
      toast.success("管理ユーザーが招待されました。");
    }
    setIsRequesting(false);
  };

  const deleteAdmins = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.admin.deleteMany(body);
    if (isOk) {
      setCheckedRows([]);
      await fetchAdmins();
      toast.success("管理ユーザーが削除されました。");
    }
    setIsRequesting(false);
  };

  const onDelete = () => {
    if (checkedRows?.length) {
      const ids = _.map(checkedRows, "id");
      deleteAdmins({ ids });
    }
  };

  const onFilterChange = (filter) => {
    const shallow = _.merge(filters, filter);
    setFilters(shallow);
    fetchAdmins(shallow);
  };

  const onFilterClear = (filterKey) => {
    if (filters) {
      const shallow = _.omit(filters, filterKey);
      setFilters(shallow);
      fetchAdmins(shallow);
    }
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6">
        <PageHeader
          title={`管理ユーザー`}
          isExportable={true}
          exportKey="admin"
          data={admins}
        />
        <AdminTableFilters
          studios={studios}
          onDelete={onDelete}
          onAdd={() => setIsModalOpen(true)}
          onSearch={(value) => onFilterChange({ mailAddress: value })}
          onLevelTypeChange={(value) => onFilterChange({ levelType: value })}
          onStudioChange={(value) => onFilterChange({ studioId: value })}
          onFilterClear={onFilterClear}
          isRequesting={isRequesting}
          checkedRows={checkedRows}
        />
        <BaseTable
          tableId="admin-table"
          columns={columns}
          data={admins}
          isLoading={isLoading}
          isCheckable={true}
          checkedRows={checkedRows}
          onRowCheck={(rows) => setCheckedRows(rows)}
        />
      </div>

      <Modal
        title="新規登録"
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
        <AddModal
          studios={studios}
          isRequesting={isRequesting}
          onConfirm={registerAdmin}
          modalKey={modalKey}
        />
      </Modal>
    </>
  );
};

export default UsersPage;
