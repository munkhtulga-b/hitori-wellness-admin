"use client";

import { Form, Input, Button, TimePicker, Radio } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import TextEditor from "../../custom/TextEditor";
import _ from "lodash";

const StudioFormThree = ({
  data,
  onComplete,
  onBack,
  isRequesting,
  modalKey,
}) => {
  const [form] = Form.useForm();
  const isTwentyFourHour = Form.useWatch("isTwentyFourHour", form);
  const startHour = Form.useWatch("startHour", form);
  const endHour = Form.useWatch("endHour", form);
  const [businessHours, setBusinessHours] = useState("");

  useEffect(() => {
    form.resetFields();
  }, [modalKey]);

  useEffect(() => {
    if (data) {
      const timeDifference = dayjs(
        data?.timeperiod_details[0]?.end_hour,
        "HH:mm"
      ).diff(dayjs(data?.timeperiod_details[0]?.start_hour, "HH:mm"), "hour");
      form.setFieldsValue({
        startHour: dayjs(data?.timeperiod_details[0]?.start_hour, "HH:mm"),
        endHour: dayjs(data?.timeperiod_details[0]?.end_hour, "HH:mm"),
        gmapUrl: data?.gmap_url,
        isTwentyFourHour: timeDifference >= 24,
        businessHours: data?.business_hours,
      });
    }
  }, [data]);

  useEffect(() => {
    if (isTwentyFourHour) {
      form.setFieldValue("startHour", dayjs().hour(0).minute(0));
      form.setFieldValue("endHour", dayjs().hour(23).minute(59));
    }
  }, [isTwentyFourHour]);

  useEffect(() => {
    const minuteDiff = dayjs(endHour, "HH:mm").diff(
      dayjs(startHour, "HH:mm"),
      "minute"
    );
    if (minuteDiff >= 1430) {
      form.setFieldValue("isTwentyFourHour", true);
    } else {
      form.setFieldValue("isTwentyFourHour", false);
    }
  }, [startHour, endHour]);

  useEffect(() => {
    if (businessHours) {
      form.setFieldValue("businessHours", businessHours);
    }
  }, [businessHours]);

  const beforeComplete = (params) => {
    params.timeperiodDetails = [
      {
        start_hour: isTwentyFourHour
          ? "00:00"
          : dayjs(params.startHour).format("HH:mm"),
        end_hour: isTwentyFourHour
          ? "23:59"
          : dayjs(params.endHour).format("HH:mm"),
        timeperiod: "FULLTIME",
      },
    ];
    const body = _.omit(params, ["startHour", "endHour", "isTwentyFourHour"]);
    onComplete(body);
  };

  const disabledEndTime = () => {
    let result = [];
    if (startHour) {
      for (let i = 0; i < 24; i++) {
        if (i <= dayjs(startHour, "HH:mm").hour()) {
          result.push(i);
        }
      }
    }
    return result;
  };

  const disabledStartTime = () => {
    let result = [];
    if (endHour) {
      for (let i = 0; i < 24; i++) {
        if (i >= dayjs(endHour, "HH:mm").hour()) {
          result.push(i);
        }
      }
    }
    return result;
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="studio-form-three"
        onFinish={(params) => beforeComplete(params)}
        requiredMark={false}
        validateTrigger="onSubmit"
      >
        <section className="tw-flex tw-flex-col tw-gap-4">
          <div className="tw-flex tw-justify-start tw-gap-2">
            <Form.Item
              name="startHour"
              label="開店時間"
              rules={[
                {
                  required: true,
                  message: "開店時間を設定してください。",
                  type: "object",
                },
              ]}
              style={{ flex: 1 }}
            >
              <TimePicker
                format="HH:mm"
                showNow={false}
                minuteStep={30}
                disabledTime={() => ({
                  disabledHours: () => {
                    return disabledStartTime();
                  },
                })}
                className="tw-w-full"
              />
            </Form.Item>
            <Form.Item
              name="endHour"
              label="閉店時間"
              rules={[
                {
                  required: true,
                  message: "閉店時間を設定してください。",
                  type: "object",
                },
              ]}
              style={{ flex: 1 }}
            >
              <TimePicker
                format="HH:mm"
                showNow={false}
                minuteStep={30}
                disabledTime={() => ({
                  disabledHours: () => {
                    return disabledEndTime();
                  },
                })}
                className="tw-w-full"
              />
            </Form.Item>
          </div>
        </section>
        <Form.Item
          name="isTwentyFourHour"
          rules={[
            {
              required: false,
              message: "Please input prefecture",
            },
          ]}
          valuePropName="checked"
        >
          <Radio>24時間営業</Radio>
        </Form.Item>
        <Form.Item
          name="gmapUrl"
          label="Google map URL"
          rules={[
            {
              required: true,
              message: "Google Map URLを入力してください。",
            },
          ]}
        >
          <Input placeholder="URL" />
        </Form.Item>
        <Form.Item
          name="businessHours"
          label="店舗説明"
          rules={[
            {
              required: true,
              message: "店舗説明を入力してください。",
            },
          ]}
        >
          <TextEditor value={businessHours} onChange={setBusinessHours} />
        </Form.Item>
        <Form.Item>
          <div className="tw-flex tw-justify-end tw-items-start tw-gap-2 tw-mt-6">
            <Button size="large" onClick={() => onBack()}>
              戻る
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isRequesting}
            >
              保存
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default StudioFormThree;
