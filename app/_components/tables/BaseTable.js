"use client";

import dayjs from "dayjs";
import { Checkbox } from "antd";
import { nullSafety } from "@/app/_utils/helpers";
import NoData from "../custom/NoData";

const baseTableCellStyle = "tw-px-6 tw-py-4";
const baseTableRowStyle = "tw-border-b tw-border-divider";

const BaseTable = ({
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
    if (column.type === "date") {
      result = dayjs(result).format("YYYY-MM-DD HH:mm");
    }
    if (column.type === "levelType") {
      result = `タイプ${result}`;
    }
    if (column.type === "tagList" && Array.isArray(item[column.dataIndex])) {
      result = (
        <div className="tw-flex tw-flex-wrap tw-gap-3">
          {item[column.dataIndex].map((tag) => (
            <span
              key={tag.id}
              className="tw-px-[10px] tw-py-[6px] tw-rounded-full tw-bg-bgTag"
            >
              {nullSafety(tag.name)}
            </span>
          ))}
        </div>
      );
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
          <table className="tw-w-full">
            {columns ? (
              <thead>
                <tr className="tw-border-b tw-border-tableHeader">
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
                            <td className={`${baseTableCellStyle}`}>
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

export default BaseTable;
