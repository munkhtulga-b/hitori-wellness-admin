import { Empty } from "antd";

const NoData = ({ message }) => {
  return (
    <>
      <Empty description={message ?? "データなし"} />
    </>
  );
};

export default NoData;
