import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
import { Form, Input, Select, Button, Switch } from "antd";
import { useEffect, useState } from "react";
import EEnumGender from "@/app/_enums/EEnumGender";

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
      value
        ? EEnumDatabaseStatus.ACTIVE.value
        : EEnumDatabaseStatus.INACTIVE.value
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
              message: "コードを入力してください。",
            },
          ]}
        >
          <Input placeholder="" />
        </Form.Item>
        <Form.Item
          name="name"
          label="氏名"
          rules={[
            {
              required: true,
              message: "氏名を入力してください。",
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
              message: "性別を選択してください。",
            },
          ]}
        >
          <section className="tw-flex tw-justify-start tw-gap-4">
            <Button
              type={gender === EEnumGender.MALE ? "primary" : "default"}
              size="large"
              onClick={() => onGenderSelect(EEnumGender.MALE)}
            >
              男性
            </Button>
            <Button
              type={gender === EEnumGender.FEMALE ? "primary" : "default"}
              size="large"
              onClick={() => onGenderSelect(EEnumGender.FEMALE)}
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
              message: "コメントを入力してください。",
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
              message: "登録店舗を選択してください。",
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
              required: false,
            },
          ]}
          valuePropName="checked"
          initialValue={EEnumDatabaseStatus.ACTIVE.value}
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
              保存
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateStaffModal;
