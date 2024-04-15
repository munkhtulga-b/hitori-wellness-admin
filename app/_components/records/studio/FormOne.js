import { Form, Input, Button, Switch } from "antd";
import FileUploader from "../../custom/FileUploader";
import { useEffect } from "react";

const StudioFormOne = ({
  onComplete,
  onBack,
  uploadFile,
  setUploadFile,
  isUploading,
  modalKey,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [modalKey]);

  useEffect(() => {
    if (uploadFile) {
      form.setFieldValue("thumbnailCode", uploadFile.name);
    }
  }, [uploadFile]);

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
          <Input placeholder="code" />
        </Form.Item>
        <Form.Item
          name="name"
          label="名称"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
        >
          <Input placeholder="name" />
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

export default StudioFormOne;
