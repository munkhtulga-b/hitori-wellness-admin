"use client";

import $api from "@/app/_api";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
import RecordTableFilters from "./RecordTableFilters";
import { Modal, Select } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import _ from "lodash";
import { toast } from "react-toastify";
import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
import CreateStudioModal from "./studio/CreateStudioModal";
import { uploadImage } from "@/app/_utils/helpers";

const columns = [
  {
    title: "名称",
    dataIndex: ["name", "code"],
    imageIndex: "thumbnail_code",
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
    title: "エリア",
    dataIndex: "category_name",
    customStyle: "",
    type: null,
  },
  {
    title: "営業時間 ",
    dataIndex: "timeperiod_details",
    customStyle: "",
    type: "timePeriod",
  },
  {
    title: "更新日時",
    dataIndex: "updated_at",
    customStyle: "",
    type: "date",
  },
];

const RecordStudio = ({ studioCategoryNames }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [list, setList] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [filters, setFilters] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    fetchStudios();
  }, []);

  const fetchStudios = async (filters) => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.studio.getMany(filters);
    if (isOk) {
      setList(data);
    }
    setIsLoading(false);
  };

  const createStudio = async (body) => {
    setIsRequesting(true);
    const { isOk: uploadOk, data: uploadData } = await uploadImage(uploadFile);
    if (uploadOk) {
      body.thumbnailCode = uploadData.url;
      const { isOk } = await $api.admin.studio.create(body);
      if (isOk) {
        await fetchStudios();
        setIsModalOpen(false);
        setModalKey((prev) => prev + 1);
        toast.success("Studio Created Success");
      }
    } else {
      toast.error("An error occurred while uploading the image");
    }
    setIsRequesting(false);
  };

  const updateStudio = async (body) => {
    setIsRequesting(true);
    if (uploadFile) {
      const { isOk: uploadOk, data: uploadData } = await uploadImage(
        uploadFile
      );
      if (uploadOk) {
        body.thumbnailCode = uploadData.url;
        const { isOk } = await $api.admin.studio.update(selectedRow.id, body);
        if (isOk) {
          await fetchStudios();
          setIsModalOpen(false);
          setModalKey((prev) => prev + 1);
          toast.success("Studio Updated Success");
        }
      } else {
        toast.error("An error occurred while uploading the image");
      }
    } else {
      const { isOk } = await $api.admin.studio.update(selectedRow.id, body);
      if (isOk) {
        await fetchStudios();
        setIsModalOpen(false);
        setModalKey((prev) => prev + 1);
        toast.success("Studio Updated Success");
      }
    }
    setIsRequesting(false);
  };

  const deleteStudios = async () => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.studio.deleteMany({
      ids: _.map(checkedRows, "id"),
    });
    if (isOk) {
      setCheckedRows([]);
      await fetchStudios();
      toast.success("Studio Deleted Success");
    }
    setIsRequesting(false);
  };

  const onFilterChange = (filter) => {
    const shallow = _.merge(filters, filter);
    setFilters(shallow);
    fetchStudios(shallow);
  };

  const onFilterClear = (filterKey) => {
    if (filters) {
      const shallow = _.omit(filters, filterKey);
      setFilters(shallow);
      fetchStudios(shallow);
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
          onSearch={(value) => onFilterChange({ name: value })}
          onSearchClear={() => onFilterClear("name")}
          onDelete={deleteStudios}
          checkedRows={checkedRows}
          isRequesting={isRequesting}
        >
          <>
            <Select
              allowClear
              size="large"
              style={{
                width: 120,
              }}
              options={studioCategoryNames}
              onChange={(value) => {
                value
                  ? onFilterChange({ categoryName: value })
                  : onFilterClear("categoryName");
              }}
              placeholder="エリア "
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
        title={selectedRow ? "店舗情報" : "新規店舗登録"}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setSelectedRow(null);
          setIsModalOpen(false);
        }}
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
        <CreateStudioModal
          data={selectedRow}
          isRequesting={isRequesting}
          modalKey={modalKey}
          onConfirm={(params) =>
            selectedRow ? updateStudio(params) : createStudio(params)
          }
          onCancel={() => {
            setSelectedRow(null);
            setIsModalOpen(false);
          }}
          uploadFile={uploadFile}
          setUploadFile={setUploadFile}
        />
      </Modal>
    </>
  );
};

export default RecordStudio;
