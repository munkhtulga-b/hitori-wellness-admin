import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import csvHeaders from "@/app/_resources/csv-export-headers.json";
import dayjs from "dayjs";
import { nullSafety } from "../_utils/helpers";
import _ from "lodash";
import EEnumDatabaseStatus from "../_enums/EEnumDatabaseStatus";
import EEnumReservationStatus from "../_enums/EEnumReservationStatus";

const PageHeader = ({ title, isExportable, exportKey, data }) => {
  /**
   * Generate CSV data from the provided 'data' array by mapping each item to a CSV row.
   *
   * @param None
   * @return {Array} Array of objects representing CSV rows
   */
  const exportTableToCSV = () => {
    const csvData = data.map((item) => {
      const row = {};
      csvHeaders[exportKey].forEach(({ key, type, obj, objKey, itemKey }) => {
        if (type === "timePeriod") {
          row[
            key
          ] = `${item.timeperiod_details[0]?.start_hour} - ${item.timeperiod_details[0]?.end_hour}`;
        } else if (type === "singleListObjectItem" && obj) {
          row[key] = nullSafety(
            item[key] && item[key]?.length ? item[key][0]?.[obj]?.[objKey] : "-"
          );
        } else if (type === "listItem" && itemKey) {
          row[key] = item[key].map(({ [itemKey]: value }) => value).join(", ");
        } else if (type === "singleListItem") {
          row[key] = nullSafety(
            item[key]?.length ? item[key][0][itemKey] : "-"
          );
        } else if (type === "objectItem" && objKey) {
          if (Array.isArray(objKey)) {
            row[key] = objKey.map((i) => item[key][i]).join(", ");
          } else {
            row[key] = nullSafety(item[key][objKey]);
          }
        } else if (type === "date") {
          row[key] = nullSafety(dayjs(item[key]).format("YYYY-MM-DD HH:mm"));
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
        } else {
          row[key] = nullSafety(item[key]);
        }
      });
      return row;
    });
    return csvData;
  };

  return (
    <>
      <section className="tw-flex tw-justify-between tw-items-start">
        <span className="tw-text-xxl tw-font-medium">{title ?? ""}</span>
        {isExportable && data?.length ? (
          <CSVLink
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
                <DownloadOutlined style={{ fontSize: 20, color: "#121316" }} />
                <span className="tw-tracking-[0.14px] tw-text-primary">
                  エクスポート
                </span>
              </div>
            </Button>
          </CSVLink>
        ) : null}
      </section>
    </>
  );
};

export default PageHeader;
