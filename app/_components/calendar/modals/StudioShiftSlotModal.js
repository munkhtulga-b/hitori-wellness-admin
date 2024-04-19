import $api from "@/app/_api";
import { useCalendarStore } from "@/app/_store/calendar";
import { Form, Button, TimePicker, DatePicker, Radio } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const StudioShiftSlotModal = ({ closeModal, fetchStudios }) => {
  const [form] = Form.useForm();
  const calendarStore = useCalendarStore((state) => state.body);
  const [isLoading, setIsLoading] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const createShiftSlot = async (body) => {
    setIsLoading(true);
    const { isOk } = await $api.admin.shiftSlot.create(body);
    if (isOk) {
      await fetchStudios();
      form.resetFields();
      closeModal();
    }
    setIsLoading(false);
  };

  const beforeComplete = (params) => {
    const body = {
      studioId: calendarStore.studioId,
      // "title": "Cleaning",
      startAt: `${dayjs(params.date).format("YYYY-MM-DD")} ${dayjs(
        params.startHour
      ).format("HH:mm")}`,
      endAt: `${dayjs(params.date).format("YYYY-MM-DD")} ${dayjs(
        params.endHour
      ).format("HH:mm")}`,
      isRepeat: params.isRepeat,
    };
    createShiftSlot(body);
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="create-staff-form"
        onFinish={(params) => beforeComplete(params)}
        requiredMark={false}
        validateTrigger="onSubmit"
      >
        {/* <div className="tw-flex tw-flex-col tw-gap-1">
          <span className="tw-leading-[22px] tw-tracking-[0.14px] tw-text-secondary">
            現在の設定
          </span>
          <span className="tw-text-lg tw-leading-[28px] tw-tracking-[0.16px]">{`${startHour} - ${endHour}`}</span>
        </div> */}

        <Form.Item
          name="date"
          label="開始時間"
          rules={[
            {
              type: "object",
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <DatePicker
            className="tw-w-full"
            format={"YYYY/MM/DD"}
            disabledDate={(current) =>
              current < dayjs().startOf("day").subtract(1, "day")
            }
          />
        </Form.Item>

        <Form.Item
          name="startHour"
          label="開始時間"
          rules={[
            {
              type: "object",
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <TimePicker
            format={"HH:mm"}
            minuteStep={30}
            needConfirm={false}
            showNow={false}
            className="tw-w-full"
          />
        </Form.Item>

        <Form.Item
          name="endHour"
          label="終了時間"
          rules={[
            {
              type: "object",
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <TimePicker
            format={"HH:mm"}
            minuteStep={30}
            needConfirm={false}
            showNow={false}
            className="tw-w-full"
          />
        </Form.Item>

        <Form.Item
          name="isRepeat"
          rules={[
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
          valuePropName="checked"
        >
          <div className="tw-flex tw-flex-col tw-gap-6">
            <Radio
              checked={isRepeat === false}
              onChange={() => setIsRepeat(false)}
            >
              繰り返さない
            </Radio>
            <Radio
              checked={isRepeat === true}
              onChange={() => setIsRepeat(true)}
            >
              繰り返す
            </Radio>
          </div>
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

export default StudioShiftSlotModal;
