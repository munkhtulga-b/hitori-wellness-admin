import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
import { Form, Input, Select, Button, Switch } from "antd";
import { useEffect, useState } from "react";
import EEnumGender from "@/app/_enums/EEnumGender";
import _ from "lodash";

const CreateStaffModal = ({
  data,
  studios,
  isRequesting,
  onCancel,
  onConfirm,
  modalKey,
}) => {
  const [form] = Form.useForm();
  const [gender, setGender] = useState(null);

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        form.setFieldsValue({
          code: data?.code,
          name: data?.name,
          description: data?.description,
          studioIds: _.map(data?.studio_ids, "id"),
          gender: data?.gender,
          status:
            data?.status === true
              ? EEnumDatabaseStatus.ACTIVE.value
              : EEnumDatabaseStatus.INACTIVE.value,
        });
        setGender(data?.gender);
      }, 500);
    }
  }, [data]);

  useEffect(() => {
    setGender(null);
    form.resetFields();
  }, [modalKey]);

  const onGenderSelect = (value) => {
    setGender(value);
    form.setFieldValue("gender", value);
  };

  const beforeComplete = (params) => {
    params.status =
      params.status === true
        ? EEnumDatabaseStatus.ACTIVE.value
        : EEnumDatabaseStatus.INACTIVE.value;
    onConfirm(params);
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="create-staff-form"
        onFinish={(params) => beforeComplete(params)}
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
          initialValue={true}
        >
          <Switch />
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
