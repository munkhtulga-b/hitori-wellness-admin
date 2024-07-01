"use client";

import { Select, Pagination } from "antd";
import { useEffect, useState } from "react";
import $api from "@/app/_api";
import RecordTableFilters from "@/app/_components/records/RecordTableFilters";
import _ from "lodash";
import PageHeader from "@/app/_components/PageHeader";
import RemoteLockTable from "@/app/_components/tables/RemoteLockTable";
import EEnumReservationStatus from "@/app/_enums/EEnumReservationStatus";
import $csv from "@/app/_resources/csv-data-fetchers";

const columns = [
  {
    title: "ステータス",
    dataIndex: "status",
  },
  {
    title: "日時 ",
    dataIndex: "checkin_at",
  },
  {
    title: "メンバー",
    dataIndex: "member",
  },
  {
    title: "店舗",
    dataIndex: "m_studio",
  },
  {
    title: "デバイス",
    dataIndex: "booking",
  },
];

const CheckIns = () => {
  const [studioOptions, setStudioOptions] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [exportRawData, setExportRawData] = useState(null);

  const [isFetching, setIsFetching] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [filters, setFilters] = useState({
    status: EEnumReservationStatus.CHECK_IN.value,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    count: 10,
    total: 0,
  });

  useEffect(() => {
    fetchReservations(filters);
    fetchStudioOptions();
  }, []);

  const fetchReservations = async (queries) => {
    setIsFetching(true);
    const { isOk, data } = await $api.admin.reservation.getMany(queries);
    if (isOk) {
      setReservations(data);
    }
    setIsFetching(false);
  };

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

  const onFilterChange = (filter) => {
    const shallowFilters = _.merge(filters, filter, {
      page: 0,
      limit: pagination.count,
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
    setFilters(shallowFilters);
    fetchReservations(shallowFilters);
  };

  const onFilterClear = (filterKey) => {
    if (filters) {
      const shallow = _.omit(filters, filterKey);
      setFilters(shallow);
      fetchReservations(shallow);
    }
  };

  const onPaginationChange = (page, pageSize) => {
    if (pagination.count == pageSize) {
      setPagination((prev) => ({ ...prev, current: page }));
    } else {
      setPagination((prev) => ({ ...prev, current: 1, count: pageSize }));
    }
    const queries = _.merge(filters, { page: page - 1, limit: pageSize });
    fetchReservations(queries);
  };

  const onExport = async () => {
    setIsExporting(true);
    const { isOk, data } = await $csv.checkins();
    if (isOk) {
      setExportRawData(data);
    }
    setIsExporting(false);
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-8">
        <PageHeader
          title={"入館記録"}
          isExportable={true}
          exportKey={"checkins"}
          data={exportRawData}
          setData={setExportRawData}
          isExporting={isExporting}
          onExport={onExport}
        />
        <RecordTableFilters
          onAdd={null}
          onSearch={(value) => {
            onFilterChange({ name: value });
          }}
          onSearchClear={() => {
            onFilterClear("name");
          }}
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
              onChange={(value) => onFilterChange({ studioId: value })}
              onClear={() => onFilterClear("studioId")}
            />
          </>
        </RecordTableFilters>
        <RemoteLockTable
          data={reservations}
          isLoading={isFetching}
          columns={columns}
          isCheckable={false}
        />
        {reservations.length > 10 && (
          <section className="tw-flex tw-justify-center">
            <Pagination
              current={pagination.current}
              pageSize={pagination.count}
              total={pagination.total}
              onChange={(page, pageSize) => onPaginationChange(page, pageSize)}
            />
          </section>
        )}
      </div>
    </>
  );
};

export default CheckIns;
