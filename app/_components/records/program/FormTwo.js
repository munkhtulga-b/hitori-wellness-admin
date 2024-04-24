import { Form, Button, Radio, Select } from "antd";
import { useEffect, useState } from "react";
import _ from "lodash";

const ProgramFormTwo = ({
  onComplete,
  onBack,
  isRequesting,
  modalKey,
  plans,
  tickets,
}) => {
  const [form] = Form.useForm();
  const [isTrial, setIsTrial] = useState(false);
  const [sortedPlans, setSortedPlans] = useState(null);
  const [sortedTickets, setSortedTickets] = useState(null);

  useEffect(() => {
    if (plans) {
      const sorted = _.map(plans, ({ id: value, name: label }) => ({
        value,
        label,
      }));
      setSortedPlans(sorted);
    }
    if (tickets) {
      const sorted = _.map(tickets, ({ id: value, name: label }) => ({
        value,
        label,
      }));
      setSortedTickets(sorted);
    }
  }, [plans, tickets]);

  useEffect(() => {
    form.resetFields();
  }, [modalKey]);

  useEffect(() => {
    form.setFieldValue("isTrial", isTrial);
  }, [isTrial]);

  return (
    <>
      {/* TODO: MAKE RADIO BUTTON A CHECKBOX (ONCE CHECKED, ALL PLANS AND TICKETS) */}
      <Form
        layout="vertical"
        form={form}
        name="program-form-two"
        onFinish={(params) => onComplete(params)}
        requiredMark={false}
        validateTrigger="onSubmit"
      >
        <Form.Item
          name="noLimit"
          rules={[
            {
              required: true,
              message: "Please input studio name",
            },
          ]}
          valuePropName="checked"
        >
          <Radio checked={isTrial === false} onChange={() => setIsTrial(false)}>
            制限なし
          </Radio>
        </Form.Item>
        <Form.Item
          name="planReserveLimitDetails"
          label="プラン制限"
          rules={[
            {
              required: true,
              message: "プランを選択してください。",
            },
          ]}
        >
          <Select
            disabled={!sortedPlans}
            size="large"
            mode="multiple"
            style={{
              width: "100%",
            }}
            placeholder="select"
            options={sortedPlans}
          />
        </Form.Item>

        <Form.Item
          name="ticketReserveLimitDetails"
          label="チケット制限"
          rules={[
            {
              required: true,
              message: "チケットを選択してください。",
            },
          ]}
        >
          <Select
            disabled={!sortedTickets}
            size="large"
            mode="multiple"
            style={{
              width: "100%",
            }}
            placeholder="select"
            options={sortedTickets}
          />
        </Form.Item>

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
              保存
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default ProgramFormTwo;
