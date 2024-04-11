import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import csvHeaders from "@/app/_resources/csv-export-headers.json";
import dayjs from "dayjs";
import { nullSafety } from "../_utils/helpers";

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
      csvHeaders.admin.forEach(({ key }) => {
        if (key === "studios") {
          row[key] = item.studios.map(({ name }) => name).join(", ");
        } else if (key === "created_at" || key === "updated_at") {
          row[key] = dayjs.utc(item[key]).format("YYYY-MM-DD HH:mm");
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
