import { useAdminAccessStore } from "@/app/_store/admin-access";
import { Form, Input, Select, Button } from "antd";

const AddModal = ({ studios, isRequesting, onConfirm }) => {
  const [form] = Form.useForm();
  const getLevelTypes = useAdminAccessStore((state) => state.getAccess());

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6 tw-border-t tw-border-divider">
        <section>
          <Form
            layout="vertical"
            form={form}
            name="register"
            onFinish={(params) => onConfirm(params)}
            requiredMark={false}
            validateTrigger="onSubmit"
          >
            <Form.Item
              name="mailAddress"
              label="メールアドレス"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input placeholder="mail@mail.com" />
            </Form.Item>
            <Form.Item
              name="levelType"
              label="権限タイプ"
              rules={[
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Select
                disabled={!getLevelTypes}
                size="large"
                placeholder="タイプを選択する"
                style={{
                  width: "100%",
                }}
                options={getLevelTypes}
              />
            </Form.Item>
            <Form.Item
              name="studios"
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
              className="tw-flex tw-justify-center"
              style={{ marginTop: 24, marginBottom: 0 }}
            >
              <Button
                loading={isRequesting}
                type="primary"
                size="large"
                htmlType="submit"
                className="tw-w-[90px]"
              >
                送信
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    </>
  );
};

export default AddModal;
