import { Form, Input, Button } from "antd";
import { useEffect } from "react";

const StudioFormTwo = ({ data, onComplete, onBack, modalKey }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [modalKey]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        categoryName: data?.category_name,
        prefecture: data?.prefecture,
        zipCode1: data?.zip_code1,
        zipCode2: data?.zip_code2,
        address1: data?.address1,
        address2: data?.address2,
        address3: data?.address3,
      });
    }
  }, [data]);

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="studio-form-two"
        onFinish={(params) => onComplete(params)}
        requiredMark={false}
        validateTrigger="onSubmit"
      >
        <Form.Item
          name="categoryName"
          label="エリア"
          rules={[
            {
              required: true,
              message: "エリアを入力してください。",
            },
          ]}
        >
          <Input placeholder="" />
        </Form.Item>
        <section className="tw-flex tw-flex-col">
          <label className="tw-leading-[22px] tw-tracking-[0.14px]">
            郵便番号１
          </label>
          <section className="tw-flex tw-justify-start tw-gap-2">
            <Form.Item
              name="zipCode1"
              rules={[
                {
                  required: true,
                  message: "郵便番号1を入力してください。",
                  whitespace: false,
                },
              ]}
              style={{ flex: 1 }}
            >
              <Input placeholder="000" type="number" maxLength={3} />
            </Form.Item>
            <Form.Item
              name="zipCode2"
              rules={[
                {
                  required: true,
                  message: "郵便番号2を入力してください。",
                  whitespace: false,
                },
              ]}
              style={{ flex: 3 }}
            >
              <Input placeholder="0000" type="number" maxLength={4} />
            </Form.Item>
          </section>
        </section>
        <Form.Item
          name="prefecture"
          label="都道府県"
          rules={[
            {
              required: true,
              message: "都道府県を入力してください。",
            },
          ]}
        >
          <Input placeholder="" />
        </Form.Item>
        <Form.Item
          name="address1"
          label="市区町村"
          rules={[
            {
              required: true,
              message: "市区町村を入力してください。",
            },
          ]}
        >
          <Input placeholder="" />
        </Form.Item>
        <Form.Item
          name="address2"
          label="町名・番地"
          rules={[
            {
              required: true,
              message: "町名・番地を入力してください。",
            },
          ]}
        >
          <Input placeholder="" />
        </Form.Item>
        <Form.Item
          name="address3"
          label="番号"
          rules={[
            {
              required: false,
              message: "Please input prefecture",
            },
          ]}
        >
          <Input placeholder="" />
        </Form.Item>
        <Form.Item>
          <div className="tw-flex tw-justify-end tw-items-start tw-gap-2 tw-mt-6">
            <Button size="large" onClick={() => onBack()}>
              戻る
            </Button>
            <Button type="primary" htmlType="submit" size="large">
              次へ
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default StudioFormTwo;
