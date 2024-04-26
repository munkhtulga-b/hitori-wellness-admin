import EEnumReservableStudioType from "@/app/_enums/EEnumReservableStudioType";
import { Form, Button, Select, Input, Checkbox, Radio } from "antd";
import { useEffect, useState } from "react";

const PlanFormTwo = ({
  studios,
  onComplete,
  onBack,
  isRequesting,
  modalKey,
}) => {
  const [form] = Form.useForm();
  const [hasExpirationDate, setHasExpirationDate] = useState(false);
  const studioIds = Form.useWatch("studioIds", form);
  const purchaseAllStudios = Form.useWatch("purchaseAllStudios", form);
  const [reservableStudioType, setReservableStudioType] = useState(
    EEnumReservableStudioType.ALL
  );
  const reservableStudioDetails = Form.useWatch(
    "reservableStudioDetails",
    form
  );

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
    if (reservableStudioDetails?.length) {
      form.setFieldValue(
        "reservableStudioType",
        EEnumReservableStudioType.PARTIAL
      );
      setReservableStudioType(EEnumReservableStudioType.PARTIAL);
    }
  }, [reservableStudioDetails]);

  useEffect(() => {
    if (
      reservableStudioType === EEnumReservableStudioType.ALL ||
      reservableStudioType === EEnumReservableStudioType.HOME
    ) {
      form.setFieldValue("reservableStudioDetails", []);
    }
  }, [reservableStudioType]);

  useEffect(() => {
    if (purchaseAllStudios) {
      form.setFieldValue("studioIds", []);
    }
  }, [purchaseAllStudios]);

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="plan-form-two"
        onFinish={(params) => onComplete(params)}
        requiredMark={false}
        validateTrigger="onSubmit"
      >
        <Form.Item
          name="isEnabledWithdraw"
          label="メンバーサイトからのキャンセル制限"
          rules={[
            {
              required: false,
              message: "Please input studio name",
            },
          ]}
          initialValue={false}
          valuePropName="checked"
        >
          <Checkbox />
        </Form.Item>

        <div className="tw-flex tw-justify-start tw-gap-2">
          <Form.Item
            name="isExpire"
            label="有効期限制限"
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
              期限内はキャンセル不可となります。
            </Checkbox>
          </Form.Item>
          {hasExpirationDate && (
            <Form.Item
              name="expireMonth"
              label="メンバーサイトからのキャンセル制限"
              rules={[
                {
                  required: true,
                  message: "Please input studio name",
                },
              ]}
              style={{ flex: 1 }}
            >
              <Input type="number" placeholder="" />
            </Form.Item>
          )}
        </div>

        <Form.Item
          name="maxCcReservableNumByPlan"
          label="1か月同時予約可能制限"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
        >
          <Input type="number" placeholder="" style={{ width: 75 }} />
        </Form.Item>

        <Form.Item
          name="maxReservableNumAtDayByPlan"
          label="1日同時予約可能制限"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
        >
          <Input type="number" placeholder="" style={{ width: 75 }} />
        </Form.Item>

        <div className="tw-flex tw-flex-col tw-gap-1">
          <label>所属可能店舗</label>
          <Form.Item
            name="purchaseAllStudios"
            rules={[
              {
                required: true,
                message: "Please input studio name",
              },
            ]}
            valuePropName="checked"
            initialValue={true}
            style={{ marginBottom: 0 }}
          >
            <Radio>全店舗利用</Radio>
          </Form.Item>
          <Form.Item
            name="studioIds"
            rules={[
              {
                required: purchaseAllStudios ? false : true,
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
        </div>

        <div className="tw-flex tw-flex-col tw-gap-1">
          <label>利用可能店舗</label>
          <Form.Item
            name="reservableStudioType"
            rules={[
              {
                required: true,
                message: "Please input studio name",
              },
            ]}
            initialValue={EEnumReservableStudioType.ALL}
            style={{ marginBottom: 0 }}
          >
            <div className="tw-flex tw-flex-col tw-gap-1">
              <Radio
                checked={reservableStudioType === EEnumReservableStudioType.ALL}
                onChange={() =>
                  setReservableStudioType(EEnumReservableStudioType.ALL)
                }
              >
                全店舗利用
              </Radio>
              <Radio
                checked={
                  reservableStudioType === EEnumReservableStudioType.HOME
                }
                onChange={() =>
                  setReservableStudioType(EEnumReservableStudioType.HOME)
                }
              >
                登録店舗
              </Radio>
            </div>
          </Form.Item>
          <Form.Item
            name="reservableStudioDetails"
            rules={[
              {
                required:
                  reservableStudioType === EEnumReservableStudioType.HOME ||
                  reservableStudioType === EEnumReservableStudioType.ALL
                    ? false
                    : true,
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
        </div>

        <Form.Item>
          <div className="tw-flex tw-justify-end tw-items-start tw-gap-2">
            <Button size="large" onClick={() => onBack()}>
              キャンセル
            </Button>
            <Button
              loading={isRequesting}
              type="primary"
              htmlType="submit"
              size="large"
            >
              次へ
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default PlanFormTwo;
