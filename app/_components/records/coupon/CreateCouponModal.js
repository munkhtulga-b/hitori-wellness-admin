import { Button, Form, Input, Switch, Select, Radio, DatePicker } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

const CreateCouponModal = ({
  onComplete,
  onCancel,
  modalKey,
  isRequesting,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [modalKey]);

  return (
    <>
      <Form
        requiredMark={false}
        form={form}
        name="signupStepOne"
        onFinish={(params) => onComplete(params)}
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
          name="name"
          label="名称"
          rules={[
            {
              required: true,
              message: "メールアドレスを入力してください。",
            },
          ]}
        >
          <Input type="number" placeholder="" />
        </Form.Item>

        <div className="tw-flex tw-justify-start tw-gap-2">
          <Form.Item
            name="startAt"
            label="開始日程"
            rules={[
              {
                type: "object",
                required: true,
                message: "メールアドレスを入力してください。",
              },
            ]}
            style={{ flex: 1 }}
          >
            <DatePicker
              format={"YYYY/MM/DD"}
              disabledDate={(current) =>
                current < dayjs().subtract(1, "day").startOf("day")
              }
              className="tw-w-full"
            />
          </Form.Item>
          <Form.Item
            name="endAt"
            label="終了日程"
            rules={[
              {
                type: "object",
                required: true,
                message: "メールアドレスを入力してください。",
              },
            ]}
            style={{ flex: 1 }}
          >
            <DatePicker
              format={"YYYY/MM/DD"}
              disabledDate={(current) =>
                current < dayjs().subtract(1, "day").startOf("day")
              }
              className="tw-w-full"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="planReserveLimitDetails"
          label="対象商品選択"
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
            <Button size="large" onClick={() => onCancel()}>
              キャンセル
            </Button>
            <Button
              loading={isRequesting}
              size="large"
              type="primary"
              htmlType="submit"
            >
              保存
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateCouponModal;
