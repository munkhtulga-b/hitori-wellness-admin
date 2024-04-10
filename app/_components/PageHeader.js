import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import csvHeaders from "@/app/_resources/csv-export-headers.json";

const PageHeader = ({ title, isExportable, exportKey, data }) => {
  const convertExportableData = () => {
    const result = [];
    csvHeaders[exportKey].forEach((header) => {
      console.log(header);
      //TODO: Compute export data
    });
    return result;
  };

  return (
    <>
      <section className="tw-flex tw-justify-between tw-items-start">
        <span className="tw-text-xxl tw-font-medium">{title ?? ""}</span>
        {isExportable && data?.length ? (
          <CSVLink
            data={convertExportableData()}
            headers={csvHeaders[exportKey]}
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
