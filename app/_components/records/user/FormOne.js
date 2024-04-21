import { Button, Form, Input, Select, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  getYears,
  getMonths,
  getDays,
  getAddressFromPostalCode,
} from "@/app/_utils/helpers";

const UserFormOne = () => {
  const [form] = Form.useForm();
  const [genderValue, setGenderValue] = useState(null);
  const zipCode2 = Form.useWatch("zipCode2", form);
  const zipCode1 = Form.useWatch("zipCode1", form);
  const [isFetching, setIsFetching] = useState(false);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const fullPostalCode = `${zipCode1}${zipCode2}`;
    const fetchAddress = async () => {
      setIsFetching(true);
      const result = await getAddressFromPostalCode(fullPostalCode);
      if (result.length) {
        setAddress(result[0]);
      } else {
        setAddress(null);
      }
      setIsFetching(false);
    };
    if (!isNaN(+fullPostalCode) && fullPostalCode.toString().length === 7) {
      fetchAddress();
    }
  }, [zipCode2, zipCode1]);

  useEffect(() => {
    if (address) {
      form.setFieldsValue({
        address1: address?.city,
        address2: address?.town,
        prefecture: address?.pref,
      });
    } else {
      form.setFieldsValue({
        address1: "",
        address2: "",
        address3: "",
        prefecture: "",
      });
    }
  }, [address]);

  const handleGenderSelect = (value) => {
    setGenderValue(value);
    form.setFieldValue("gender", value);
    form.validateFields(["gender"]);
  };
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
          <Input placeholder="メールアドレス" />
        </Form.Item>

        <section className="tw-flex tw-flex-col tw-gap-2">
          <label>氏名</label>
          <div className="tw-grid tw-grid-cols-2 tw-auto-rows-min tw-gap-2">
            <Form.Item
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "姓（氏名）を入力してください。",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="姓" />
            </Form.Item>
            <Form.Item
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "名（氏名）を入力してください。",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="名" />
            </Form.Item>
          </div>
        </section>

        <section className="tw-flex tw-flex-col tw-gap-2">
          <label>氏名（カナ）</label>
          <div className="tw-grid tw-grid-cols-2 tw-gap-2">
            <Form.Item
              name="lastKana"
              rules={[
                {
                  required: true,
                  message: "姓（カナ）を入力してください。",
                  pattern: /^[\u30A1-\u30F6\s]+$/, // Katakana characters and spaces
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="姓" />
            </Form.Item>
            <Form.Item
              name="firstKana"
              rules={[
                {
                  required: true,
                  message: "名（カナ）を入力してください。",
                  pattern: /^[\u30A1-\u30F6\s]+$/, // Katakana characters and spaces
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="名" />
            </Form.Item>
          </div>
        </section>

        <section className="tw-flex tw-flex-col tw-gap-2">
          <label>生年月日</label>
          <div className="tw-grid tw-grid-cols-3 tw-gap-2">
            <Form.Item
              name="birthYear"
              rules={[
                {
                  required: true,
                  message: "ご選択ください。",
                },
              ]}
            >
              <Select
                style={{
                  width: "100%",
                }}
                size="large"
                options={getYears()}
                placeholder="1990"
              />
            </Form.Item>
            <Form.Item
              name="birthMonth"
              rules={[
                {
                  required: true,
                  message: "ご選択ください。",
                },
              ]}
            >
              <Select
                style={{
                  width: "100%",
                }}
                size="large"
                options={getMonths()}
                placeholder="01"
              />
            </Form.Item>
            <Form.Item
              name="birthDay"
              rules={[
                {
                  required: true,
                  message: "ご選択ください。",
                },
              ]}
            >
              <Select
                style={{
                  width: "100%",
                }}
                size="large"
                options={getDays()}
                placeholder="01"
              />
            </Form.Item>
          </div>
        </section>

        <section className="tw-flex tw-flex-col tw-gap-2">
          <label>性別</label>
          <Form.Item
            name="gender"
            rules={[
              {
                required: true,
                message: "性別をご選択ください。",
              },
            ]}
            validateFirst
          >
            <div className="tw-flex tw-justify-start tw-items-center tw-gap-4">
              <Button
                style={{
                  borderColor: genderValue === 1 ? "#B7DDFF" : "",
                  color: genderValue === 1 ? "#1890FF" : "",
                }}
                onClick={() => handleGenderSelect(1)}
              >
                男性
              </Button>
              <Button
                style={{
                  borderColor: genderValue === 2 ? "#B7DDFF" : "",
                  color: genderValue === 2 ? "#1890FF" : "",
                }}
                onClick={() => handleGenderSelect(2)}
              >
                女性
              </Button>
            </div>
          </Form.Item>
        </section>

        <Form.Item
          name="tel"
          label="電話番号"
          rules={[
            {
              required: true,
              message: "電話番号を入力してください。",
              whitespace: false,
            },
          ]}
        >
          <Input placeholder="電話番号" type="number" />
        </Form.Item>

        <section className="tw-flex tw-flex-col tw-gap-2">
          <label>郵便番号</label>
          <div className="tw-grid tw-grid-cols-2 tw-auto-rows-min tw-gap-2">
            <Form.Item
              name="zipCode1"
              rules={[
                {
                  required: true,
                  message: "郵便番号１を入力してください。",
                  whitespace: false,
                },
              ]}
            >
              <Input placeholder="000" type="number" maxLength={3} />
            </Form.Item>
            <Form.Item
              name="zipCode2"
              rules={[
                {
                  required: true,
                  message: "郵便番号２を入力してください。",
                  whitespace: false,
                },
              ]}
            >
              <Input
                placeholder="0000"
                type="number"
                maxLength={4}
                suffix={
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{
                          fontSize: 14,
                          display: isFetching ? "block" : "none",
                        }}
                        spin
                      />
                    }
                  />
                }
              />
            </Form.Item>
          </div>
        </section>

        <section className="tw-flex tw-flex-col tw-gap-2">
          <label>住所</label>
          <div>
            <Form.Item
              name="prefecture"
              rules={[
                {
                  required: true,
                  message: "都道府県を入力してください。",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="都道府県" />
            </Form.Item>
            <Form.Item
              name="address1"
              rules={[
                {
                  required: true,
                  message: "市区町村を入力してください。",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="市区町村" />
            </Form.Item>
            <Form.Item
              name="address2"
              rules={[
                {
                  required: true,
                  message: "町名・番地を入力してください。",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="町名・番地" />
            </Form.Item>
            <Form.Item
              name="address3"
              rules={[
                {
                  required: false,
                  message: "ビル・マンション名を入力してください。",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="番号" />
            </Form.Item>
          </div>
        </section>

        <Form.Item
          name="emergencyTel"
          label="緊急連絡先"
          rules={[
            {
              required: true,
              message: "緊急連絡先電話番号を入力してください。",
              whitespace: false,
            },
          ]}
        >
          <Input placeholder="電話番号" type="number" />
        </Form.Item>

        <Form.Item>
          <div className="tw-flex tw-justify-end tw-gap-2">
            <Button size="large">キャンセル</Button>
            <Button size="large" type="primary" htmlType="submit">
              次へ
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default UserFormOne;
