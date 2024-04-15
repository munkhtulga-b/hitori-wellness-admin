import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { uploadImage } from "@/app/_utils/helpers";
import StudioFormOne from "./FormOne";
import StudioFormTwo from "./FormTwo";
import StudioFormThree from "./FormThree";
import { EEnumStudioStatus } from "@/app/_enums/EEnumStudioStatus";

const CreateStudioModal = ({ modalKey, isRequesting, onConfirm, onCancel }) => {
  const [activeKey, setActiveKey] = useState(1);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [requestBody, setRequestBody] = useState({});

  useEffect(() => {
    resetBody();
  }, [modalKey]);

  const handleFormOne = async (params) => {
    setIsUploading(true);
    const { isOk, data } = await uploadImage(uploadFile);
    if (isOk) {
      params.thumbnailCode = data.url;
      params.status =
        params.status === false
          ? EEnumStudioStatus.INACTIVE
          : EEnumStudioStatus.ACTIVE;
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

  const formatRequestBody = (params) => {
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
      label: "住所",
      children: (
        <StudioFormTwo
          onComplete={handleFormTwo}
          onBack={() => setActiveKey(1)}
          modalKey={modalKey}
        />
      ),
    },
    {
      key: 3,
      label: "営業設定",
      children: (
        <StudioFormThree
          onComplete={handleFormThree}
          onBack={() => setActiveKey(2)}
          isRequesting={isRequesting}
          modalKey={modalKey}
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

export default CreateStudioModal;
