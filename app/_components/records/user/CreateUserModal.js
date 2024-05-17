import { Tabs } from "antd";
import { useState } from "react";
import UserDetailsForm from "./UserDetailsForm";
import PlanDetailsForm from "./PlanDetailsForm";

const CreateUserModal = ({
  data,
  onComplete,
  onBack,
  modalKey,
  isRequesting,
  fetchData,
}) => {
  const [activeKey, setActiveKey] = useState(1);
  const items = [
    {
      key: 1,
      label: "プロフィール",
      children: (
        <UserDetailsForm
          data={data}
          onComplete={onComplete}
          onBack={onBack}
          modalKey={modalKey}
          isRequesting={isRequesting}
        />
      ),
    },
    {
      key: 2,
      label: "基本情報",
      children: (
        <PlanDetailsForm
          data={data}
          closeModal={onBack}
          fetchData={fetchData}
        />
      ),
      disabled: !data ? true : false,
    },
  ];

  return (
    <>
      <Tabs
        activeKey={activeKey}
        items={items}
        onChange={(key) => setActiveKey(key)}
      />
    </>
  );
};

export default CreateUserModal;
