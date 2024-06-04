import $api from "@/app/_api";
import EEnumMemberPlanStatus from "@/app/_enums/EEnumMemberPlanStatus";
import { nullSafety } from "@/app/_utils/helpers";
import { Button, Form, Popconfirm } from "antd";
import _ from "lodash";
import { useState } from "react";
import { toast } from "react-toastify";

const PlanDetailsForm = ({ data, closeModal, fetchData }) => {
  const [form] = Form.useForm();
  const [isRequesting, setIsRequesting] = useState(false);

  const cancelMemberPlan = async () => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.plan.cancel(data?.t_member_plan[0].id);
    if (isOk) {
      await fetchData();
      closeModal();
      toast.success("解約されました。");
    }
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
                  : "未登録"
              )}
            </span>
          </ListContainer>
        </Form.Item>

        <Form.Item label="プラン">
          <ListContainer>
            <div className="tw-flex tw-justify-between tw-items-center tw-gap-4">
              <span className="tw-leading-[22px] tw-tracking-[0.14px]">
                {data?.t_member_plan?.length ? (
                  <>
                    {nullSafety(
                      data?.t_member_plan?.length
                        ? data?.t_member_plan[0]?.plan?.name
                        : "-"
                    )}{" "}
                    {data?.t_member_plan?.length
                      ? `(${
                          _.find(EEnumMemberPlanStatus, {
                            value: data?.t_member_plan[0]?.status,
                          })?.label
                        })`
                      : null}
                  </>
                ) : (
                  <span className="tw-leading-[22px] tw-tracking-[0.14px]">
                    未加入
                  </span>
                )}
              </span>
              <Popconfirm
                title="注意事項"
                description={
                  <>
                    通知メールが送られます。
                    <br />
                    本当に解約しますか？
                  </>
                }
                onConfirm={() => cancelMemberPlan()}
                okText="はい"
                cancelText="いいえ"
              >
                <Button
                  loading={isRequesting}
                  disabled={
                    data?.t_member_plan[0]?.status !==
                    EEnumMemberPlanStatus.ACTIVE.value
                  }
                  type="primary"
                  danger
                >
                  解約
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
              <>未所持</>
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
