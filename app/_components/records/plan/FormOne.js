import { Form, Button, Select, Input, Checkbox, Switch } from "antd";
import { useEffect, useState } from "react";
import TextEditor from "../../custom/TextEditor";
import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";

const PlanFormOne = ({
  data,
  items,
  onComplete,
  onBack,
  isRequesting,
  modalKey,
}) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        form.setFieldsValue({
          code: data?.code,
          name: data?.name,
          description: data?.description,
          status:
            data?.status === true
              ? EEnumDatabaseStatus.ACTIVE.value
              : EEnumDatabaseStatus.INACTIVE.value,
          canAdmissionFee: data?.admission_fee ? true : false,
        });
      }, 500);
    }
  }, [data]);

  useEffect(() => {
    form.resetFields();
  }, [modalKey]);

  const beforeComplete = (params) => {
    params.status =
      params.status === true
        ? EEnumDatabaseStatus.ACTIVE.value
        : EEnumDatabaseStatus.INACTIVE.value;
    onComplete(params);
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="plan-form-one"
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
              message: "Please input studio name",
            },
          ]}
        >
          <Input placeholder="" />
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
          <Input placeholder="" />
        </Form.Item>
        <Form.Item
          name="firstMonthlyItemId"
          label="初月会費"
          rules={[
            {
              required: data ? false : true,
              message: "Please input studio name",
            },
          ]}
        >
          <Select
            disabled={!items || data}
            size="large"
            style={{
              width: "100%",
            }}
            placeholder=""
            options={items}
          />
        </Form.Item>

        <Form.Item
          name="monthlyItemId"
          label="月会費"
          rules={[
            {
              required: data ? false : true,
              message: "Please input studio name",
            },
          ]}
        >
          <Select
            disabled={!items || data}
            size="large"
            style={{
              width: "100%",
            }}
            placeholder=""
            options={items}
          />
        </Form.Item>

        <Form.Item
          name="canAdmissionFee"
          label="月会費"
          rules={[
            {
              required: false,
              message: "Please input studio name",
            },
          ]}
          valuePropName="checked"
          initialValue={false}
        >
          <Checkbox disabled={data} />
        </Form.Item>

        <Form.Item
          name="description"
          label="月会費"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
        >
          <TextEditor value={description} onChange={setDescription} />
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

        <Form.Item>
          <div className="tw-flex tw-justify-end tw-items-start tw-gap-2">
            <Button size="large" onClick={() => onBack()}>
              キャンセル
            </Button>
            <Button
              loading={isRequesting}
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

export default PlanFormOne;
