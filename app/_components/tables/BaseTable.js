"use client";

import dayjs from "dayjs";
import { Checkbox } from "antd";
import { nullSafety } from "@/app/_utils/helpers";
import NoData from "../custom/NoData";
import Image from "next/image";

const baseTableCellStyle = "tw-px-6 tw-py-4";
const baseTableRowStyle = "tw-border-b tw-border-divider";

const BaseTable = ({
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
    if (column.type === "date") {
      result = dayjs.utc(result).format("YYYY-MM-DD HH:mm");
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
              className="tw-px-[10px] tw-py-[6px] tw-rounded-full tw-bg-bgTag tw-whitespace-nowrap"
            >
              {nullSafety(tag.name)}
            </span>
          ))}
        </div>
      );
    }
    if (column.type === "stackedList" && Array.isArray(column.dataIndex)) {
      result = (
        <div className="tw-flex tw-justify-start tw-items-center tw-gap-3">
          <section className="tw-min-w-[40px] tw-max-w-[40px] tw-rounded tw-overflow-hidden">
            <Image
              priority
              src={`https://${process.env.BASE_IMAGE_URL}${
                item[column.imageIndex]
              }`}
              alt="thumbnail"
              width={0}
              height={0}
              style={{ objectFit: "contain", height: "auto", width: "100%" }}
              unoptimized
            />
          </section>
          <ul className="tw-flex tw-flex-col">
            {column.dataIndex.map((stackItem, idx) => (
              <li key={stackItem} className={column.styles[idx]}>
                {nullSafety(item[stackItem])}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    if (column.type === "timePeriod") {
      result =
        item[column.dataIndex][0].end_hour -
          item[column.dataIndex][0].start_hour ==
        24
          ? "24時間以上"
          : `${item[column.dataIndex][0].start_hour} - ${
              item[column.dataIndex][0].end_hour
            }`;
    }
    if (column.type === "status") {
      result = (
        <span
          className={`tw-py-[6px] tw-px-[10px] tw-rounded-full ${
            getStatusData(column, item[column.dataIndex]).style
          }`}
        >
          {getStatusData(column, item[column.dataIndex]).text}
        </span>
      );
    }
    return result;
  };

  const getStatusData = (column, status) => {
    let result = {
      style: "tw-bg-gray-200",
      text: status,
    };
    const matched = column.enum.find((item) => item.id === status);
    if (matched) {
      result.style = matched.style;
      result.text = matched.text;
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
