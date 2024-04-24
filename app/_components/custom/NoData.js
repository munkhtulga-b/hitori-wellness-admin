import { Empty } from "antd";

const NoData = ({ message }) => {
  return (
    <>
      <Empty description={message ?? "データがありません。"} />
    </>
  );
};

export default NoData;
