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
  const [purchaseAllStudios, setPurchaseAllStudios] = useState(false);
  const [reservationAllStudios, setReservationAllStudios] = useState(false);
  const [reservationRegisteredStudios, setReservationRegisteredStudios] =
    useState(false);

  useEffect(() => {
    form.resetFields();
  }, [modalKey]);

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
          name="isCancellableByUser"
          label="メンバーサイトからのキャンセル制限"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
          valuePropName="checked"
        >
          <Checkbox />
        </Form.Item>

        <div className="tw-flex tw-justify-start tw-gap-2">
          <Form.Item
            name="hasExpirationDate"
            label="有効期限制限"
            rules={[
              {
                required: true,
                message: "Please input studio name",
              },
            ]}
            valuePropName="checked"
            style={{ flex: 1 }}
          >
            <Checkbox onChange={(e) => setHasExpirationDate(e.target.checked)}>
              期限内はキャンセル不可となります。
            </Checkbox>
          </Form.Item>
          {hasExpirationDate && (
            <Form.Item
              name="validMonths"
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
            style={{ marginBottom: 0 }}
          >
            <Radio
              checked={purchaseAllStudios}
              onChange={(e) => setPurchaseAllStudios(e.target.checked)}
            >
              全店舗利用
            </Radio>
          </Form.Item>
          <Form.Item
            name="monthlyItemId"
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
        </div>

        <div className="tw-flex tw-flex-col tw-gap-1">
          <label>利用可能店舗</label>
          <Form.Item
            name="reservationAllStudios"
            rules={[
              {
                required: true,
                message: "Please input studio name",
              },
            ]}
            valuePropName="checked"
            style={{ marginBottom: 0 }}
          >
            <Radio
              checked={reservationAllStudios}
              onChange={(e) => setReservationAllStudios(e.target.checked)}
            >
              全店舗利用
            </Radio>
          </Form.Item>
          <Form.Item
            name="reservationRegisteredStudios"
            rules={[
              {
                required: true,
                message: "Please input studio name",
              },
            ]}
            valuePropName="checked"
            style={{ marginBottom: 0 }}
          >
            <Radio
              checked={reservationRegisteredStudios}
              onChange={(e) =>
                setReservationRegisteredStudios(e.target.checked)
              }
            >
              登録店舗
            </Radio>
          </Form.Item>
          <Form.Item
            name="monthlyItemId"
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
