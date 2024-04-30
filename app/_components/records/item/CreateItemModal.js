import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
import EEnumItemTypes from "@/app/_enums/EEnumItemTypes";
import { Button, Form, Input, Switch, Select } from "antd";
import _ from "lodash";
import { useEffect, useState } from "react";
import TextEditor from "../../custom/TextEditor";

const CreateItemModal = ({
  data,
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
    if (data) {
      setTimeout(() => {
        form.setFieldsValue({
          code: data?.code,
          name: data?.name,
          description: data?.description,
          itemType: data?.item_type,
          price: data?.prices[0]?.price,
          status:
            data?.status === true
              ? EEnumDatabaseStatus.ACTIVE.value
              : EEnumDatabaseStatus.INACTIVE.value,
        });
        setItemType(data?.item_type);
        if (data?.item_type === EEnumItemTypes.TICKET.value) {
          form.setFieldsValue({
            expiresDays: data?.m_ticket?.expires_days,
            studioIds: _.map(data?.m_ticket?.studio_ids, "id"),
          });
        }
      }, 500);
    }
  }, [data]);

  useEffect(() => {
    form.resetFields();
    setItemType(null);
    setDescription("");
  }, [modalKey]);

  const handleItemTypeChange = (value) => {
    setItemType(value);
    form.setFieldValue("itemType", value);
  };

  const isPriceReadOnly = () => {
    let result = true;
    if (!data) return false;
    if (data?.item_type === EEnumItemTypes.TICKET.value) {
      result = false;
    } else {
      result = true;
    }
    return result;
  };

  const beforeComplete = (params) => {
    if (params.expireDays) {
      params.expireDays = +params.expireDays;
    }
    params.price = +params.price;
    params.status =
      params.status === true
        ? EEnumDatabaseStatus.ACTIVE.value
        : EEnumDatabaseStatus.INACTIVE.value;
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
                disabled={data ? true : false}
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
              name="expiresDays"
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
          <Input disabled={isPriceReadOnly()} type="number" placeholder="" />
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
          initialValue={true}
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
