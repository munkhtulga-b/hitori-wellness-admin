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
  const noLimit = Form.useWatch("noLimit", form);
  const planReserveLimitDetails = Form.useWatch(
    "planReserveLimitDetails",
    form
  );
  const ticketReserveLimitDetails = Form.useWatch(
    "ticketReserveLimitDetails",
    form
  );
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
    if (planReserveLimitDetails?.length || ticketReserveLimitDetails?.length) {
      form.setFieldsValue({
        noLimit: false,
      });
    }
  }, [planReserveLimitDetails, ticketReserveLimitDetails]);

  useEffect(() => {
    if (noLimit) {
      form.setFieldsValue({
        planReserveLimitDetails: [],
        ticketReserveLimitDetails: [],
      });
    }
  }, [noLimit]);

  const beforeComplete = (params) => {
    delete params.noLimit;
    onComplete(params);
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="program-form-two"
        onFinish={(params) => beforeComplete(params)}
        requiredMark={false}
        validateTrigger="onSubmit"
      >
        <Form.Item
          name="noLimit"
          rules={[
            {
              required: false,
              message: "Please input studio name",
            },
          ]}
          valuePropName="checked"
          initialValue={true}
        >
          <Radio>制限なし</Radio>
        </Form.Item>
        <Form.Item
          name="planReserveLimitDetails"
          label="プラン制限"
          rules={[
            {
              required: noLimit ? false : true,
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
            placeholder=""
            options={sortedPlans}
          />
        </Form.Item>

        <Form.Item
          name="ticketReserveLimitDetails"
          label="チケット制限"
          rules={[
            {
              required: noLimit ? false : true,
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
            placeholder=""
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
