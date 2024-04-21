import { Button, Form, Input, Switch } from "antd";

const CreateItemModal = () => {
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
          name="category"
          label="カテゴリー"
          rules={[
            {
              required: true,
              message: "メールアドレスを入力してください。",
            },
          ]}
        >
          <div className="tw-flex tw-justify-start tw-gap-4">
            <Button size="large">プラン</Button>
            <Button size="large">チケット</Button>
            <Button size="large">その他</Button>
          </div>
        </Form.Item>

        <Form.Item
          name="price"
          label="金額（税込）"
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

export default CreateItemModal;
