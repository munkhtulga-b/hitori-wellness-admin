import { Form, Input, Button, Switch } from "antd";
import FileUploader from "../../custom/FileUploader";
import { useEffect } from "react";
import Image from "next/image";

const StudioFormOne = ({
  data,
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

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        thumbnailCode: data?.thumbnail_code,
        code: data?.code,
        name: data?.name,
        status: data?.status,
      });
    }
  }, [data]);

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
            {!data?.thumbnail_code ? (
              <FileUploader
                currentFile={uploadFile}
                onFileChange={(file) => setUploadFile(file)}
                modalKey={modalKey}
              />
            ) : (
              <div className="tw-w-[150px] tw-overflow-hidden tw-rounded-xl">
                <Image
                  priority
                  src={`https://${process.env.BASE_IMAGE_URL}${data?.thumbnail_code}`}
                  alt="thumbnail"
                  width={0}
                  height={0}
                  style={{
                    objectFit: "contain",
                    height: "auto",
                    width: "100%",
                  }}
                  unoptimized
                />
              </div>
            )}
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
