import { useCalendarStore } from "@/app/_store/calendar";
import { Select, Button, Radio } from "antd";
import Image from "next/image";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

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
  selectedStudioOption,
  onStudioChange,
}) => {
  const setCalendarStore = useCalendarStore((state) => state.setBody);
  const calendarDateLimit = dayjs().add(1, "month").endOf("month");
  const [selectedWeek, setSelectedWeek] = useState({
    start: dayjs().startOf("week"),
    end: dayjs().endOf("week"),
  });
  const [selectedDay, setSelectedDay] = useState(dayjs(selectedWeek.start));

  useEffect(() => {
    if (dateType === "day") {
      setSelectedDay(dayjs(selectedWeek.start));
    }
  }, [dateType]);

  const onDateChange = (type) => {
    if (dateType === "week") {
      setSelectedWeek({
        start: selectedWeek.start[type](1, "week"),
        end: selectedWeek.end[type](1, "week"),
      });
    }
    if (dateType === "day") {
      setSelectedDay(selectedDay[type](1, "day"));
    }
  };

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
            {dateType === "week" && (
              <div className="tw-flex tw-justify-center tw-items-center tw-gap-4">
                {dayjs().startOf("week").isBefore(selectedWeek.start) && (
                  <Image
                    src="/assets/calendar/arrow-left.svg"
                    alt="back"
                    width={0}
                    height={0}
                    style={{ height: "auto", width: "auto" }}
                    onClick={() => onDateChange("subtract")}
                  />
                )}
                <span className="tw-leading-[22px] tw-tracking-[0.14px] tw-text-secondary">
                  {`${dayjs(selectedWeek.start).format("MM/DD")} - ${dayjs(
                    selectedWeek.end
                  ).format("MM/DD")}`}
                </span>
                {dayjs(selectedWeek.start)
                  .add(1, "week")
                  .isBefore(calendarDateLimit) && (
                  <Image
                    src="/assets/calendar/arrow-right.svg"
                    alt="next"
                    width={0}
                    height={0}
                    style={{ height: "auto", width: "auto" }}
                    onClick={() => onDateChange("add")}
                  />
                )}
              </div>
            )}
            {dateType === "day" && (
              <div className="tw-flex tw-justify-center tw-items-center tw-gap-4">
                {/* TODO: DAILY RESTRICTION LOGIC */}
                {dayjs().startOf(selectedDay).isAfter(selectedWeek.start) && (
                  <Image
                    src="/assets/calendar/arrow-left.svg"
                    alt="back"
                    width={0}
                    height={0}
                    style={{ height: "auto", width: "auto" }}
                    onClick={() => onDateChange("subtract")}
                  />
                )}
                <span className="tw-leading-[22px] tw-tracking-[0.14px] tw-text-secondary">
                  {dayjs(selectedDay).format("MM/DD")}
                </span>
                {dayjs(selectedDay)
                  .add(1, "day")
                  .isBefore(selectedWeek.end) && (
                  <Image
                    src="/assets/calendar/arrow-right.svg"
                    alt="next"
                    width={0}
                    height={0}
                    style={{ height: "auto", width: "auto" }}
                    onClick={() => onDateChange("add")}
                  />
                )}
              </div>
            )}
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
              onChange={(value) => {
                setCalendarStore({ studioId: value });
                onStudioChange(value);
              }}
              value={selectedStudioOption}
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
