import { Form, Select, Button, DatePicker, TimePicker, Radio } from "antd";
import { useCalendarStore } from "@/app/_store/calendar";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import $api from "@/app/_api";
import _ from "lodash";
import { toast } from "react-toastify";

const StaffTimeSlotForm = ({
  data,
  closeModal,
  fetchList,
  selectedStudio,
  selectedWeek,
}) => {
  const [form] = Form.useForm();
  const calendarStore = useCalendarStore((state) => state.body);

  const [staff, setStaff] = useState(null);
  const [isRepeat, setIsRepeat] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        instructorId: data?.instructor?.id,
        date: dayjs.utc(data?.start_at),
        startHour: dayjs.utc(data?.start_at),
        endHour: dayjs.utc(data?.end_at),
        description: data?.description,
        isRepeat: data?.is_repeat,
      });
      if (data?.end_date) {
        form.setFieldValue("endDate", dayjs.utc(data?.end_date));
      }
      setIsRepeat(data?.is_repeat);
    }
  }, [data]);

  useEffect(() => {
    form.setFieldValue("isRepeat", isRepeat);
  }, [isRepeat]);

  const fetchStaff = async () => {
    const { isOk, data } = await $api.admin.staff.getMany({
      studioId: selectedStudio?.id,
    });
    if (isOk) {
      const sorted = _.map(data, ({ id: value, name: label }) => ({
        value,
        label,
      }));
      setStaff(sorted);
    }
  };

  const createSlot = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.staffSlot.create(body);
    if (isOk) {
      await fetchList({
        studioId: selectedStudio?.id,
        startAt: dayjs(selectedWeek.start).format("YYYY-MM-DD"),
      });
      resetForm();
      closeModal(false);
      toast.success("Staff slot created");
    }
    setIsRequesting(false);
  };

  const updateSlot = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.staffSlot.update(data.id, body);
    if (isOk) {
      await fetchList({
        studioId: selectedStudio?.id,
        startAt: dayjs(selectedWeek.start).format("YYYY-MM-DD"),
      });
      resetForm();
      closeModal(false);
      toast.success("Staff slot updated");
    }
    setIsRequesting(false);
  };

  const deleteSlot = async () => {
    setIsDeleting(true);
    const { isOk } = await $api.admin.staffSlot.destroy(data.id);
    if (isOk) {
      await fetchList({
        studioId: selectedStudio?.id,
        startAt: dayjs(selectedWeek.start).format("YYYY-MM-DD"),
      });
      closeModal();
      toast.success("Staff slot deleted");
    }
    setIsDeleting(false);
  };

  const beforeComplete = (params) => {
    const body = {
      studioId: calendarStore.studioId,
      instructorId: params.instructorId,
      startTime: `${dayjs(params.date).format("YYYY-MM-DD")} ${dayjs(
        params.startHour
      ).format("HH:mm")}`,
      endTime: `${dayjs(params.date).format("YYYY-MM-DD")} ${dayjs(
        params.endHour
      ).format("HH:mm")}`,
      isRepeat: params.isRepeat,
    };

    if (params.isRepeat === true) {
      body["endDate"] = dayjs(params.endDate).format("YYYY-MM-DD");
    }

    data ? updateSlot(body) : createSlot(body);
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
        name="create-staff-form"
        onFinish={(params) => beforeComplete(params)}
        requiredMark={false}
        validateTrigger="onSubmit"
      >
        <Form.Item
          name="instructorId"
          label="スタッフ名"
          rules={[
            {
              required: true,
              message: "Please select instructor",
            },
          ]}
        >
          <Select
            disabled={!staff}
            size="large"
            style={{
              width: "100%",
            }}
            placeholder="スタッフを選択"
            options={staff}
          />
        </Form.Item>
        <Form.Item
          name="date"
          label="指定の日程"
          rules={[
            {
              type: "object",
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <DatePicker
            format={"YYYY/MM/DD"}
            disabledDate={(current) =>
              current < dayjs().subtract(1, "day").endOf("day")
            }
            className="tw-w-full"
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

        {/* <Form.Item
          name="description"
          label="説明"
          rules={[
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input placeholder="清掃" />
        </Form.Item> */}

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
            label="指定の日程"
            rules={[
              {
                type: "object",
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <DatePicker
              format={"YYYY/MM/DD"}
              disabledDate={(current) =>
                current < dayjs().subtract(1, "day").endOf("day")
              }
              className="tw-w-full"
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
              onClick={() => deleteSlot()}
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

export default StaffTimeSlotForm;
