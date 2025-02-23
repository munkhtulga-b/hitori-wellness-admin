import { Button, Form, Input, Select, Switch, Spin, Checkbox } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getYears, getMonths, getDays } from "@/app/_utils/helpers";
import _ from "lodash";
import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
import dayjs from "dayjs";
import $api from "@/app/_api";

const UserDetailsForm = ({
  data,
  onComplete,
  onBack,
  modalKey,
  isRequesting,
}) => {
  const [form] = Form.useForm();
  const [genderValue, setGenderValue] = useState(null);
  const zipCode2 = Form.useWatch("zipCode2", form);
  const zipCode1 = Form.useWatch("zipCode1", form);
  const birthYear = Form.useWatch("birthYear", form);
  const birthMonth = Form.useWatch("birthMonth", form);
  const [isFetching, setIsFetching] = useState(false);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        form.setFieldsValue({
          mailAddress: data?.mail_address,
          lastName: data?.last_name,
          firstName: data?.first_name,
          lastKana: data?.last_kana,
          firstKana: data?.first_kana,
          gender: data?.gender,
          birthYear: dayjs(data?.birthday).format("YYYY"),
          birthMonth: dayjs(data?.birthday).format("MM"),
          birthDay: dayjs(data?.birthday).format("DD"),
          zipCode1: data?.zip_code1,
          zipCode2: data?.zip_code2,
          address1: data?.address1,
          address2: data?.address2,
          address3: data?.address3,
          prefecture: data?.prefecture,
          tel: data?.tel,
          emergencyTel: data?.emergency_tel,
          isAcceptMail: data?.is_accept_mail,
          status:
            data?.status === EEnumDatabaseStatus.ACTIVE.value ? true : false,
        });
        setGenderValue(data?.gender);
      }, 500);
    }
  }, [data]);

  useEffect(() => {
    if (data) return;
    const fullPostalCode = `${zipCode1}${zipCode2}`;
    const fetchAddress = async () => {
      setIsFetching(true);
      const { isOk, data } = await $api.admin.post.getOne(fullPostalCode);
      if (isOk) {
        setAddress(data);
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

  useEffect(() => {
    form.resetFields();
    setGenderValue(null);
  }, [modalKey]);

  const beforeComplete = (params) => {
    params.tel = formatPhoneNumber(params.tel);
    params.emergencyTel = formatPhoneNumber(params.emergencyTel);
    params.mailAddress = params.mailAddress.toLowerCase();
    const dateOfBirth = `${params.birthYear}-${params.birthMonth}-${params.birthDay}`;
    const omitted = _.omit(params, ["birthYear", "birthMonth", "birthDay"]);
    const body = {
      ...omitted,
      birthday: dateOfBirth,
      status:
        params.status === true
          ? EEnumDatabaseStatus.ACTIVE.value
          : EEnumDatabaseStatus.INACTIVE.value,
    };
    onComplete(body);
  };

  const handleGenderSelect = (value) => {
    setGenderValue(value);
    form.setFieldValue("gender", value);
    form.validateFields(["gender"]);
  };

  const formatPhoneNumber = (value) => {
    let result = "";
    if (value) {
      result = value.toString().replace("-", "");
    }
    return result;
  };

  return (
    <>
      <Form
        requiredMark={false}
        form={form}
        name="create-user-form"
        onFinish={(params) => beforeComplete(params)}
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
                  pattern: /^[\u30A1-\u30F6\u30FC\s]+$/, // Katakana characters and spaces
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
                  pattern: /^[\u30A1-\u30F6\u30FC\s]+$/, // Katakana characters and spaces
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
                options={getYears(15, 100)}
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
                disabled={!birthYear || !birthMonth}
                style={{
                  width: "100%",
                }}
                size="large"
                options={getDays(birthYear, birthMonth)}
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
              validator: (_, value) => {
                // Allow only digits and hyphens, with at most one hyphen between digits
                const pattern = /^(?!.*--)(?!-)(?!.*-$)(\d+-?)*\d+$/;

                // Count the number of hyphens to adjust the length check
                const hyphenCount = value?.split("-")?.length - 1 || 0;
                const minLength = 10 + hyphenCount;
                const maxLength = 11 + hyphenCount;

                if (!value) {
                  return Promise.reject(
                    new Error("電話番号を入力してください。")
                  );
                }

                if (!pattern.test(value)) {
                  return Promise.reject(
                    new Error("電話番号を入力してください。")
                  );
                }

                if (value.length < minLength || value.length > maxLength) {
                  return Promise.reject(
                    new Error("電話番号を入力してください。")
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
          getValueFromEvent={(e) => {
            const value = e.target.value;
            // Remove any character that is not a digit or hyphen
            return value.replace(/[^0-9-]/g, "");
          }}
        >
          <Input placeholder="電話番号" />
        </Form.Item>

        <section className="tw-flex tw-flex-col tw-gap-2">
          <label>郵便番号</label>
          <div className="tw-grid tw-grid-cols-2 tw-auto-rows-min tw-gap-2">
            <Form.Item
              name="zipCode1"
              rules={[
                {
                  required: true,
                  message: "郵便番号を入力してください。",
                  whitespace: false,
                },
              ]}
              getValueFromEvent={(e) => {
                const value = e.target.value;
                const numberString = value.replace(/^\D*(\d{3})\D*$/, "$1");
                return numberString;
              }}
            >
              <Input placeholder="000" maxLength={3} />
            </Form.Item>
            <Form.Item
              name="zipCode2"
              rules={[
                {
                  required: true,
                  message: "郵便番号を入力してください。",
                  whitespace: false,
                },
              ]}
              getValueFromEvent={(e) => {
                const value = e.target.value;
                const numberString = value.replace(/^\D*(\d{4})\D*$/, "$1");
                return numberString;
              }}
            >
              <Input
                placeholder="0000"
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
              validator: (_, value) => {
                const pattern = /^(?!-)(?!.*-$)[0-9-]+$/;
                const minLength = 10 + (value?.split("-")?.length - 1 || 0);
                const maxLength = 11 + (value?.split("-")?.length - 1 || 0);

                if (!value) {
                  return Promise.reject(
                    new Error("電話番号を入力してください。")
                  );
                }

                if (!pattern.test(value)) {
                  return Promise.reject(
                    new Error("電話番号を入力してください。")
                  );
                }

                if (value.length < minLength || value.length > maxLength) {
                  return Promise.reject(
                    new Error(`電話番号を入力してください。`)
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
          getValueFromEvent={(e) => {
            const value = e.target.value;
            return value.replace(/[^0-9-]/g, "");
          }}
        >
          <Input placeholder="電話番号" />
        </Form.Item>

        <Form.Item
          name="isAcceptMail"
          rules={[
            {
              required: false,
            },
          ]}
          valuePropName="checked"
          initialValue={true}
        >
          <Checkbox>キャンペーン・お知らせ等の情報をメールを送信する</Checkbox>
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
          <div className="tw-flex tw-justify-end tw-gap-2">
            <Button size="large" onClick={() => onBack()}>
              戻す
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

export default UserDetailsForm;
