"use client";

import dayjs from "dayjs";
import { Input, Button, Select, Checkbox } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { nullSafety } from "@/app/_utils/helpers";
import NoData from "../custom/NoData";
import { useState } from "react";

const baseTableCellStyle = "tw-px-6 tw-py-4";
const baseTableRowStyle = "tw-border-b tw-border-divider";

const BaseTable = ({ columns, data, isLoading, isCheckable, onSearch }) => {
  const [checkedRows, setCheckedRows] = useState([]);

  const onRowCheck = (item, checked) => {
    const shallow = [...checkedRows];
    if (checked) {
      shallow.push(item);
    } else {
      const itemIdx = shallow.map((i) => i.id).indexOf(item.id);
      if (itemIdx !== -1) {
        shallow.splice(itemIdx, 1);
      }
    }
    setCheckedRows(shallow);
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
    for (let i = 0; i < count; i++) {
      rows.push(
        <tr className={`${baseTableRowStyle} tw-animate-pulse`} key={i}>
          {columns.map((column) => (
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
          <div className="tw-flex tw-flex-col tw-gap-6">
            <section className="tw-flex tw-justify-between tw-items-start">
              <div className="tw-flex tw-justify-start tw-items-center tw-gap-3">
                <Input
                  placeholder="検索"
                  prefix={<SearchOutlined style={{ fontSize: "18px" }} />}
                  style={{
                    width: 300,
                  }}
                  allowClear
                  onPressEnter={(e) => onSearch(e.target.value)}
                  onChange={(e) => {
                    if (!e.target.value.length) {
                      console.log("Empty");
                    }
                  }}
                />
                <Select
                  size="large"
                  style={{
                    width: 120,
                  }}
                  options={[
                    {
                      value: "権限タイプ",
                      label: "権限タイプ",
                    },
                  ]}
                />
                <Select
                  size="large"
                  style={{
                    width: 85,
                  }}
                  options={[
                    {
                      value: "店舗",
                      label: "店舗",
                    },
                  ]}
                />
              </div>
              <div className="tw-flex tw-justify-start tw-gap-3">
                <Button size="large" type="primary">
                  <div className="tw-flex tw-justify-start tw-items-center tw-gap-1">
                    <PlusOutlined
                      style={{ color: "white", fontSize: "18px" }}
                    />
                    <span>新規登録</span>
                  </div>
                </Button>
                <Button size="large" type="primary" danger>
                  <div className="tw-flex tw-justify-start tw-items-center tw-gap-1">
                    <DeleteOutlined
                      style={{ color: "white", fontSize: "18px" }}
                    />
                    <span>削除</span>
                  </div>
                </Button>
              </div>
            </section>
            <section>
              <table className="tw-w-full">
                {columns ? (
                  <thead>
                    <tr className="tw-border-b tw-border-tableHeader">
                      {isCheckable ? <th></th> : null}
                      {columns.map((column) => (
                        <th
                          key={column.title}
                          className={`${baseTableCellStyle} tw-whitespace-nowrap tw-text-tableHeader tw-text-sm tw-tracking-[0.12px] tw-font-normal`}
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
                            <tr
                              key={item.id}
                              className={`${baseTableRowStyle}`}
                            >
                              {isCheckable ? (
                                <td className={`${baseTableCellStyle}`}>
                                  <Checkbox
                                    checked={isRowChecked(item)}
                                    onChange={(e) =>
                                      onRowCheck(item, e.target.checked)
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
            </section>
          </div>
        </>
      ) : null}
    </>
  );
};

export default BaseTable;
