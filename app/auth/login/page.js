"use client";

import $api from "@/app/_api";
import { useUserStore } from "@/app/_store/user";
import { Button, Form, Input } from "antd";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

const AuthLogin = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  const login = async (params) => {
    setIsLoading(true);
    params.email = params.email.toLowerCase();
    const { isOk, data } = await $api.auth.login(params);
    if (isOk) {
      setUser({ ...data.admin });
      router.push("/cms");
    }
    setIsLoading(false);
  };

  // const getAdminAccess = async () => {
  //   const { isOk, data } = await $api.admin.access.getMany();
  //   if (isOk) {
  //     const sorted = _.uniqBy(data, "level_type");
  //     const mapped = _.map(
  //       sorted,
  //       ({ level_type: value, level_type: label }) => ({
  //         value,
  //         label: `タイプ${label}`,
  //       })
  //     );
  //     return mapped;
  //   } else {
  //     return null;
  //   }
  // };

  return (
    <motion.div
      layout
      className="tw-flex tw-flex-col tw-items-center tw-w-full"
    >
      <section>
        <span className="tw-text-xl tw-font-medium">ログイン</span>
      </section>
      <section className="tw-mt-10 tw-w-full">
        <Form
          form={form}
          layout="vertical"
          name="loginForm"
          onFinish={(params) => login(params)}
        >
          <Form.Item
            required={false}
            name="email"
            label="メールアドレス"
            validateTrigger="onBlur"
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
            <Input placeholder="メールアドレス" />
          </Form.Item>

          <Form.Item
            required={false}
            name="password"
            label="パスワード "
            rules={[
              {
                required: true,
                message: "パスワードを入力してください。",
              },
            ]}
          >
            <Input.Password placeholder="半角英数8文字以上" />
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="tw-w-full"
            >
              ログイン
            </Button>
          </Form.Item>
        </Form>
      </section>
    </motion.div>
  );
};

export default AuthLogin;
