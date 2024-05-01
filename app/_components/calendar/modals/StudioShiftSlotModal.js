import $api from "@/app/_api";
import { useCalendarStore } from "@/app/_store/calendar";
import { Form, Button, TimePicker, DatePicker, Radio, Input } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const StudioShiftSlotModal = ({
  data,
  closeModal,
  fetchList,
  selectedStudio,
  selectedWeek,
}) => {
  const [form] = Form.useForm();
  const calendarStore = useCalendarStore((state) => state.body);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        form.setFieldsValue({
          title: data.detailed?.shift?.title,
          date: dayjs.utc(data.detailed?.shift?.start_at),
          startHour: dayjs.utc(data.detailed?.shift?.start_at),
          endHour: dayjs.utc(data.detailed?.shift?.end_at),
          isRepeat: data.detailed?.shift?.is_repeat,
        });
        if (data?.detailed?.shift?.end_date) {
          form.setFieldValue(
            "endDate",
            dayjs.utc(data.detailed?.shift?.end_date)
          );
        }
        setIsRepeat(data.detailed?.shift?.is_repeat);
      }, 500);
    }
  }, [data]);

  useEffect(() => {
    form.setFieldValue("isRepeat", isRepeat);
  }, [isRepeat]);

  const createShiftSlot = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.shiftSlot.create(body);
    if (isOk) {
      await fetchList(selectedStudio?.id, {
        startAt: dayjs(selectedWeek.start).format("YYYY-MM-DD"),
      });
      resetForm();
      closeModal();
      toast.success("Shift slot created");
    }
    setIsRequesting(false);
  };

  const updateShiftSlot = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.shiftSlot.update(
      data.detailed?.shift.id,
      body
    );
    if (isOk) {
      await fetchList(selectedStudio?.id, {
        startAt: dayjs(selectedWeek.start).format("YYYY-MM-DD"),
      });
      resetForm();
      closeModal();
      toast.success("Shift slot created");
    }
    setIsRequesting(false);
  };

  const deleteShiftSlot = async () => {
    setIsDeleting(true);
    const { isOk } = await $api.admin.shiftSlot.destroy(
      data.detailed?.shift.id
    );
    if (isOk) {
      await fetchList(selectedStudio?.id, {
        startAt: dayjs(selectedWeek.start).format("YYYY-MM-DD"),
      });
      closeModal();
      toast.success("Shift slot deleted");
    }
    setIsDeleting(false);
  };

  const beforeComplete = (params) => {
    const body = {
      studioId: calendarStore.studioId,
      title: params.title,
      startAt: `${dayjs(params.date).format("YYYY-MM-DD")} ${dayjs(
        params.startHour
      ).format("HH:mm")}`,
      endAt: `${dayjs(params.date).format("YYYY-MM-DD")} ${dayjs(
        params.endHour
      ).format("HH:mm")}`,
      isRepeat: params.isRepeat,
    };

    if (params.isRepeat === true) {
      body["endDate"] = dayjs(params.endDate).format("YYYY-MM-DD");
    }

    data ? updateShiftSlot(body) : createShiftSlot(body);
  };

  const resetForm = () => {
    form.resetFields();
    setIsRepeat(false);
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="shift-slot-form"
        onFinish={(params) => beforeComplete(params)}
        requiredMark={false}
        validateTrigger="onSubmit"
      >
        <Form.Item
          name="title"
          label="説明"
          rules={[
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input placeholder="説明" />
        </Form.Item>

        {/* <div className="tw-flex tw-flex-col tw-gap-1">
          <span className="tw-leading-[22px] tw-tracking-[0.14px] tw-text-secondary">
            現在の設定
          </span>
          <span className="tw-text-lg tw-leading-[28px] tw-tracking-[0.16px]">{`${startHour} - ${endHour}`}</span>
        </div> */}

        <Form.Item
          name="date"
          label="日程"
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
              毎週繰り返す
            </Radio>
          </div>
        </Form.Item>

        {isRepeat === true && (
          <Form.Item
            name="endDate"
            label="日程"
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
        )}

        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <div className="tw-flex tw-justify-end tw-gap-2">
            <Button
              disabled={!data}
              loading={isDeleting}
              type="primary"
              danger
              size="large"
              onClick={() => deleteShiftSlot()}
            >
              削除
            </Button>
            <Button
              loading={isRequesting}
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
