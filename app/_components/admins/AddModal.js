import EEnumAdminLevelTypes from "@/app/_enums/EEnumAdminLevelTypes";
import { Form, Input, Select, Button } from "antd";
import _ from "lodash";
import { useEffect } from "react";

const AddModal = ({ studios, isRequesting, onConfirm, modalKey }) => {
  const [form] = Form.useForm();
  const levelType = Form.useWatch("levelType", form);

  useEffect(() => {
    form.resetFields();
  }, [modalKey]);

  const beforeComplete = (params) => {
    if (levelType === EEnumAdminLevelTypes.type1.value) {
      params.studios = [];
    }
    params.mailAddress = params.mailAddress.toLowerCase();
    onConfirm(params);
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6 tw-border-t tw-border-divider">
        <section>
          <Form
            layout="vertical"
            form={form}
            name="register"
            onFinish={(params) => beforeComplete(params)}
            requiredMark={false}
            validateTrigger="onSubmit"
          >
            <Form.Item
              name="mailAddress"
              label="メールアドレス"
              rules={[
                {
                  type: "email",
                  message: "正しいメールアドレスを入力してください。",
                },
                {
                  required: true,
                  message: "メールアドレスを入力してください。",
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
                  message: "権限タイプを選択してください。",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="タイプを選択する"
                style={{
                  width: "100%",
                }}
                options={_.map(EEnumAdminLevelTypes, (item) => ({
                  label: item.label,
                  value: item.value,
                }))}
              />
            </Form.Item>
            {levelType !== EEnumAdminLevelTypes.type1.value && (
              <Form.Item
                name="studios"
                label="登録店舗"
                rules={[
                  {
                    required: levelType == 1 ? false : true,
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
                  placeholder="店舗を選択する"
                  options={studios}
                />
              </Form.Item>
            )}
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
