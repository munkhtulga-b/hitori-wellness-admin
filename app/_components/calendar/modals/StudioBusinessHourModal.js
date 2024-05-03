import $api from "@/app/_api";
import { useCalendarStore } from "@/app/_store/calendar";
import { Form, Button, TimePicker, Radio } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const StudioBusinessHourModal = ({ closeModal, fetchStudios }) => {
  const [form] = Form.useForm();
  const isTwentyFourHour = Form.useWatch("isTwentyFourHour", form);
  const calendarStore = useCalendarStore((state) => state.body);
  const [isLoading, setIsLoading] = useState(false);
  const [startHour, setStartHour] = useState("00:00");
  const [endHour, setEndHour] = useState("00:00");

  useEffect(() => {
    if (isTwentyFourHour) {
      form.setFieldsValue({
        startHour: dayjs().startOf("day"),
        endHour: dayjs().endOf("day").subtract(59, "minute"),
      });
      setStartHour(dayjs().startOf("day").format("HH:mm"));
      setEndHour(dayjs().endOf("day").subtract(59, "minute").format("HH:mm"));
    }
  }, [isTwentyFourHour]);

  const updateStudioBusinessHour = async (body) => {
    setIsLoading(true);
    const { isOk } = await $api.admin.studio.update(
      calendarStore.studioId,
      body
    );
    if (isOk) {
      await fetchStudios();
      form.resetFields();
      closeModal();
    }
    setIsLoading(false);
  };

  const beforeComplete = (params) => {
    const body = {
      timeperiodDetails: [
        {
          start_hour: dayjs(params.startHour).format("HH:mm"),
          end_hour: dayjs(params.endHour).format("HH:mm"),
          timeperiod: "FULLTIME",
        },
      ],
    };
    updateStudioBusinessHour(body);
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="studio-business-hours-form"
        onFinish={(params) => beforeComplete(params)}
        requiredMark={false}
        validateTrigger="onSubmit"
      >
        <div className="tw-flex tw-flex-col tw-gap-1">
          <span className="tw-leading-[22px] tw-tracking-[0.14px] tw-text-secondary">
            現在の設定
          </span>
          <span className="tw-text-lg tw-leading-[28px] tw-tracking-[0.16px]">{`${startHour} - ${endHour}`}</span>
        </div>

        <Form.Item
          name="startHour"
          label="開店時間"
          rules={[
            {
              type: "object",
              required: true,
              message: "開店時間を設定してください。",
            },
          ]}
        >
          <TimePicker
            format={"HH:mm"}
            minuteStep={30}
            needConfirm={false}
            showNow={false}
            className="tw-w-full"
            onChange={(time, timeString) => {
              setStartHour(timeString);
              form.setFieldValue("isTwentyFourHour", false);
            }}
          />
        </Form.Item>

        <Form.Item
          name="endHour"
          label="閉店時間"
          rules={[
            {
              type: "object",
              required: true,
              message: "閉店時間を設定してください。",
            },
          ]}
        >
          <TimePicker
            format={"HH:mm"}
            minuteStep={30}
            needConfirm={false}
            showNow={false}
            className="tw-w-full"
            onChange={(time, timeString) => {
              setEndHour(timeString);
              form.setFieldValue("isTwentyFourHour", false);
            }}
          />
        </Form.Item>

        <Form.Item
          name="isTwentyFourHour"
          rules={[
            {
              required: false,
              message: "Please input your E-mail!",
            },
          ]}
          valuePropName="checked"
        >
          <Radio checked={isTwentyFourHour}>24時間営業</Radio>
        </Form.Item>

        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <div className="tw-flex tw-justify-end tw-gap-2">
            <Button size="large" onClick={() => closeModal()}>
              キャンセル
            </Button>
            <Button
              loading={isLoading}
              type="primary"
              size="large"
              htmlType="submit"
              className="tw-w-[90px]"
            >
              送信
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default StudioBusinessHourModal;
