import $api from "@/app/_api";
// import EEnumDatabaseStatus from "@/app/_enums/EEnumDatabaseStatus";
import { parseNumberString, thousandSeparator } from "@/app/_utils/helpers";
import { Button, Form, Input, Select, Radio, DatePicker } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
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
  const [discountItems, setDiscountItems] = useState([]);
  const [noMaxNum, setNoMaxNum] = useState(false);
  const [isAllStudios, setIsAllStudios] = useState(false);

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
          studioIds: _.map(data?.studio_ids, "id"),
          // status:
          //   data?.status === EEnumDatabaseStatus.ACTIVE.value ? true : false,
        });
        setNoMaxNum(data?.max_use_num === 0);
        setIsAllStudios(data?.studio_ids?.length === 0);
        if (data?.discount_details?.length) {
          setDiscountItems(
            _.map(data?.discount_details, (detail, idx) => ({
              id: idx + 1,
              discountType: detail?.discount_type,
            }))
          );
          setTimeout(() => {
            data?.discount_details?.forEach((detail, idx) => {
              form.setFieldValue(`item-${idx + 1}`, detail?.item_id);
              form.setFieldValue(
                `discountValue-${idx + 1}`,
                detail?.discount_value
              );
            });
          }, 200);
        }
      }, 500);
    }
  }, [data]);

  useEffect(() => {
    form.resetFields();
  }, [modalKey]);

  useEffect(() => {
    if (studioIds?.length) {
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
      maxUseNum: noMaxNum ? 0 : parseNumberString(params.maxUseNum),
      studioIds: !isAllStudios ? params.studioIds : [],
      discountDetails: _.map(params.items, (id) => ({
        itemId: id,
        discountType: parseNumberString(params.discountType),
        discountValue: parseNumberString(params.discountValue),
      })),
      // status:
      //   params.status === true
      //     ? EEnumDatabaseStatus.ACTIVE.value
      //     : EEnumDatabaseStatus.INACTIVE.value,
    };
    discountItems.forEach((item) => {
      body.discountDetails.push({
        itemId: params[`item-${item.id}`],
        discountType: parseNumberString(item.discountType),
        discountValue: parseNumberString(params[`discountValue-${item.id}`]),
      });
    });
    onComplete(body);
  };

  const onAddDiscountItem = () => {
    const shallow = _.cloneDeep(discountItems);
    if (shallow.length) {
      const lastItem = shallow[shallow.length - 1];
      shallow.push({
        id: lastItem.id + 1,
        discountType: 1,
      });
    } else {
      shallow.push({
        id: 1,
        discountType: 1,
      });
    }
    setDiscountItems(shallow);
  };

  const onDiscountTypeChange = ({ id }, type) => {
    const shallow = _.cloneDeep(discountItems);
    const itemIdx = shallow.map((i) => i.id).indexOf(id);
    if (itemIdx !== -1) {
      shallow[itemIdx].discountType = type;
      setDiscountItems(shallow);
    }
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

        <div className="tw-flex tw-flex-col tw-gap-1 tw-mb-4">
          <label>最大使用回数</label>
          <Form.Item style={{ marginBottom: 4 }}>
            <div className="tw-flex tw-flex-col tw-gap-2">
              <Radio checked={noMaxNum} onChange={() => setNoMaxNum(true)}>
                無制限
              </Radio>
              <Radio checked={!noMaxNum} onChange={() => setNoMaxNum(false)}>
                回数に制限をかける
              </Radio>
            </div>
          </Form.Item>
          {!noMaxNum && (
            <Form.Item
              name="maxUseNum"
              rules={[
                {
                  required: true,
                  message: "回数を設定してください。",
                },
              ]}
              getValueFromEvent={(e) => {
                const value = e.target.value;
                const numberString = value.replace(/\D/g, "");
                return thousandSeparator(numberString);
              }}
              style={{ marginBottom: 0 }}
            >
              <Input placeholder="00" />
            </Form.Item>
          )}
        </div>

        <div className="tw-flex tw-justify-start tw-gap-2">
          <Form.Item
            name="startAt"
            label="開始日程"
            rules={[
              {
                type: "object",
                required: true,
                message: "開始日を選択してください。",
              },
            ]}
            style={{ flex: 1 }}
          >
            <DatePicker
              format={"YYYY/MM/DD"}
              disabledDate={(current) => {
                return current && current < dayjs().startOf("day");
              }}
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
                message: "終了日を選択してください。",
              },
            ]}
            style={{ flex: 1 }}
          >
            <DatePicker
              format={"YYYY/MM/DD"}
              disabledDate={(current) => {
                return current && current < dayjs().startOf("day");
              }}
              className="tw-w-full"
            />
          </Form.Item>
        </div>

        {discountItems.map((item) => (
          <div key={item.id}>
            <Form.Item
              name={`item-${item.id}`}
              label="対象商品選択"
              rules={[
                {
                  required: true,
                  message: "対象商品を選択してください。",
                },
              ]}
            >
              <Select
                disabled={!items}
                size="large"
                style={{
                  width: "100%",
                }}
                placeholder="商品を選択"
                options={items}
              />
            </Form.Item>

            <div className="tw-flex tw-justify-start tw-gap-2">
              <Form.Item
                name={`discountType-${item.id}`}
                label="割引タイプ"
                rules={[
                  {
                    required: true,
                    message: "割合タイプを選択してください。",
                  },
                ]}
                style={{ flex: 1 }}
                initialValue={1}
              >
                <section className="tw-flex tw-flex-col tw-gap-2">
                  <Radio
                    value={1}
                    checked={item.discountType === 1}
                    onChange={() => {
                      onDiscountTypeChange(item, 1);
                    }}
                  >
                    固定
                  </Radio>
                  <Radio
                    value={2}
                    checked={item.discountType === 2}
                    onChange={() => {
                      onDiscountTypeChange(item, 2);
                    }}
                  >
                    割合
                  </Radio>
                </section>
              </Form.Item>
              <Form.Item
                name={`discountValue-${item.id}`}
                label={`割合値 (${item.discountType === 1 ? "円" : "%"})`}
                rules={[
                  {
                    required: true,
                    message: "割合を設定をしてください。",
                  },
                ]}
                getValueFromEvent={(e) => {
                  const value = e.target.value;
                  let numberString = value.replace(/\D/g, "");
                  return thousandSeparator(numberString);
                }}
                style={{ flex: 1 }}
              >
                <Input placeholder="" />
              </Form.Item>
            </div>
          </div>
        ))}

        <Form.Item label="商品追加">
          <PlusSquareOutlined
            style={{ fontSize: 20, cursor: "pointer" }}
            onClick={() => onAddDiscountItem()}
          />
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

        {/* <Form.Item
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
        </Form.Item> */}

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
