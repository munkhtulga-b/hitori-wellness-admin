import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const PartialLoading = () => {
  return (
    <>
      <div
        style={{ height: "50vh" }}
        className="tw-grid tw-place-items-center tw-bg-gray-50 tw-rounded-xl"
      >
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 32,
              }}
              spin
            />
          }
        />
      </div>
    </>
  );
};

export default PartialLoading;
