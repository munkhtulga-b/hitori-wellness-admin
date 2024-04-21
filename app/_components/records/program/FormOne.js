import { Form, Input, Button, Switch, Radio } from "antd";
import FileUploader from "../../custom/FileUploader";
import { useEffect, useState } from "react";

const ProgramFormOne = ({
  onComplete,
  onBack,
  uploadFile,
  setUploadFile,
  isUploading,
  modalKey,
}) => {
  const [form] = Form.useForm();
  const [isTrial, setIsTrial] = useState(false);

  useEffect(() => {
    form.resetFields();
  }, [modalKey]);

  useEffect(() => {
    if (uploadFile) {
      form.setFieldValue("thumbnailCode", uploadFile.name);
    }
  }, [uploadFile]);

  useEffect(() => {
    form.setFieldValue("isTrial", isTrial);
  }, [isTrial]);

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="form-one"
        onFinish={(params) => onComplete(params)}
        requiredMark={false}
        validateTrigger="onSubmit"
      >
        <Form.Item
          name="thumbnailCode"
          rules={[{ required: true, message: "Please upload studio image" }]}
        >
          <section className="tw-flex tw-justify-center">
            <FileUploader
              currentFile={uploadFile}
              onFileChange={(file) => setUploadFile(file)}
              modalKey={modalKey}
            />
          </section>
        </Form.Item>
        <Form.Item
          name="code"
          label="コード"
          rules={[
            {
              required: true,
              message: "Please input studio code",
            },
          ]}
        >
          <Input placeholder="" />
        </Form.Item>
        <Form.Item
          name="name"
          label="プログラム名称"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
        >
          <Input placeholder="" />
        </Form.Item>
        <Form.Item
          name="serviceMinutes"
          label="利用時間"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
        >
          <Input type="number" placeholder="" style={{ width: 70 }} />
        </Form.Item>
        <Form.Item
          name="isTrial"
          label="カテゴリー"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
          valuePropName="checked"
        >
          <div className="tw-flex tw-flex-col tw-gap-6">
            <Radio
              checked={isTrial === false}
              onChange={() => setIsTrial(false)}
            >
              会員
            </Radio>
            <Radio checked={isTrial === true} onChange={() => setIsTrial(true)}>
              体験
            </Radio>
          </div>
        </Form.Item>
        <Form.Item
          name="description"
          label="説明"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
        >
          <Input placeholder="" />
        </Form.Item>
        <Form.Item
          name="status"
          label="ステータス"
          valuePropName="checked"
          initialValue={false}
        >
          <Switch />
        </Form.Item>
        <Form.Item>
          <div className="tw-flex tw-justify-end tw-items-start tw-gap-2">
            <Button size="large" onClick={() => onBack()}>
              キャンセル
            </Button>
            <Button
              loading={isUploading}
              type="primary"
              htmlType="submit"
              size="large"
            >
              次へ
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default ProgramFormOne;
