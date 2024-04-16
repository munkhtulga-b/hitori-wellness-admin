import { EEnumStudioStatus } from "@/app/_enums/EEnumStudioStatus";
import { Form, Input, Select, Button, Switch } from "antd";
import { useEffect, useState } from "react";

const CreateStaffModal = ({
  studios,
  isRequesting,
  onCancel,
  onConfirm,
  modalKey,
}) => {
  const [form] = Form.useForm();
  const [gender, setGender] = useState(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setGender(null);
    setIsActive(true);
    form.resetFields();
  }, [modalKey]);

  const onGenderSelect = (value) => {
    setGender(value);
    form.setFieldValue("gender", value);
  };

  const onStatusCheck = (value) => {
    setIsActive(value);
    form.setFieldValue(
      "status",
      value ? EEnumStudioStatus.ACTIVE : EEnumStudioStatus.INACTIVE
    );
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="create-staff-form"
        onFinish={(params) => onConfirm(params)}
        requiredMark={false}
        validateTrigger="onSubmit"
      >
        <Form.Item
          name="code"
          label="コード"
          rules={[
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input placeholder="code" />
        </Form.Item>
        <Form.Item
          name="name"
          label="氏名"
          rules={[
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input placeholder="name" />
        </Form.Item>
        <Form.Item
          name="gender"
          label="性別"
          rules={[
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <section className="tw-flex tw-justify-start tw-gap-4">
            <Button
              type={gender === 1 ? "primary" : "default"}
              size="large"
              onClick={() => onGenderSelect(1)}
            >
              男性
            </Button>
            <Button
              type={gender === 2 ? "primary" : "default"}
              size="large"
              onClick={() => onGenderSelect(2)}
            >
              女性
            </Button>
          </section>
        </Form.Item>
        <Form.Item
          name="description"
          label="コメント"
          rules={[
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input placeholder="description" />
        </Form.Item>
        <Form.Item
          name="studioIds"
          label="登録店舗"
          rules={[
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Select
            disabled={!studios}
            size="large"
            mode="multiple"
            style={{
              width: "100%",
            }}
            placeholder="select"
            options={studios}
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="ステータス"
          rules={[
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
          valuePropName="checked"
          initialValue={EEnumStudioStatus.ACTIVE}
        >
          <Switch
            onChange={(checked) => onStatusCheck(checked)}
            checked={isActive}
          />
        </Form.Item>
        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <div className="tw-flex tw-justify-end tw-gap-2">
            <Button size="large" onClick={() => onCancel()}>
              キャンセル
            </Button>
            <Button
              loading={isRequesting}
              type="primary"
              size="large"
              htmlType="submit"
              className="tw-w-[90px]"
            >
              送信
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateStaffModal;
