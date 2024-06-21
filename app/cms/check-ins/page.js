"use client";

import { Select } from "antd";
import BaseTable from "@/app/_components/tables/BaseTable";
import { useEffect, useState } from "react";
import $api from "@/app/_api";
import RecordTableFilters from "@/app/_components/records/RecordTableFilters";
import _ from "lodash";
import PageHeader from "@/app/_components/PageHeader";

const columns = [
  {
    title: "ステータス",
    dataIndex: "changed_field",
    customStyle: "",
    type: null,
  },
  {
    title: "日時 ",
    dataIndex: "new_value",
    nestedDataIndex: "id",
    type: "nestedObjectItem",
  },
  {
    title: "メンバー",
    dataIndex: "action",
    customStyle: "",
    type: null,
  },
  {
    title: "店舗",
    dataIndex: "mail_address",
    customStyle: "",
    type: null,
  },
  {
    title: "デバイス",
    dataIndex: "updated_at",
    customStyle: "",
    type: "date",
  },
];

const CheckIns = () => {
  const [studioOptions, setStudioOptions] = useState([]);

  useEffect(() => {
    fetchStudioOptions();
  }, []);

  const fetchStudioOptions = async () => {
    const { isOk, data } = await $api.admin.studio.getMany({ list: true });
    if (isOk && data?.length) {
      const studios = _.map(data, ({ id: value, name: label }) => ({
        value,
        label,
      }));
      setStudioOptions(studios);
    }
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-8">
        <PageHeader
          title={"入館記録"}
          isExportable={true}
          onExport={() => {}}
        />
        <RecordTableFilters
          onAdd={null}
          onSearch={() => {}}
          onSearchClear={() => {}}
        >
          <>
            <Select
              disabled={!studioOptions}
              allowClear
              size="large"
              style={{
                width: 240,
              }}
              options={studioOptions}
              placeholder="登録店舗"
            />
          </>
        </RecordTableFilters>
        <BaseTable data={null} columns={columns} isCheckable={false} />
      </div>
    </>
  );
};

export default CheckIns;
