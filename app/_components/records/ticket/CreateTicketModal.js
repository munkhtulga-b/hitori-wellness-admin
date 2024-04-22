import { Button, Form, Input, Switch, Select, Checkbox, Radio } from "antd";

const CreateTicketModal = () => {
  const [form] = Form.useForm();

  return (
    <>
      <Form
        requiredMark={false}
        form={form}
        name="signupStepOne"
        onFinish={(params) => console.log(params)}
        layout="vertical"
      >
        <Form.Item
          name="code"
          label="コード"
          rules={[
            {
              required: true,
              message: "メールアドレスを入力してください。",
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
              message: "メールアドレスを入力してください。",
            },
          ]}
        >
          <Input placeholder="" />
        </Form.Item>

        <Form.Item
          name="planReserveLimitDetails"
          label="商品選択"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
        >
          <Select
            // disabled={!sortedPlans}
            size="large"
            mode="multiple"
            style={{
              width: "100%",
            }}
            placeholder="select"
            options={[]}
          />
        </Form.Item>

        <Form.Item
          name="planReserveLimitDetails"
          label="有効期限制限"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
          valuePropName="checked"
        >
          <Checkbox>満期後は使用不可となります</Checkbox>
        </Form.Item>

        <Form.Item
          name="planReserveLimitDetails"
          label="利用可能店舗"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
          valuePropName="checked"
        >
          <Radio>満期後は使用不可となります</Radio>
        </Form.Item>

        <Form.Item
          name="planReserveLimitDetails"
          label="指定の店舗"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
        >
          <Select
            // disabled={!sortedPlans}
            size="large"
            mode="multiple"
            style={{
              width: "100%",
            }}
            placeholder="select"
            options={[]}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="説明"
          rules={[
            {
              required: true,
              message: "メールアドレスを入力してください。",
            },
          ]}
        >
          <Input placeholder="" />
        </Form.Item>

        <Form.Item
          name="status"
          label="ステータス"
          rules={[
            {
              required: true,
              message: "メールアドレスを入力してください。",
            },
          ]}
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <div className="tw-flex tw-justify-end tw-gap-2">
            <Button size="large">キャンセル</Button>
            <Button size="large" type="primary" htmlType="submit">
              保存
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateTicketModal;
