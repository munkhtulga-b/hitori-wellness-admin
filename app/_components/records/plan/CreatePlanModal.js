import $api from "@/app/_api";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import PlanFormOne from "./FormOne";
import _ from "lodash";
import PlanFormTwo from "./FormTwo";

const CreatePlanModal = ({
  modalKey,
  //   isRequesting,
  //   onConfirm,
  //   onCancel,
}) => {
  const [activeKey, setActiveKey] = useState(1);
  const [items, setItems] = useState(null);
  //   const [requestBody, setRequestBody] = useState({});

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    resetBody();
  }, [modalKey]);

  const fetchItems = async () => {
    const { isOk, data } = await $api.admin.item.getMany();
    if (isOk) {
      const sorted = _.map(data, ({ id: value, name: label }) => ({
        value,
        label,
      }));
      setItems(sorted);
    }
  };

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

  const tabOptions = [
    {
      key: 1,
      label: "基本情報",
      children: (
        <>
          <PlanFormOne items={items} />
        </>
      ),
    },
    {
      key: 2,
      label: "予約制限",
      children: (
        <>
          <PlanFormTwo />
        </>
      ),
    },
  ];

  const onTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <>
      <div className="">
        <Tabs activeKey={activeKey} items={tabOptions} onChange={onTabChange} />
      </div>
    </>
  );
};

export default CreatePlanModal;
