import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
import EEnumItemTypes from "@/app/_enums/EEnumItemTypes";
import { Button, Form, Input, Switch, Select } from "antd";
import _ from "lodash";
import { useEffect, useState } from "react";
import TextEditor from "../../custom/TextEditor";

const CreateItemModal = ({
  studios,
  modalKey,
  onComplete,
  onBack,
  isRequesting,
}) => {
  const [form] = Form.useForm();
  const [itemType, setItemType] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    form.resetFields();
    setItemType(null);
    setDescription("");
  }, [modalKey]);

  const handleItemTypeChange = (value) => {
    setItemType(value);
    form.setFieldValue("itemType", value);
  };

  const beforeComplete = (params) => {
    params.expireDays = +params.expireDays;
    params.price = +params.price;
    onComplete(params);
  };

  return (
    <>
      <Form
        requiredMark={false}
        form={form}
        name="create-item-form"
        onFinish={(params) => beforeComplete(params)}
        layout="vertical"
      >
        <Form.Item
          name="code"
          label="コード"
          rules={[
            {
              required: true,
              message: "コードを入力してください。",
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
              message: "名称を入力してください。",
            },
          ]}
        >
          <Input placeholder="" />
        </Form.Item>

        <Form.Item
          name="itemType"
          label="カテゴリー"
          rules={[
            {
              required: true,
              message: "カテゴリーを選択してください。",
            },
          ]}
        >
          <div className="tw-flex tw-justify-start tw-gap-4">
            {_.map(EEnumItemTypes, ({ value, label }) => (
              <Button
                key={value}
                size="large"
                type={itemType === value ? "primary" : "default"}
                onClick={() => handleItemTypeChange(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </Form.Item>

        {itemType === EEnumItemTypes.TICKET.value && (
          <>
            <Form.Item
              name="expireDays"
              label="金額（税込）"
              rules={[
                {
                  required: true,
                  message: "金額を入力してください。",
                },
              ]}
            >
              <Input type="number" placeholder="" />
            </Form.Item>

            <Form.Item
              name="studioIds"
              label="月会費"
              rules={[
                {
                  required: true,
                  message: "Please input studio name",
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
                placeholder=""
                options={studios}
              />
            </Form.Item>
          </>
        )}

        <Form.Item
          name="price"
          label="金額（税込）"
          rules={[
            {
              required: true,
              message: "金額を入力してください。",
            },
          ]}
        >
          <Input type="number" placeholder="" />
        </Form.Item>

        <Form.Item
          name="description"
          label="説明"
          rules={[
            {
              required: true,
              message: "説明を入力してください。",
            },
          ]}
        >
          <TextEditor value={description} onChange={setDescription} />
        </Form.Item>

        <Form.Item
          name="status"
          label="ステータス"
          rules={[
            {
              required: false,
            },
          ]}
          initialValue={EEnumDatabaseStatus.ACTIVE.value}
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <div className="tw-flex tw-justify-end tw-gap-2">
            <Button onClick={() => onBack()} size="large">
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

export default CreateItemModal;
