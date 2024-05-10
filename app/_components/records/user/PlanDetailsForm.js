import { nullSafety } from "@/app/_utils/helpers";
import { Button, Form, Popconfirm } from "antd";
import { useState } from "react";

const PlanDetailsForm = ({ data }) => {
  const [form] = Form.useForm();
  const [isRequesting, setIsRequesting] = useState(false);

  const cancelMemberPlan = async () => {
    setIsRequesting(true);
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
        layout="vertical"
      >
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
            <div className="tw-flex tw-justify-between tw-items-center tw-gap-4">
              <span className="tw-leading-[22px] tw-tracking-[0.14px]">
                {nullSafety(
                  data?.t_member_plan?.length
                    ? data?.t_member_plan[0]?.plan?.name
                    : "-"
                )}
              </span>
              <Popconfirm
                title="Cancel plan"
                description="Are you sure to cancel?"
                onConfirm={() => cancelMemberPlan()}
                okText="はい"
                cancelText="いいえ"
              >
                <Button
                  loading={isRequesting}
                  disabled={data?.t_member_plan[0]?.end_date}
                  type="primary"
                  danger
                >
                  キャンセル
                </Button>
              </Popconfirm>
            </div>
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

        {/* <Form.Item>
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
        </Form.Item> */}
      </Form>
    </>
  );
};

export default PlanDetailsForm;
