import { Form, Input, Button, Switch, Radio, TimePicker } from "antd";
import FileUploader from "../../custom/FileUploader";
import { useEffect, useState } from "react";
import TextEditor from "../../custom/TextEditor";
import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
import dayjs from "dayjs";

const ProgramFormOne = ({
  data,
  onComplete,
  onBack,
  uploadFile,
  setUploadFile,
  modalKey,
}) => {
  const [form] = Form.useForm();
  const [isTrial, setIsTrial] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (data) {
      console.log(data.status, EEnumDatabaseStatus.ACTIVE.value);
      const duration = dayjs.duration(data?.service_minutes, "minutes");
      setTimeout(() => {
        form.setFieldsValue({
          thumbnailCode: data?.thumbnail_code,
          code: data?.code,
          name: data?.name,
          status:
            data?.status === EEnumDatabaseStatus.ACTIVE.value ? true : false,
          isTrial: data?.is_trial,
          description: data?.description,
          serviceMinutes: dayjs(duration.format("HH:mm"), "HH:mm"),
        });
      }, 500);
    }
  }, [data]);

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

  useEffect(() => {
    form.setFieldValue("description", description);
  }, [description]);

  const beforeComplete = (params) => {
    params.serviceMinutes = +params.serviceMinutes;
    params.status =
      params.status === true
        ? EEnumDatabaseStatus.ACTIVE.value
        : EEnumDatabaseStatus.INACTIVE.value;
    const [hours, minutes] = dayjs(params.serviceMinutes)
      .format("HH:mm")
      .split(":")
      .map(Number);
    const serviceMinutes = hours * 60 + minutes;
    params.serviceMinutes = serviceMinutes;
    onComplete(params);
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="program-form-one"
        onFinish={(params) => beforeComplete(params)}
        requiredMark={false}
        validateTrigger="onSubmit"
      >
        <Form.Item
          name="thumbnailCode"
          rules={[
            { required: true, message: "画像をアップロードしてください。" },
          ]}
        >
          <section className="tw-flex tw-justify-center">
            <FileUploader
              currentFile={uploadFile}
              previousFile={data?.thumbnail_code}
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
              message: "コードを入力してください。",
            },
          ]}
        >
          <Input placeholder="0000" />
        </Form.Item>
        <Form.Item
          name="name"
          label="名称"
          rules={[
            {
              required: true,
              message: "名称を入力してください。",
            },
          ]}
        >
          <Input placeholder="名称" />
        </Form.Item>
        <Form.Item
          name="serviceMinutes"
          label="利用時間"
          rules={[
            {
              type: "object",
              required: true,
              message: "利用時間を設定してください。",
            },
          ]}
        >
          <TimePicker
            format={"HH:mm"}
            minuteStep={30}
            needConfirm={false}
            showNow={false}
            className="tw-w-full"
          />
        </Form.Item>
        <Form.Item
          name="isTrial"
          label="カテゴリー"
          rules={[
            {
              required: false,
              message: "カテゴリーを選択してください。",
            },
          ]}
          valuePropName="checked"
          initialValue={false}
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
              message: "説明を入力してください。",
            },
          ]}
        >
          <TextEditor value={description} onChange={setDescription} />
        </Form.Item>
        <Form.Item
          name="status"
          label="ステータス"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
        <Form.Item>
          <div className="tw-flex tw-justify-end tw-items-start tw-gap-2">
            <Button size="large" onClick={() => onBack()}>
              キャンセル
            </Button>
            <Button type="primary" htmlType="submit" size="large">
              次へ
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default ProgramFormOne;
