"use client";

import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { isValidPassword } from "@/app/_utils/helpers";
import $api from "@/app/_api";
import PageHeader from "@/app/_components/PageHeader";
import PasswordCretaria from "@/app/_components/custom/PasswordCretaria";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);

  const newPassword = Form.useWatch("newPassword", form);

  const onFinish = (params) => {
    if (
      !isValidPassword(params.confirm)?.cretariasMet < 2 &&
      !isValidPassword(params.confirm)?.isLongEnough
    ) {
      return messageApi.error(
        "半角英大文字、半角英小文字、数字、記号の中から2種類を含む8文字以上を指定してください。"
      );
    }
    changePassword(params);
  };

  const changePassword = async ({ currentPassword, newConfirm }) => {
    setIsLoading(true);
    const { isOk } = await $api.auth.password({
      oldPassword: currentPassword,
      newPassword: newConfirm,
    });
    if (isOk) {
      form.resetFields();
      messageApi.success("パスワードの変更が完了しました。");
    }
    setIsLoading(false);
  };

  return (
    <>
      {contextHolder}
      <div className="tw-flex tw-flex-col tw-gap-6">
        <PageHeader title={"パスワードリセット"} />
        <section className="tw-flex tw-justify-center">
          <Form
            layout="vertical"
            form={form}
            name="change-password-form"
            onFinish={onFinish}
            style={{ width: 400 }}
          >
            <Form.Item
              name="currentPassword"
              label="現在のパスワード"
              rules={[
                {
                  required: true,
                  message: "パスワードを入力してください。",
                },
              ]}
            >
              <Input.Password placeholder="半角英数8文字以上" />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="新しいパスワード"
              rules={[
                {
                  required: true,
                  message: "パスワードを入力してください。",
                },
              ]}
              style={{ marginTop: 24 }}
            >
              <Input.Password placeholder="半角英数8文字以上" />
            </Form.Item>
            <Form.Item
              name="newConfirm"
              label="新しいパスワード（確認用）"
              dependencies={["newPassword"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "パスワード（確認用）を入力してください。",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("パスワードが一致しません。")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="半角英数8文字以上" />
            </Form.Item>
            <section className="tw-my-[28px]">
              <PasswordCretaria password={newPassword} />
            </section>
            <Form.Item>
              <Button
                size="large"
                loading={isLoading}
                type="primary"
                htmlType="submit"
                className="tw-w-full"
              >
                保存
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    </>
  );
};

export default ChangePassword;
