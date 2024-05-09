import { nullSafety } from "@/app/_utils/helpers";
import { Button, Form, Switch } from "antd";
import { useEffect, useState } from "react";

const PlanDetailsForm = ({ data, onBack, modalKey }) => {
  const [form] = Form.useForm();
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        form.setFieldsValue({});
      }, 500);
    }
  }, [data]);

  useEffect(() => {
    form.resetFields();
  }, [modalKey]);

  const cancelMemberPlan = async (params) => {
    setIsRequesting(true);
    console.log(params);
    setIsRequesting(false);
  };

  const ListContainer = ({ children }) => {
    return (
      <>
        <div className="tw-bg-bgForm tw-p-4 tw-rounded-xl tw-border tw-border-form">
          {children}
        </div>
      </>
    );
  };

  return (
    <>
      <Form
        requiredMark={false}
        form={form}
        name="change-plan-form"
        onFinish={(params) => cancelMemberPlan(params)}
        layout="vertical"
      >
        <Form.Item
          name="status"
          label="ステータス"
          rules={[
            {
              required: false,
            },
          ]}
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>

        <Form.Item label="登録店舗">
          <ListContainer>
            <span className="tw-leading-[22px] tw-tracking-[0.14px]">
              {nullSafety(
                data?.t_member_plan?.length
                  ? data?.t_member_plan[0]?.studio?.name
                  : "-"
              )}
            </span>
          </ListContainer>
        </Form.Item>

        <Form.Item label="プラン">
          <ListContainer>
            <span className="tw-leading-[22px] tw-tracking-[0.14px]">
              {nullSafety(
                data?.t_member_plan?.length
                  ? data?.t_member_plan[0]?.plan?.name
                  : "-"
              )}
            </span>
          </ListContainer>
        </Form.Item>

        <Form.Item label="チケット">
          <ListContainer>
            {data?.t_member_ticket?.length ? (
              <ul className="tw-flex tw-flex-col tw-gap-2">
                {data?.t_member_ticket?.map((ticket) => (
                  <li
                    key={ticket?.id}
                    className="tw-leading-[22px] tw-tracking-[0.14px]"
                  >
                    {nullSafety(`[${ticket?.ticket?.code}]`)}{" "}
                    {nullSafety(ticket?.ticket?.name)}
                  </li>
                ))}
              </ul>
            ) : (
              <>No tickets</>
            )}
          </ListContainer>
        </Form.Item>

        <Form.Item>
          <div className="tw-flex tw-justify-end tw-gap-2">
            <Button size="large" onClick={() => onBack()}>
              戻す
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

export default PlanDetailsForm;
