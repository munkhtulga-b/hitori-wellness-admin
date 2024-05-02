import $api from "@/app/_api";
import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
import { Button, Form, Input, Switch, Select, Radio, DatePicker } from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useState } from "react";

const CreateCouponModal = ({
  data,
  studios,
  onComplete,
  onCancel,
  modalKey,
  isRequesting,
}) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState(null);
  const studioIds = Form.useWatch("targetStudioIds", form);
  const [noLimit, setNoLimit] = useState(true);
  const [discountType, setDiscountType] = useState(1);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        form.setFieldsValue({
          code: data?.code,
          name: data?.name,
          startAt: dayjs(data?.start_at),
          endAt: dayjs(data?.end_at),
          maxUseNum: data?.max_use_num,
          discountType: data?.discounts[0]?.discount_type,
          discountValue: data?.discounts[0]?.discount_value,
          items: _.map(data?.discounts, "item_id"),
          targetStudioIds: _.map(data?.studio_ids, "id"),
          noLimit: data?.target_studio_ids?.length === 0,
          status:
            data?.status === EEnumDatabaseStatus.ACTIVE.value ? true : false,
        });
        setNoLimit(data?.target_studio_ids?.length === 0);
      }, 500);
    }
  }, [data]);

  useEffect(() => {
    form.resetFields();
  }, [modalKey]);

  useEffect(() => {
    if (noLimit) {
      form.setFieldValue("targetStudioIds", []);
    }
  }, [noLimit]);

  useEffect(() => {
    if (studioIds?.length) {
      setNoLimit(false);
      form.setFieldValue("noLimit", false);
    }
  }, [studioIds]);

  const fetchItems = async () => {
    const { isOk, data } = await $api.admin.item.getMany();
    if (isOk) {
      const sorted = _.map(data, ({ id: value, name: label }) => ({
        value,
        label,
      }));
      setItems(sorted);
    }
  };

  const beforeComplete = (params) => {
    const body = {
      code: params.code,
      name: params.name,
      startAt: `${dayjs(params.startAt).format("YYYY-MM-DD")} ${dayjs()
        .startOf("day")
        .format("HH:mm:ss")}`,
      endAt: `${dayjs(params.endAt).format("YYYY-MM-DD")} ${dayjs()
        .endOf("day")
        .format("HH:mm:ss")}`,
      couponType: 1,
      maxUseNum: +params.maxUseNum,
      targetStudioIds: params.targetStudioIds,
      discountDetails: _.map(params.items, (id) => ({
        itemId: id,
        discountType: params.discountType,
        discountValue: +params.discountValue,
      })),
      status:
        params.status === true
          ? EEnumDatabaseStatus.ACTIVE.value
          : EEnumDatabaseStatus.INACTIVE.value,
    };
    onComplete(body);
  };

  return (
    <>
      <Form
        requiredMark={false}
        form={form}
        name="create-coupon-form"
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
          name="maxUseNum"
          label="最大使用回数"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input type="number" placeholder="" />
        </Form.Item>

        <div className="tw-flex tw-justify-start tw-gap-2">
          <Form.Item
            name="startAt"
            label="開始日程"
            rules={[
              {
                type: "object",
                required: true,
                message: "開始日程を選択してください。",
              },
            ]}
            style={{ flex: 1 }}
          >
            <DatePicker
              format={"YYYY/MM/DD"}
              disabledDate={(current) =>
                current < dayjs().subtract(1, "day").startOf("day")
              }
              className="tw-w-full"
            />
          </Form.Item>
          <Form.Item
            name="endAt"
            label="終了日程"
            rules={[
              {
                type: "object",
                required: true,
                message: "終了日程を選択してください。",
              },
            ]}
            style={{ flex: 1 }}
          >
            <DatePicker
              format={"YYYY/MM/DD"}
              disabledDate={(current) =>
                current < dayjs().subtract(1, "day").startOf("day")
              }
              className="tw-w-full"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="items"
          label="対象商品選択"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
        >
          <Select
            disabled={!items}
            size="large"
            mode="multiple"
            style={{
              width: "100%",
            }}
            placeholder=""
            options={items}
          />
        </Form.Item>

        <div className="tw-flex tw-justify-start tw-gap-2">
          <Form.Item
            name="discountType"
            label="利用可能店舗"
            rules={[
              {
                required: true,
                message: "Please input studio name",
              },
            ]}
            style={{ flex: 1 }}
            initialValue={discountType}
          >
            <section className="tw-flex tw-flex-col tw-gap-6">
              <Radio
                value={1}
                checked={discountType === 1}
                onChange={() => {
                  setDiscountType(1);
                  form.setFieldValue("discountType", 1);
                }}
              >
                固定
              </Radio>
              <Radio
                value={2}
                checked={discountType === 2}
                onChange={() => {
                  setDiscountType(2);
                  form.setFieldValue("discountType", 2);
                }}
              >
                割合
              </Radio>
            </section>
          </Form.Item>
          <Form.Item
            name="discountValue"
            label="割合値"
            rules={[
              {
                required: true,
                message: "Please input studio name",
              },
            ]}
            style={{ flex: 1 }}
          >
            <Input placeholder="" type="number" />
          </Form.Item>
        </div>

        <Form.Item
          name="noLimit"
          label="指定の店舗"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
          valuePropName="checked"
          initialValue={noLimit}
        >
          <Radio checked={noLimit} onChange={() => setNoLimit(true)}>
            全店舗利用
          </Radio>
        </Form.Item>

        <Form.Item
          name="targetStudioIds"
          label="指定の店舗"
          rules={[
            {
              required: false,
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

        <Form.Item
          name="status"
          label="ステータス"
          rules={[
            {
              required: false,
            },
          ]}
          initialValue={true}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <div className="tw-flex tw-justify-end tw-gap-2">
            <Button size="large" onClick={() => onCancel()}>
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

export default CreateCouponModal;
