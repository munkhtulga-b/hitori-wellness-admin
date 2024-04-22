import { Tabs } from "antd";
import { useEffect, useState } from "react";
// import $api from "@/app/_api";
import UserFormOne from "./FormOne";
import UserFormTwo from "./FormTwo";
import $api from "@/app/_api";

const CreateUserModal = ({
  modalKey,
  //   onConfirm,
  onCancel,
}) => {
  const [activeKey, setActiveKey] = useState(1);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    resetBody();
  }, [modalKey]);

  const createUser = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.user.create(body);
    if (isOk) {
      setActiveKey(2);
    }
    setIsRequesting(false);
  };

  const handleFormOne = async (params) => {
    console.log(params);
    console.log(createUser);
  };

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
      children: (
        <UserFormOne
          onComplete={handleFormOne}
          onBack={onCancel}
          isRequesting={isRequesting}
        />
      ),
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
