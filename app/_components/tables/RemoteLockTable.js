"use client";

import dayjs from "dayjs";
import { Checkbox } from "antd";
import { nullSafety } from "@/app/_utils/helpers";
import NoData from "../custom/NoData";
import EEnumReservationStatus from "@/app/_enums/EEnumReservationStatus";

const baseTableCellStyle = "tw-px-6 tw-py-4";
const baseTableRowStyle = "tw-border-b tw-border-divider";

const RemoteLockTable = ({
  tableId,
  columns,
  data,
  isLoading,
  isCheckable,
  checkedRows,
  onRowCheck,
}) => {
  const handleRowCheck = (item, checked) => {
    const shallow = [...checkedRows];
    if (checked) {
      shallow.push(item);
    } else {
      const itemIdx = shallow.map((i) => i.id).indexOf(item.id);
      if (itemIdx !== -1) {
        shallow.splice(itemIdx, 1);
      }
    }
    onRowCheck(shallow);
  };

  const isRowChecked = (item) => {
    return checkedRows.map((i) => i.id).indexOf(item.id) !== -1;
  };

  const formatDataIndex = (item, column) => {
    let result = nullSafety(item[column.dataIndex]);
    if (column.dataIndex === "status") {
      result =
        item.status === EEnumReservationStatus.CHECK_IN.value
          ? EEnumReservationStatus.CHECK_IN.label
          : EEnumReservationStatus.CHECK_OUT.label;
    } else if (column.dataIndex === "checkin_at") {
      result = dayjs(item.checkin_at).format("YYYY-MM-DD HH:mm");
    } else if (column.dataIndex === "member") {
      result = (
        <>
          <div className="tw-flex tw-flex-col">
            <span className="tw-leading-[22px] tw-tracking-[0.14px]">{`${nullSafety(
              item.member?.last_name
            )} ${nullSafety(item.member?.first_name)}`}</span>
            <span className="tw-text-sm tw-tracking-[0.12px] tw-text-graySoft">
              {nullSafety(item.member?.mail_address)}
            </span>
          </div>
        </>
      );
    } else if (column.dataIndex === "m_studio") {
      result = (
        <>
          <div className="tw-flex tw-flex-col">
            <span className="tw-leading-[22px] tw-tracking-[0.14px]">
              {nullSafety(item.m_studio?.name)}
            </span>
            <span className="tw-text-sm tw-text-graySoft tw-tracking-[0.12px]">
              {nullSafety(item.m_studio?.code)}
            </span>
          </div>
        </>
      );
    } else if (column.dataIndex === "booking") {
      if (item.booking) {
        result = nullSafety(item.booking?.device_id);
      } else {
        result = "-";
      }
    } else {
      result = "-";
    }
    return result;
  };

  const BaseTableSkeleton = ({ count }) => {
    const rows = [];
    const shallowColumns = [...columns];
    if (isCheckable) {
      shallowColumns.push({
        title: "checkbox",
        dataIndex: "",
      });
    }
    for (let i = 0; i < count; i++) {
      rows.push(
        <tr className={`${baseTableRowStyle} tw-animate-pulse`} key={i}>
          {shallowColumns.map((column) => (
            <td key={column.title} className={`${baseTableCellStyle}`}>
              <div className="tw-bg-gray-200 tw-rounded tw-h-8 tw-w-full"></div>
            </td>
          ))}
        </tr>
      );
    }
    return rows;
  };

  return (
    <>
      {columns ? (
        <>
          <table id={tableId ? tableId : ""} className="tw-w-full">
            {columns ? (
              <thead>
                <tr className="tw-border-b tw-border-tableHeader tw-bg-graySoft tw-sticky tw-top-[84px] tw-z-[99] tw-shadow">
                  {isCheckable ? <th></th> : null}
                  {columns.map((column) => (
                    <th
                      key={column.title}
                      className={`${baseTableCellStyle} tw-whitespace-nowrap tw-text-tableHeader tw-text-sm tw-tracking-[0.12px] tw-font-normal tw-text-left`}
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {!isLoading ? (
                <>
                  {data?.length ? (
                    <>
                      {data.map((item) => (
                        <tr key={item.id} className={`${baseTableRowStyle}`}>
                          {isCheckable ? (
                            <td className={`tw-py-4`}>
                              <Checkbox
                                checked={isRowChecked(item)}
                                onChange={(e) =>
                                  handleRowCheck(item, e.target.checked)
                                }
                              />
                            </td>
                          ) : null}
                          {columns.map((column) => (
                            <td
                              key={column.title}
                              className={`${baseTableCellStyle}`}
                            >
                              {formatDataIndex(item, column)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  ) : (
                    <>
                      <tr className={`${baseTableRowStyle}`}>
                        <td
                          colSpan="100%"
                          className={`tw-px-6 tw-py-10 tw-text-center`}
                        >
                          <NoData />
                        </td>
                      </tr>
                    </>
                  )}
                </>
              ) : (
                <>
                  <BaseTableSkeleton count={10} />
                </>
              )}
            </tbody>
          </table>
        </>
      ) : null}
    </>
  );
};

export default RemoteLockTable;
