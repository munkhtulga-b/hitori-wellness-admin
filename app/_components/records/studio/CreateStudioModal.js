import {
  Form,
  Input,
  Button,
  Tabs,
  Switch,
  Upload,
  TimePicker,
  Radio,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const CreateStudioModal = ({ modalKey, isRequesting, onConfirm, onCancel }) => {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState(1);

  useEffect(() => {
    form.resetFields();
  }, [modalKey]);

  const FormOne = () => {
    return (
      <Form
        layout="vertical"
        form={form}
        name="form-one"
        onFinish={(params) => console.log(params)}
        requiredMark={false}
        validateTrigger="onSubmit"
      >
        <Form.Item
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Please upload studio image" }]}
        >
          <Upload action="/upload.do" listType="picture-card" maxCount={1}>
            <button
              style={{
                border: 0,
                background: "none",
              }}
              type="button"
            >
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                アップロード
              </div>
            </button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="code"
          label="コード"
          rules={[
            {
              required: true,
              message: "Please input studio code",
            },
          ]}
        >
          <Input placeholder="code" />
        </Form.Item>
        <Form.Item
          name="name"
          label="名称"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
        >
          <Input placeholder="name" />
        </Form.Item>
        <Form.Item name="status" label="ステータス" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item>
          <div className="tw-flex tw-justify-end tw-items-start tw-gap-2">
            <Button size="large" onClick={() => onCancel()}>
              キャンセル
            </Button>
            <Button type="primary" htmlType="submit" size="large">
              次へ
            </Button>
          </div>
        </Form.Item>
      </Form>
    );
  };

  const FormTwo = () => {
    return (
      <>
        <Form
          layout="vertical"
          form={form}
          name="form-two"
          onFinish={(params) => console.log(params)}
          requiredMark={false}
          validateTrigger="onSubmit"
        >
          <Form.Item
            name="prefecture"
            label="エリア"
            rules={[
              {
                required: true,
                message: "Please input prefecture",
              },
            ]}
          >
            <Input placeholder="code" />
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
                    message: "Please input studio name",
                  },
                ]}
                style={{ flex: 1 }}
              >
                <Input placeholder="name" />
              </Form.Item>
              <Form.Item
                name="zipCode2"
                rules={[
                  {
                    required: true,
                    message: "Please input studio name",
                  },
                ]}
                style={{ flex: 3 }}
              >
                <Input placeholder="name" />
              </Form.Item>
            </section>
          </section>
          <Form.Item
            name="address1"
            label="都道府県"
            rules={[
              {
                required: true,
                message: "Please input prefecture",
              },
            ]}
          >
            <Input placeholder="code" />
          </Form.Item>
          <Form.Item
            name="address2"
            label="市区町村"
            rules={[
              {
                required: true,
                message: "Please input prefecture",
              },
            ]}
          >
            <Input placeholder="code" />
          </Form.Item>
          <Form.Item
            name="address3"
            label="町名・番地"
            rules={[
              {
                required: true,
                message: "Please input prefecture",
              },
            ]}
          >
            <Input placeholder="code" />
          </Form.Item>
          <Form.Item
            name="address4"
            label="番号"
            rules={[
              {
                required: true,
                message: "Please input prefecture",
              },
            ]}
          >
            <Input placeholder="code" />
          </Form.Item>
          <Form.Item>
            <div className="tw-flex tw-justify-end tw-items-start tw-gap-2 tw-mt-6">
              <Button size="large" onClick={() => onCancel()}>
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

  const FormThree = () => {
    return (
      <>
        <Form
          layout="vertical"
          form={form}
          name="form-three"
          onFinish={(params) => console.log(params)}
          requiredMark={false}
          validateTrigger="onSubmit"
        >
          <section className="tw-flex tw-flex-col tw-gap-4">
            <div className="tw-leading-[22px] tw-tracking-[0.14px]">
              営業時間
            </div>
            <div className="tw-flex tw-justify-start tw-gap-2">
              <Form.Item
                name="startHour"
                label="開店時間"
                rules={[
                  {
                    required: true,
                    message: "Please input prefecture",
                  },
                ]}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
              <Form.Item
                name="endHour"
                label="閉店時間"
                rules={[
                  {
                    required: true,
                    message: "Please input prefecture",
                  },
                ]}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
            </div>
          </section>
          <Form.Item
            name="startHour"
            rules={[
              {
                required: true,
                message: "Please input prefecture",
              },
            ]}
          >
            <Radio>24時間営業</Radio>
          </Form.Item>
          <Form.Item>
            <div className="tw-flex tw-justify-end tw-items-start tw-gap-2 tw-mt-6">
              <Button size="large" onClick={() => onCancel()}>
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

  const items = [
    {
      key: 1,
      label: "基本情報",
      children: <FormOne />,
    },
    {
      key: 2,
      label: "住所",
      children: <FormTwo />,
    },
    {
      key: 3,
      label: "営業設定",
      children: <FormThree />,
    },
  ];

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <>
      <div className="">
        <Tabs activeKey={activeKey} items={items} onChange={onTabChange} />
      </div>
    </>
  );
};

export default CreateStudioModal;
