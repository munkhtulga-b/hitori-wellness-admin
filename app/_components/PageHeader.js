import { Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { DownloadOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import csvHeaders from "@/app/_resources/csv-export-headers.json";
import dayjs from "dayjs";
import { nullSafety, stripHTMLstring } from "../_utils/helpers";
import _ from "lodash";
import EEnumDatabaseStatus from "../_enums/EEnumDatabaseStatus";
import EEnumReservationStatus from "../_enums/EEnumReservationStatus";
import { useEffect } from "react";

const PageHeader = ({
  title,
  isExportable,
  exportKey,
  data,
  onExport,
  isExporting,
}) => {
  useEffect(() => {
    if (data) {
      const downloadLink = document.querySelector("#export-csv-link");
      if (downloadLink) {
        downloadLink?.click();
      }
    }
  }, [data]);

  /**
   * Generate CSV data from the provided 'data' array by mapping each item to a CSV row.
   *
   * @param None
   * @return {Array} Array of objects representing CSV rows
   */
  const exportTableToCSV = () => {
    const csvData = data.map((item) => {
      const row = {};
      csvHeaders[exportKey].forEach(
        ({ key, type, obj, objKey, itemKey, prefixes }) => {
          if (type === "timePeriod") {
            row[
              key
            ] = `${item.timeperiod_details[0]?.start_hour} - ${item.timeperiod_details[0]?.end_hour}`;
          } else if (type === "singleListObjectItem" && obj) {
            row[key] = nullSafety(
              item[key] && item[key]?.length
                ? item[key][0]?.[obj]?.[objKey]
                : "-"
            );
          } else if (type === "listItem" && itemKey) {
            if (Array.isArray(itemKey)) {
              let finalRow = "";
              item[key].forEach((i) => {
                let tempRow = "";
                itemKey.forEach((j, jIndex) => {
                  tempRow = `${tempRow}${tempRow?.length ? "," : ""} ${
                    prefixes[jIndex]
                  }: ${i[j]}`;
                });
                finalRow = `${finalRow}${
                  finalRow?.length ? "\n" : ""
                } ${tempRow}`;
              });
              row[key] = finalRow;
            } else {
              row[key] = item[key]
                .map(({ [itemKey]: value }) => value)
                .join(", ");
            }
          } else if (type === "singleListItem") {
            row[key] = nullSafety(
              item[key]?.length ? item[key][0][itemKey] : "-"
            );
          } else if (type === "objectItem" && objKey && obj) {
            if (Array.isArray(objKey)) {
              row[key] = objKey.map((i) => item[obj]?.[i]).join(", ");
            } else {
              row[key] = nullSafety(item[obj]?.[objKey]);
            }
          } else if (type === "date") {
            row[key] = nullSafety(dayjs(item[key]).format("YYYY-MM-DD HH:mm"));
          } else if (type === "birthDate") {
            row[key] = nullSafety(
              item[key] ? dayjs(item[key]).format("YYYY-MM-DD") : null
            );
          } else if (type === "status") {
            const matchedKey = _.findKey(EEnumDatabaseStatus, {
              value: item[key],
            });
            row[key] = matchedKey
              ? EEnumDatabaseStatus[matchedKey].label
              : nullSafety(item[key]);
          } else if (type === "reservationStatus") {
            const matchedKey = _.findKey(EEnumReservationStatus, {
              value: item[key],
            });
            row[key] = matchedKey
              ? EEnumReservationStatus[matchedKey].label
              : nullSafety(item[key]);
          } else if (type === "HTML") {
            row[key] = stripHTMLstring(item[key]);
          } else {
            row[key] = nullSafety(item[key]);
          }
        }
      );
      return row;
    });
    return csvData;
  };

  return (
    <>
      <section className="tw-flex tw-justify-between tw-items-start">
        <span className="tw-text-xxl tw-font-medium">{title ?? ""}</span>
        {isExportable ? (
          <>
            {data?.length ? (
              <CSVLink
                id="export-csv-link"
                data={exportTableToCSV()}
                headers={csvHeaders[exportKey]}
                filename={`hitori-wellness-${exportKey}-table-${dayjs().format(
                  "YYYY-MM-DD"
                )}.csv`}
              >
                <Button
                  type="primary"
                  size="large"
                  style={{ backgroundColor: "#EFEFF1" }}
                >
                  <div className="tw-flex tw-justify-start tw-items-center tw-gap-2">
                    <DownloadOutlined
                      style={{ fontSize: 20, color: "#121316" }}
                    />
                    <span className="tw-tracking-[0.14px] tw-text-primary">
                      エクスポート
                    </span>
                  </div>
                </Button>
              </CSVLink>
            ) : (
              <Button
                type="primary"
                size="large"
                style={{ backgroundColor: "#EFEFF1" }}
                onClick={() => onExport()}
              >
                <div className="tw-flex tw-justify-start tw-items-center tw-gap-2">
                  {!isExporting ? (
                    <DownloadOutlined
                      style={{ fontSize: 20, color: "#121316" }}
                    />
                  ) : (
                    <LoadingOutlined
                      style={{ fontSize: 20, color: "#121316" }}
                    />
                  )}
                  <span className="tw-tracking-[0.14px] tw-text-primary">
                    エクスポート
                  </span>
                </div>
              </Button>
            )}
          </>
        ) : null}
      </section>
    </>
  );
};

export default PageHeader;
