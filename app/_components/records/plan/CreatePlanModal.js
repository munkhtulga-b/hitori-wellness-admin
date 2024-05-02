import $api from "@/app/_api";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import PlanFormOne from "./FormOne";
import _ from "lodash";
import PlanFormTwo from "./FormTwo";
import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
import EEnumItemTypes from "@/app/_enums/EEnumItemTypes";

const CreatePlanModal = ({
  data,
  modalKey,
  isRequesting,
  onComplete,
  onCancel,
  studios,
}) => {
  const [activeKey, setActiveKey] = useState(1);
  const [items, setItems] = useState(null);
  const [requestBody, setRequestBody] = useState({});

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    resetBody();
  }, [modalKey]);

  const fetchItems = async () => {
    const { isOk, data } = await $api.admin.item.getMany({
      itemType: EEnumItemTypes.PLAN.value,
      status: EEnumDatabaseStatus.ACTIVE.value,
    });
    if (isOk) {
      const sorted = _.map(data, ({ id: value, name: label }) => ({
        value,
        label,
      }));
      setItems(sorted);
    }
  };

  const handleFormOne = async (params) => {
    params.status =
      params.status === true
        ? EEnumDatabaseStatus.ACTIVE.value
        : EEnumDatabaseStatus.INACTIVE.value;
    setRequestBody(params);
    setActiveKey(2);
  };

  const handleFormTwo = async (params) => {
    params.maxCcReservableNumByPlan = +params.maxCcReservableNumByPlan;
    params.maxReservableNumAtDayByPlan = +params.maxReservableNumAtDayByPlan;
    delete params.purchaseAllStudios;
    onComplete({ ...requestBody, ...params });
  };

  const resetBody = () => {
    setRequestBody({});
    setActiveKey(1);
  };

  const tabOptions = [
    {
      key: 1,
      label: "基本情報",
      children: (
        <>
          <PlanFormOne
            data={data}
            items={items}
            modalKey={modalKey}
            onBack={onCancel}
            onComplete={handleFormOne}
          />
        </>
      ),
    },
    {
      key: 2,
      label: "予約制限",
      children: (
        <>
          <PlanFormTwo
            data={data}
            studios={studios}
            modalKey={modalKey}
            isRequesting={isRequesting}
            onComplete={handleFormTwo}
            onBack={() => setActiveKey(1)}
          />
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
