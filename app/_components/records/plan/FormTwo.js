import EEnumReservableStudioType from "@/app/_enums/EEnumReservableStudioType";
import { parseNumberString, thousandSeparator } from "@/app/_utils/helpers";
import { Form, Button, Select, Input, Checkbox, Radio } from "antd";
import _ from "lodash";
import { useEffect, useState } from "react";

const PlanFormTwo = ({
  data,
  studios,
  onComplete,
  onBack,
  isRequesting,
  modalKey,
}) => {
  const [form] = Form.useForm();
  const [hasExpirationDate, setHasExpirationDate] = useState(false);
  const studioIds = Form.useWatch("studioIds", form);
  const [purchaseAllStudios, setPurchaseAllStudios] = useState(false);
  const [reservableStudioType, setReservableStudioType] = useState(
    EEnumReservableStudioType.ALL.value
  );

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        form.setFieldsValue({
          isEnabledWithdraw: !data?.is_enabled_withdraw,
          isEnabledChangePlan: !data?.is_enabled_change_plan,
          isExpire: data?.is_expire,
          maxCcReservableNumByPlan: data?.max_cc_reservable_num_by_plan,
          maxReservableNumAtDayByPlan: data?.max_reservable_num_at_day_by_plan,
          reservableStudioType: data?.reservable_studio_type,
          studioIds: _.map(data?.studios, "id"),
          reservableStudioDetails: _.map(data?.reservable_studios, "id"),
        });
        if (data?.is_expire) {
          setTimeout(() => {
            form.setFieldValue("expireMonth", data?.expire_month);
          }, 200);
        }
        setHasExpirationDate(data?.is_expire);
        setReservableStudioType(data?.reservable_studio_type);
        setPurchaseAllStudios(data?.studios?.length === 0);
      }, 500);
    }
  }, [data]);

  useEffect(() => {
    form.resetFields();
    setHasExpirationDate(false);
  }, [modalKey]);

  useEffect(() => {
    if (studioIds?.length) {
      form.setFieldValue("purchaseAllStudios", false);
    }
  }, [studioIds]);

  useEffect(() => {
    if (hasExpirationDate) {
      form.setFieldValue("isEnabledWithdraw", false);
    }
  }, [hasExpirationDate]);

  useEffect(() => {
    if (reservableStudioType === EEnumReservableStudioType.ALL.value) {
      form.setFieldValue("reservableStudioType", reservableStudioType);
    }
    if (reservableStudioType === EEnumReservableStudioType.HOME.value) {
      form.setFieldValue("reservableStudioType", reservableStudioType);
    }
  }, [reservableStudioType]);

  const beforeComplete = (params) => {
    if (params.expireMonth) {
      params.expireMonth = parseNumberString(params.expireMonth);
    } else {
      params.expireMonth = 0;
    }
    if (purchaseAllStudios) {
      params.studioIds = [];
    }
    params.isEnabledWithdraw = !params.isEnabledWithdraw;
    params.isEnabledChangePlan = !params.isEnabledChangePlan;
    params.maxCcReservableNumByPlan = parseNumberString(
      params.maxCcReservableNumByPlan
    );
    params.maxReservableNumAtDayByPlan = parseNumberString(
      params.maxReservableNumAtDayByPlan
    );
    onComplete(params);
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="plan-form-two"
        onFinish={(params) => beforeComplete(params)}
        requiredMark={false}
        validateTrigger="onSubmit"
      >
        <Form.Item
          name="isEnabledWithdraw"
          label="プラン解約制限"
          initialValue={false}
          valuePropName="checked"
        >
          <Checkbox disabled={hasExpirationDate}>制限する</Checkbox>
        </Form.Item>

        <Form.Item
          name="isEnabledChangePlan"
          label="プラン変更制限"
          initialValue={false}
          valuePropName="checked"
        >
          <Checkbox>制限する</Checkbox>
        </Form.Item>

        <Form.Item
          name="isExpire"
          label="長期契約"
          rules={[
            {
              required: false,
            },
          ]}
          valuePropName="checked"
          initialValue={false}
          style={{ flex: 1 }}
        >
          <Checkbox onChange={(e) => setHasExpirationDate(e.target.checked)}>
            月数を入力する
          </Checkbox>
        </Form.Item>
        {hasExpirationDate && (
          <Form.Item
            name="expireMonth"
            rules={[
              {
                required: true,
                message: "月数を入力してください。",
              },
            ]}
            getValueFromEvent={(e) => {
              const value = e.target.value;
              const numberString = value.replace(/\D/g, "");
              return thousandSeparator(numberString);
            }}
            style={{ flex: 1 }}
          >
            <Input placeholder="月" style={{ width: 75 }} />
          </Form.Item>
        )}

        <Form.Item
          name="maxCcReservableNumByPlan"
          label="同時予約可能回数"
          rules={[
            {
              required: true,
              message: "同時予約可能回数を設定してください。",
            },
          ]}
          getValueFromEvent={(e) => {
            const value = e.target.value;
            const numberString = value.replace(/\D/g, "");
            return thousandSeparator(numberString);
          }}
        >
          <Input placeholder="" style={{ width: 75 }} />
        </Form.Item>

        <Form.Item
          name="maxReservableNumAtDayByPlan"
          label="1日同時予約可能回数"
          rules={[
            {
              required: true,
              message: "1日同時予約可能回数を設定してください。",
            },
          ]}
          getValueFromEvent={(e) => {
            const value = e.target.value;
            const numberString = value.replace(/\D/g, "");
            return thousandSeparator(numberString);
          }}
        >
          <Input placeholder="" style={{ width: 75 }} />
        </Form.Item>

        <div className="tw-flex tw-flex-col tw-gap-1">
          <label>登録可能店舗</label>
          <Form.Item style={{ marginBottom: 4 }}>
            <div className="tw-flex tw-flex-col tw-gap-1">
              <Radio
                checked={purchaseAllStudios}
                onChange={() => setPurchaseAllStudios(true)}
              >
                全店舗利用
              </Radio>
              <Radio
                checked={!purchaseAllStudios}
                onChange={() => setPurchaseAllStudios(false)}
              >
                指定の店舗のみ
              </Radio>
            </div>
          </Form.Item>
          {!purchaseAllStudios && (
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

        <div className="tw-flex tw-flex-col tw-gap-1 tw-mt-4">
          <label>予約可能店舗</label>
          <Form.Item
            name="reservableStudioType"
            rules={[
              {
                required: true,
                message: "Please input studio name",
              },
            ]}
            initialValue={EEnumReservableStudioType.ALL.value}
            style={{ marginBottom: 0 }}
          >
            <div className="tw-flex tw-flex-col tw-gap-1">
              <Radio
                checked={
                  reservableStudioType === EEnumReservableStudioType.ALL.value
                }
                onChange={() =>
                  setReservableStudioType(EEnumReservableStudioType.ALL.value)
                }
              >
                {EEnumReservableStudioType.ALL.label}
              </Radio>
              <Radio
                checked={
                  reservableStudioType === EEnumReservableStudioType.HOME.value
                }
                onChange={() =>
                  setReservableStudioType(EEnumReservableStudioType.HOME.value)
                }
              >
                {EEnumReservableStudioType.HOME.label}
              </Radio>
            </div>
          </Form.Item>
        </div>

        <Form.Item>
          <div className="tw-flex tw-justify-end tw-items-start tw-gap-2">
            <Button size="large" onClick={() => onBack()}>
              戻る
            </Button>
            <Button
              loading={isRequesting}
              type="primary"
              htmlType="submit"
              size="large"
            >
              保存
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default PlanFormTwo;
