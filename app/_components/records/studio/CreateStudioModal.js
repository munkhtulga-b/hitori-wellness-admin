import { Tabs } from "antd";
import { useEffect, useState } from "react";
import StudioFormOne from "./FormOne";
import StudioFormTwo from "./FormTwo";
import StudioFormThree from "./FormThree";
import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";

const CreateStudioModal = ({
  modalKey,
  isRequesting,
  onConfirm,
  onCancel,
  data,
  uploadFile,
  setUploadFile,
}) => {
  const [activeKey, setActiveKey] = useState(1);

  const [isUploading, setIsUploading] = useState(false);

  const [requestBody, setRequestBody] = useState({});

  useEffect(() => {
    resetBody();
  }, [modalKey]);

  const handleFormOne = async (params) => {
    setIsUploading(true);
    if (!data) {
      params.status =
        params.status === false
          ? EEnumDatabaseStatus.INACTIVE.value
          : EEnumDatabaseStatus.ACTIVE.value;
      formatRequestBody(params);
    } else {
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

  const handleFormThree = async (params) => {
    formatRequestBody(params);
  };

  const formatRequestBody = async (params) => {
    setRequestBody((prev) => ({
      ...prev,
      ...params,
    }));
    if (activeKey === 3) {
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
        <StudioFormOne
          data={data}
          onComplete={handleFormOne}
          onBack={() => onCancel()}
          uploadFile={uploadFile}
          setUploadFile={setUploadFile}
          isUploading={isUploading}
          modalKey={modalKey}
        />
      ),
      disabled: activeKey === 2 || activeKey === 3,
    },
    {
      key: 2,
      label: "住所",
      children: (
        <StudioFormTwo
          data={data}
          onComplete={handleFormTwo}
          onBack={() => setActiveKey(1)}
          modalKey={modalKey}
        />
      ),
      disabled: activeKey === 3 || activeKey === 1,
    },
    {
      key: 3,
      label: "営業設定",
      children: (
        <StudioFormThree
          data={data}
          onComplete={handleFormThree}
          onBack={() => setActiveKey(2)}
          isRequesting={isRequesting}
          modalKey={modalKey}
        />
      ),
      disabled: activeKey === 1 || activeKey === 2,
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

export default CreateStudioModal;
