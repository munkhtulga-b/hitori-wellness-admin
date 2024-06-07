"use client";

import dayjs from "dayjs";
import { Checkbox } from "antd";
import { nullSafety } from "@/app/_utils/helpers";
import NoData from "../custom/NoData";
import _ from "lodash";
import EEnumLogOperations from "@/app/_enums/EEnumLogOperations";

const baseTableCellStyle = "tw-px-6 tw-py-4";
const baseTableRowStyle = "tw-border-b tw-border-divider";

const ActionLogTable = ({
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
          .format("YYYY-MM-DD HH:mm")} - ${dayjs
          .utc(item[column.dataIndex[1]])
          .format("YYYY-MM-DD HH:mm")}`;
      } else {
        result = dayjs(result).format("YYYY-MM-DD HH:mm");
      }
    }
    if (column.type === "logValue") {
      result = formatLogValue(item);
    }
    return result;
  };

  const formatLogValue = ({ changed_field, new_value, action }) => {
    if (action === EEnumLogOperations.DELETE.value && new_value?.length) {
      return formatListLogValue(changed_field, new_value);
    }
    let name = null;
    let id = null;
    let date = null;
    if (changed_field === "admin") {
      name = new_value?.mail_address;
      id = `${new_value?.id?.slice(0, 4)}**********`;
    }
    if (changed_field === "m_studio") {
      name = new_value?.name;
      id = new_value?.id;
    }
    if (changed_field === "t_member") {
      name = `${new_value?.last_name} ${new_value?.first_name}`;
      id = new_value?.id;
    }
    if (changed_field === "m_program") {
      name = new_value?.name;
      id = new_value?.id;
    }
    if (changed_field === "m_instructor") {
      name = new_value?.name;
      id = new_value?.id;
    }
    if (changed_field === "m_item") {
      name = new_value?.name;
      id = new_value?.id;
    }
    if (changed_field === "m_ticket") {
      name = new_value?.name;
      id = new_value?.id;
    }
    if (changed_field === "m_plan") {
      name = new_value?.name;
      id = new_value?.id;
    }
    if (changed_field === "m_coupon") {
      name = new_value?.name;
      id = new_value?.id;
    }
    // if (changed_field === "t_reservation") {
    // }
    if (changed_field === "t_shift_slot") {
      name = new_value?.title;
      id = new_value?.id;
      date = `${dayjs(new_value?.start_at).format(
        "YYYY/MM/DD HH:mm"
      )} - ${dayjs(new_value?.end_at).format("YYYY/MM/DD HH:mm")}`;
    }
    // if (changed_field === "t_member_plan") {
    // }
    // if (changed_field === "t_member_ticket") {
    // }
    if (changed_field === "m_instructor_basic_slot") {
      id = new_value?.id;
      date = `${dayjs(new_value?.start_time).format(
        "YYYY/MM/DD HH:mm"
      )} - ${dayjs(new_value?.end_time).format("YYYY/MM/DD HH:mm")}`;
    }
    return (
      <div className="tw-flex tw-flex-col">
        {name ? <span>{nullSafety(name)}</span> : null}
        <span className="tw-text-sm tw-text-secondary">{nullSafety(id)}</span>
        {date ? <span>{date}</span> : null}
      </div>
    );
  };

  const formatListLogValue = (changed_field, new_value) => {
    let values;

    if (changed_field === "admin") {
      values = _.map(new_value, ({ id, mail_address }) => {
        return {
          id: `${id.slice(0, 4)}**********`,
          name: mail_address,
        };
      });
    }
    if (changed_field === "m_studio") {
      values = _.map(new_value, ({ id, name }) => {
        return {
          id,
          name,
        };
      });
    }
    if (changed_field === "t_member") {
      values = _.map(new_value, ({ id, last_name, first_name }) => {
        return {
          id,
          name: `${last_name} ${first_name}`,
        };
      });
    }
    if (changed_field === "m_program") {
      values = _.map(new_value, ({ id, name }) => {
        return {
          id,
          name,
        };
      });
    }
    if (changed_field === "m_instructor") {
      values = _.map(new_value, ({ id, name }) => {
        return {
          id,
          name,
        };
      });
    }
    if (changed_field === "m_item") {
      values = _.map(new_value, ({ id, name }) => {
        return {
          id,
          name,
        };
      });
    }
    if (changed_field === "m_coupon") {
      values = _.map(new_value, ({ id, name }) => {
        return {
          id,
          name,
        };
      });
    }
    // if (changed_field === "t_reservation") {
    // }
    if (changed_field === "t_shift_slot") {
      values = _.map(new_value, ({ id, title, start_at, end_at }) => {
        return {
          id,
          name: `${title} (${dayjs(start_at).format(
            "YYYY/MM/DD HH:mm"
          )} - ${dayjs(end_at).format("YYYY/MM/DD HH:mm")})`,
        };
      });
    }
    // if (changed_field === "t_member_plan") {
    // }
    // if (changed_field === "t_member_ticket") {
    // }
    if (changed_field === "m_instructor_basic_slot") {
      values = _.map(new_value, ({ id, start_time, end_time }) => {
        return {
          id,
          name: `${dayjs(start_time).format("YYYY/MM/DD HH:mm")} - ${dayjs(
            end_time
          ).format("YYYY/MM/DD HH:mm")}`,
        };
      });
    }
    return (
      <>
        {values?.length ? (
          <div className="tw-flex tw-flex-col tw-gap-2">
            {values.map((value) => {
              return (
                <div key={value.id} className="tw-flex tw-flex-col">
                  <span>{nullSafety(value.name)}</span>
                  <span className="tw-text-secondary tw-text-sm">
                    {nullSafety(value.id)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}
      </>
    );
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

export default ActionLogTable;
