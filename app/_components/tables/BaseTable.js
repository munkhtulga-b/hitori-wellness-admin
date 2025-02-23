"use client";

import dayjs from "dayjs";
import { Checkbox } from "antd";
import { WarningOutlined, CheckOutlined } from "@ant-design/icons";
import { nullSafety, thousandSeparator } from "@/app/_utils/helpers";
import NoData from "../custom/NoData";
import Image from "next/image";
import _ from "lodash";
import EEnumAdminLevelTypes from "@/app/_enums/EEnumAdminLevelTypes";

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
  onClickName,
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
    if (column.isClickable) {
      result = (
        <span
          className={`${column.isClickable ? "tw-cursor-pointer" : ""}`}
          onClick={() => (column.isClickable ? onClickName(item) : {})}
        >
          {nullSafety(item[column.dataIndex])}
        </span>
      );
    }
    if (column.enum) {
      result = _.find(column.enum, { value: item[column.dataIndex] })?.label;
    }
    if (column.type === "date") {
      if (Array.isArray(column.dataIndex)) {
        result = `${dayjs
          .utc(item[column.dataIndex[0]])
          .format(
            column.dateFormat ? column.dateFormat : "YYYY-MM-DD HH:mm"
          )} - ${dayjs
          .utc(item[column.dataIndex[1]])
          .format(column.dateFormat ? column.dateFormat : "YYYY-MM-DD HH:mm")}`;
      } else {
        result = dayjs(result).format(
          column.dateFormat ? column.dateFormat : "YYYY-MM-DD HH:mm"
        );
      }
    }
    if (column.type === "levelType") {
      result = (
        <span>
          {nullSafety(
            _.find(EEnumAdminLevelTypes, { value: item[column.dataIndex] })
              .label
          )}
        </span>
      );
    }
    if (column.type === "emailVerified") {
      result = (
        <div className="tw-flex tw-justify-start tw-items-center tw-gap-2">
          {item[column?.verifyIndex] ? (
            <CheckOutlined style={{ fontSize: 14 }} />
          ) : (
            <WarningOutlined style={{ fontSize: 14 }} />
          )}
          {nullSafety(item[column.dataIndex])}
        </div>
      );
    }
    if (column.type === "tagList" && Array.isArray(item[column.dataIndex])) {
      result = (
        <>
          {item[column.dataIndex].length === 0 ? (
            <span className="tw-px-[10px] tw-py-[6px] tw-rounded-full tw-bg-bgTag tw-whitespace-nowrap">
              全店舗
            </span>
          ) : (
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
          )}
        </>
      );
    }
    if (column.type === "stackedList" && Array.isArray(column.dataIndex)) {
      result = (
        <div
          onClick={() =>
            onClickName && column.customStyle !== "noEvent"
              ? onClickName(item)
              : {}
          }
          className={`tw-flex tw-justify-start tw-items-center tw-gap-3 ${
            onClickName && column.customStyle !== "noEvent"
              ? "tw-cursor-pointer"
              : ""
          }`}
        >
          {column.imageIndex ? (
            <>
              {column.imageIndex === "user" ? (
                <Image
                  src="/assets/table/member-male.svg"
                  alt="user"
                  width={0}
                  height={0}
                  style={{ width: "40px", height: "auto" }}
                />
              ) : (
                <section className="tw-min-w-[40px] tw-max-w-[40px] tw-rounded tw-overflow-hidden">
                  <Image
                    priority
                    src={`https://${process.env.BASE_IMAGE_URL}${
                      item[column.imageIndex]
                    }`}
                    alt="thumbnail"
                    width={0}
                    height={0}
                    style={{
                      objectFit: "contain",
                      height: "auto",
                      width: "100%",
                    }}
                    unoptimized
                  />
                </section>
              )}
            </>
          ) : null}
          <ul className="tw-flex tw-flex-col">
            {column.dataIndex.map((stackItem, idx) => (
              <li
                key={stackItem}
                className={`${column.styles[idx]} ${
                  Array.isArray(stackItem) ? "tw-flex tw-gap-2" : ""
                }`}
              >
                {Array.isArray(stackItem) && !column.nestedDataIndex ? (
                  <>
                    {stackItem.map((i) => (
                      <span key={i}>{`${nullSafety(item[i])}`}</span>
                    ))}
                  </>
                ) : Array.isArray(stackItem) && column.nestedDataIndex ? (
                  <>
                    {stackItem.map((i) => (
                      <span key={i}>{`${nullSafety(
                        item[column.nestedDataIndex][i]
                      )}`}</span>
                    ))}
                  </>
                ) : !Array.isArray(stackItem) && column.nestedDataIndex ? (
                  <>
                    {column.prefixes ? `${column.prefixes[idx]} ` : ""}{" "}
                    {nullSafety(item[column.nestedDataIndex]?.[stackItem])}
                  </>
                ) : (
                  <>{nullSafety(item[stackItem])}</>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    if (column.type === "flexList" && Array.isArray(column.nestedDataIndex)) {
      result = (
        <>
          <div className="tw-flex tw-flex-wrap tw-justify-start tw-items-center tw-gap-2">
            {column.nestedDataIndex.map((i) => (
              <span key={i}>{nullSafety(item[column.dataIndex]?.[i])}</span>
            ))}
          </div>
        </>
      );
    }
    if (column.type === "timePeriod") {
      result =
        item[column.dataIndex][0].end_hour -
          item[column.dataIndex][0].start_hour ==
        24
          ? "24時間"
          : `${item[column.dataIndex][0].start_hour} - ${
              item[column.dataIndex][0].end_hour
            }`;
    }
    if (column.type === "status") {
      result = (
        <span
          className={`tw-py-[6px] tw-px-[10px] tw-rounded-full tw-whitespace-nowrap ${
            getStatusData(column, item[column.dataIndex]).style
          }`}
        >
          {getStatusData(column, item[column.dataIndex]).text}
        </span>
      );
    }
    if (column.type === "price") {
      result = <>￥{thousandSeparator(item[column.dataIndex])}</>;
    }
    if (
      column.type === "nestedListItem" &&
      Array.isArray(item[column.dataIndex])
    ) {
      result = (
        <>
          {column.nestType === "price" ? (
            <>
              ￥
              {thousandSeparator(
                item[column.dataIndex][0][column.nestedDataIndex]
              )}
            </>
          ) : (
            <>{nullSafety(item[column.dataIndex][0][column.nestedDataIndex])}</>
          )}
        </>
      );
    }
    if (column.type === "nestedObjectItem") {
      result = (
        <>
          {item[column.dataIndex] ? (
            <>
              {Array.isArray(column.nestedDataIndex) ? (
                <>
                  <div className="tw-flex tw-justify-start tw-gap-2">
                    {column.nestedDataIndex.map((i) => (
                      <span key={i}>
                        {nullSafety(item[column.dataIndex]?.[i])}
                      </span>
                    ))}
                  </div>
                  {column.dataIndex === "member" && (
                    <div>{nullSafety(item[column.dataIndex]?.id)}</div>
                  )}
                </>
              ) : (
                <>
                  {nullSafety(item[column.dataIndex][column.nestedDataIndex])}
                </>
              )}
            </>
          ) : (
            <>-</>
          )}
        </>
      );
    }
    if (column.type === "singleListObjectItem") {
      result = (
        <>
          {item[column.dataIndex]?.length &&
          item[column.dataIndex][0][column.nestedObject] ? (
            <>
              {nullSafety(
                item[column.dataIndex][0][column.nestedObject][
                  column.nestedDataIndex
                ]
              )}{" "}
              <br />
              {column.nestedObject === "plan" &&
              item[column.dataIndex][0]?.end_date
                ? `(${dayjs(item[column.dataIndex][0]?.end_date).format(
                    "YYYY年MM月DD日"
                  )}まで有効)`
                : ""}
            </>
          ) : (
            <>-</>
          )}
        </>
      );
    }
    if (column.type === "singleListItem") {
      result = (
        <>
          {Array.isArray(column.dataIndex) ? (
            <ul className="tw-flex tw-flex-col">
              {column.dataIndex.map((i, idx) => (
                <li key={i}>
                  {column.prefixes ? `${column.prefixes[idx]} ` : ""}
                  {nullSafety(item[column.nestedDataIndex][0]?.[i])}
                </li>
              ))}
            </ul>
          ) : (
            <>
              {nullSafety(item[column.nestedDataIndex][0]?.[column.dataIndex])}
            </>
          )}
        </>
      );
    }
    if (column.type === "isEmpty") {
      result = (
        <>
          {!column.dependentIndex ? (
            <>
              {item[column.dataIndex] == 0
                ? column.isEmptyText
                : item[column.dataIndex]}
            </>
          ) : (
            <>
              {item[column.dependentIndex] == 0
                ? column.isEmptyText
                : item[column.dataIndex]}
            </>
          )}
        </>
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
    } else {
      result.text = nullSafety(status);
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

export default BaseTable;
