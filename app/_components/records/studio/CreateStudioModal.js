import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { uploadImage } from "@/app/_utils/helpers";
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
}) => {
  const [activeKey, setActiveKey] = useState(1);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [requestBody, setRequestBody] = useState({});

  useEffect(() => {
    resetBody();
  }, [modalKey]);

  const handleFormOne = async (params) => {
    setIsUploading(true);
    if (!data) {
      const { isOk, data } = await uploadImage(uploadFile);
      if (isOk) {
        params.thumbnailCode = data.url;
        params.status =
          params.status === false
            ? EEnumDatabaseStatus.INACTIVE.value
            : EEnumDatabaseStatus.ACTIVE.value;
        formatRequestBody(params);
      }
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
          data={data}
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
          data={data}
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
          data={data}
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
