import { Form, Input, Button, TimePicker, Radio } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const StudioFormThree = ({ onComplete, onBack, isRequesting, modalKey }) => {
  const [form] = Form.useForm();
  const [isTwentyFourHour, setIsTwentyFourHour] = useState(false);

  useEffect(() => {
    form.resetFields();
  }, [modalKey]);

  useEffect(() => {
    if (isTwentyFourHour) {
      form.setFieldValue("startHour", dayjs().hour(0).minute(0));
      form.setFieldValue("endHour", dayjs().hour(23).minute(59));
    }
  }, [isTwentyFourHour]);

  const beforeComplete = (params) => {
    params.timeperiodDetails = [
      {
        start_hour: isTwentyFourHour ? 0 : params.startHour,
        end_hour: isTwentyFourHour ? 24 : params.endHour,
        timeperiod: "FULLTIME",
      },
    ];
    delete params.startHour;
    delete params.endHour;
    onComplete(params);
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="form-three"
        onFinish={(params) => beforeComplete(params)}
        requiredMark={false}
        validateTrigger="onSubmit"
      >
        <section className="tw-flex tw-flex-col tw-gap-4">
          <div className="tw-leading-[22px] tw-tracking-[0.14px]">営業時間</div>
          <div className="tw-flex tw-justify-start tw-gap-2">
            <Form.Item
              name="startHour"
              label="開店時間"
              rules={[
                {
                  required: true,
                  message: "Please input prefecture",
                  type: "object",
                },
              ]}
              style={{ flex: 1 }}
            >
              <TimePicker format="HH:mm" className="tw-w-full" />
            </Form.Item>
            <Form.Item
              name="endHour"
              label="閉店時間"
              rules={[
                {
                  required: true,
                  message: "Please input prefecture",
                  type: "object",
                },
              ]}
              style={{ flex: 1 }}
            >
              <TimePicker format="HH:mm" className="tw-w-full" />
            </Form.Item>
          </div>
        </section>
        <Form.Item
          rules={[
            {
              required: false,
              message: "Please input prefecture",
            },
          ]}
        >
          <Radio
            onChange={(e) => setIsTwentyFourHour(e.target.checked)}
            checked={isTwentyFourHour}
          >
            24時間営業
          </Radio>
        </Form.Item>
        <Form.Item
          name="gmapUrl"
          label="Google map URL"
          rules={[
            {
              required: true,
              message: "Please input prefecture",
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
              message: "Please input prefecture",
            },
          ]}
        >
          <Input placeholder="Description" />
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
