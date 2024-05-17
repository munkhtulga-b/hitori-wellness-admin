import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
import EEnumItemTypes from "@/app/_enums/EEnumItemTypes";
import { Button, Form, Input, Switch, Select, Radio } from "antd";
import _ from "lodash";
import { useEffect, useState } from "react";
import TextEditor from "../../custom/TextEditor";
import { parseNumberString, thousandSeparator } from "@/app/_utils/helpers";

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
  const [isAllStudios, setIsAllStudios] = useState(false);

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
            data?.status === EEnumDatabaseStatus.ACTIVE.value ? true : false,
        });
        setItemType(data?.item_type);
        if (data?.item_type === EEnumItemTypes.TICKET.value) {
          form.setFieldsValue({
            expiresDays: data?.m_ticket?.expires_days,
            studioIds: _.map(data?.m_ticket?.studio_ids, "id"),
          });
          setIsAllStudios(data?.m_ticket?.studio_ids?.length === 0);
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
    if (params.expiresDays) {
      params.expiresDays = parseNumberString(params.expiresDays);
    }
    if (isAllStudios && params.itemType === EEnumItemTypes.TICKET.value) {
      params.studioIds = [];
    }
    delete params.isAllStudios;
    params.price = parseNumberString(params.price);
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
          <Input placeholder="0000" />
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
          <Input placeholder="名称" />
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
              label="有効期限制限"
              rules={[
                {
                  required: true,
                  message: "金額を入力してください。",
                },
              ]}
              getValueFromEvent={(e) => {
                const value = e.target.value;
                const numberString = value.replace(/\D/g, "");
                return thousandSeparator(numberString);
              }}
            >
              <Input placeholder="日" />
            </Form.Item>

            <div className="tw-flex tw-flex-col tw-gap-1">
              <label className="tw-mb-2">利用可能店舗</label>
              <Form.Item style={{ marginBottom: 4 }}>
                <div className="tw-flex tw-flex-col tw-gap-2">
                  <Radio
                    checked={isAllStudios}
                    onChange={() => setIsAllStudios(true)}
                  >
                    全店舗利用
                  </Radio>
                  <Radio
                    checked={!isAllStudios}
                    onChange={() => setIsAllStudios(false)}
                  >
                    指定の店舗のみ
                  </Radio>
                </div>
              </Form.Item>
              {!isAllStudios && (
                <Form.Item
                  name="studioIds"
                  rules={[
                    {
                      required: true,
                      message: "店舗を選択してください。",
                    },
                  ]}
                >
                  <Select
                    disabled={!studios}
                    mode="multiple"
                    size="large"
                    style={{
                      width: "100%",
                    }}
                    placeholder="店舗を選択"
                    options={studios}
                  />
                </Form.Item>
              )}
            </div>
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
          getValueFromEvent={(e) => {
            const value = e.target.value;
            const numberString = value.replace(/\D/g, "");
            return thousandSeparator(numberString);
          }}
        >
          <Input disabled={isPriceReadOnly()} placeholder="0000" />
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
