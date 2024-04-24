import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { uploadImage } from "@/app/_utils/helpers";
import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
import ProgramFormOne from "./FormOne";
import ProgramFormTwo from "./FormTwo";
import $api from "@/app/_api";

const CreateProgramModal = ({
  modalKey,
  isRequesting,
  onConfirm,
  onCancel,
}) => {
  const [activeKey, setActiveKey] = useState(1);
  const [plans, setPlans] = useState(null);
  const [tickets, setTickets] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [requestBody, setRequestBody] = useState({});

  useEffect(() => {
    fetchPlans();
    fetchTickets();
  }, []);

  useEffect(() => {
    resetBody();
  }, [modalKey]);

  const fetchPlans = async () => {
    const { isOk, data } = await $api.admin.plan.getMany();
    if (isOk) {
      setPlans(data);
    }
  };

  const fetchTickets = async () => {
    const { isOk, data } = await $api.admin.item.getMany({
      itemType: "ticket",
    });
    if (isOk) {
      setTickets(data);
    }
  };

  const handleFormOne = async (params) => {
    setIsUploading(true);
    const { isOk, data } = await uploadImage(uploadFile);
    if (isOk) {
      params.thumbnailCode = data.url;
      params.status =
        params.status === false
          ? EEnumDatabaseStatus.INACTIVE.value
          : EEnumDatabaseStatus.ACTIVE.value;
      formatRequestBody(params);
    }
    setIsUploading(false);
  };

  const handleFormTwo = async (params) => {
    formatRequestBody(params);
  };

  const formatRequestBody = (params) => {
    setRequestBody((prev) => ({
      ...prev,
      ...params,
    }));
    if (activeKey === 2) {
      onConfirm({ ...requestBody, ...params });
    } else {
      setActiveKey((prev) => prev + 1);
    }
  };

  const resetBody = () => {
    setRequestBody({});
    setUploadFile(null);
    setActiveKey(1);
  };

  const items = [
    {
      key: 1,
      label: "基本情報",
      children: (
        <ProgramFormOne
          onComplete={handleFormOne}
          onBack={() => onCancel()}
          uploadFile={uploadFile}
          setUploadFile={setUploadFile}
          isUploading={isUploading}
          modalKey={modalKey}
        />
      ),
    },
    {
      key: 2,
      label: "予約制限",
      children: (
        <ProgramFormTwo
          onComplete={handleFormTwo}
          onBack={() => setActiveKey(1)}
          plans={plans}
          tickets={tickets}
          modalKey={modalKey}
          isRequesting={isRequesting}
        />
      ),
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

export default CreateProgramModal;
