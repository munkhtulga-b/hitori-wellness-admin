import { Form, Button, Select, Input, Checkbox } from "antd";
import { useEffect, useState } from "react";
import TextEditor from "../../custom/TextEditor";

const PlanFormOne = ({ items, onComplete, onBack, isRequesting, modalKey }) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");

  useEffect(() => {
    form.resetFields();
  }, [modalKey]);

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="plan-form-one"
        onFinish={(params) => onComplete(params)}
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
              required: true,
              message: "Please input studio name",
            },
          ]}
        >
          <Select
            disabled={!items}
            size="large"
            mode="multiple"
            style={{
              width: "100%",
            }}
            placeholder="select"
            options={items}
          />
        </Form.Item>

        <Form.Item
          name="monthlyItemId"
          label="月会費"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
        >
          <Select
            disabled={!items}
            size="large"
            mode="multiple"
            style={{
              width: "100%",
            }}
            placeholder="select"
            options={items}
          />
        </Form.Item>

        <Form.Item
          name="canAdmissionFee"
          label="月会費"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
          valuePropName="checked"
        >
          <Checkbox />
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
