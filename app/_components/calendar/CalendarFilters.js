import { useCalendarStore } from "@/app/_store/calendar";
import { Select, Button, Radio } from "antd";
import Image from "next/image";

const calendarRangeOptions = [
  {
    value: "week",
    label: "週",
  },
  {
    value: "day",
    label: "月",
  },
];

const CalendarFilters = ({
  studios,
  calendarType,
  setCalendarType,
  dateType,
  setDateType,
  setIsModalOpen,
}) => {
  const setCalendarStore = useCalendarStore((state) => state.setBody);

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6">
        <section className="tw-flex tw-justify-start tw-gap-2">
          <Select
            size="large"
            options={calendarRangeOptions}
            value={dateType}
            onChange={(value) => setDateType(value)}
            style={{ width: 80 }}
          />
          <Button size="large">
            <div className="tw-flex tw-justify-center tw-items-center tw-gap-4">
              <Image
                src="/assets/calendar/arrow-left.svg"
                alt="back"
                width={0}
                height={0}
                style={{ height: "auto", width: "auto" }}
              />
              <span className="tw-leading-[22px] tw-tracking-[0.14px] tw-text-secondary">
                1/31-2/6
              </span>
              <Image
                src="/assets/calendar/arrow-right.svg"
                alt="next"
                width={0}
                height={0}
                style={{ height: "auto", width: "auto" }}
              />
            </div>
          </Button>
          <Button size="large">
            <div className="tw-flex tw-justify-center tw-items-center tw-gap-4">
              <span className="tw-leading-[22px] tw-tracking-[0.14px] tw-text-secondary">
                今日に戻る
              </span>
              <Image
                src="/assets/calendar/refresh-icon.svg"
                alt="refresh"
                width={0}
                height={0}
                style={{ height: "auto", width: "auto" }}
              />
            </div>
          </Button>
        </section>
        <section className="tw-h-[1px] tw-bg-bgTag"></section>
        <section className="tw-flex tw-justify-between tw-gap-2">
          <div className="tw-flex tw-justify-start tw-gap-2">
            <Select
              disabled={!studios}
              size="large"
              options={studios}
              onChange={(value) => setCalendarStore({ studioId: value })}
              style={{ width: 200 }}
            />
            <Button size="large" onClick={() => setIsModalOpen(true)}>
              <div className="tw-flex tw-justify-center tw-items-center tw-gap-2">
                <span className="tw-text-secondary tw-leading-[22px] tw-tracking-[0.14px]">
                  設定
                </span>
                <Image
                  src="/assets/calendar/settings-icon.svg"
                  alt="settings"
                  width={0}
                  height={0}
                  style={{ height: "auto", width: "auto" }}
                />
              </div>
            </Button>
          </div>
          <div>
            <Radio.Group
              size="large"
              onChange={(e) => setCalendarType(e.target.value)}
              value={calendarType}
            >
              <Radio.Button value="member">Member</Radio.Button>
              <Radio.Button value="staff">Staff</Radio.Button>
            </Radio.Group>
          </div>
        </section>
        <section className="tw-h-[1px] tw-bg-bgTag"></section>
      </div>
    </>
  );
};

export default CalendarFilters;
