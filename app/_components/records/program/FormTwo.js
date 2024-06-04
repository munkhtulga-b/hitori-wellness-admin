import { Form, Button, Radio, Select } from "antd";
import { useEffect, useState } from "react";
import _ from "lodash";

const ProgramFormTwo = ({
  data,
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
    if (sortedPlans && sortedTickets && data) {
      const previousPlanDetails = _.map(data?.plan_reserve_limit, "id");
      const previousTicketDetails = _.map(data?.ticket_reserve_limit, "id");
      setTimeout(() => {
        form.setFieldsValue({
          planReserveLimitDetails: previousPlanDetails,
          ticketReserveLimitDetails: previousTicketDetails,
        });
      }, 500);
    }
  }, [sortedPlans, sortedTickets, data]);

  useEffect(() => {
    if (plans && tickets) {
      const sortedPlans = _.map(plans, ({ id: value, name: label }) => ({
        value,
        label,
      }));
      const sortedTickets = _.map(tickets, ({ id: value, name: label }) => ({
        value,
        label,
      }));
      setSortedPlans(sortedPlans);
      setSortedTickets(sortedTickets);
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
    if (params.noLimit) {
      params["isPlanReserveLimit"] = false;
      params["isTicketReserveLimit"] = false;
    } else {
      if (planReserveLimitDetails?.length) {
        params["isPlanReserveLimit"] = true;
      } else {
        params["isPlanReserveLimit"] = false;
      }
      if (ticketReserveLimitDetails?.length) {
        params["isTicketReserveLimit"] = true;
      } else {
        params["isTicketReserveLimit"] = false;
      }
    }
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
              required:
                noLimit || ticketReserveLimitDetails?.length ? false : true,
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
            placeholder="プランを選択"
            options={sortedPlans}
          />
        </Form.Item>

        <Form.Item
          name="ticketReserveLimitDetails"
          label="チケット制限"
          rules={[
            {
              required:
                noLimit || planReserveLimitDetails?.length ? false : true,
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
            placeholder="チケットを選択"
            options={sortedTickets}
          />
        </Form.Item>

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

export default ProgramFormTwo;
