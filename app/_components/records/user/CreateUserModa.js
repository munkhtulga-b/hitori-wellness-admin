import { Tabs } from "antd";
import { useEffect, useState } from "react";
// import $api from "@/app/_api";
import UserFormOne from "./FormOne";
import UserFormTwo from "./FormTwo";

const CreateUserModal = ({
  modalKey,
  //   isRequesting,
  //   onConfirm,
  //   onCancel,
}) => {
  const [activeKey, setActiveKey] = useState(1);
  //   const [requestBody, setRequestBody] = useState({});

  useEffect(() => {
    resetBody();
  }, [modalKey]);

  //   const handleFormOne = async (params) => {
  //     console.log(params);
  //   };

  //   const handleFormTwo = async (params) => {
  //     console.log(params);
  //   };

  const resetBody = () => {
    // setRequestBody({});
    setActiveKey(1);
  };

  const items = [
    {
      key: 1,
      label: "プロフィール",
      children: <UserFormOne />,
    },
    {
      key: 2,
      label: "基本情報",
      children: <UserFormTwo />,
    },
  ];

  const onTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <>
      <div className="">
        <Tabs activeKey={activeKey} items={items} onChange={onTabChange} />
      </div>
    </>
  );
};

export default CreateUserModal;
