import { useCalendarStore } from "@/app/_store/calendar";
import { Select, Button, Radio } from "antd";
import Image from "next/image";
import dayjs from "dayjs";
import { useEffect } from "react";
import _ from "lodash";

const calendarRangeOptions = [
  {
    value: "week",
    label: "週",
  },
  {
    value: "day",
    label: "日",
  },
];

const CalendarFilters = ({
  studios,
  selectedStudio,
  calendarType,
  setCalendarType,
  dateType,
  setDateType,
  setIsSettingsModalOpen,
  onStudioChange,
  onDateChange,
  onDateReset,
  selectedDay,
  setSelectedDay,
  selectedWeek,
  setSelectedWeek,
}) => {
  const setCalendarStore = useCalendarStore((state) => state.setBody);
  const calendarDateLimit = dayjs().add(1, "month").endOf("month");

  useEffect(() => {
    if (dateType === "day") {
      if (dayjs(selectedWeek.start).isAfter(dayjs().startOf("week"))) {
        setSelectedDay(dayjs(selectedWeek.start));
      } else {
        setSelectedDay(dayjs());
      }
    }
  }, [dateType]);

  const handleDateChange = (type) => {
    if (dateType === "week") {
      setSelectedWeek({
        start: dayjs(selectedWeek.start)[type](1, "week"),
        end: dayjs(selectedWeek.end)[type](1, "week"),
      });
      onDateChange(
        dayjs(selectedWeek.start[type](1, "week")).format("YYYY-MM-DD")
      );
    }
    if (dateType === "day") {
      setSelectedDay(selectedDay[type](1, "day"));
      if (selectedDay[type](1, "day").isAfter(selectedWeek.end)) {
        setSelectedWeek({
          start: selectedWeek.start.add(1, "week"),
          end: selectedWeek.end.add(1, "week"),
        });
        onDateChange(
          dayjs(selectedWeek.start[type](1, "week")).format("YYYY-MM-DD")
        );
      }
    }
  };

  const handleDateReset = () => {
    if (dateType === "week") {
      onDateReset({
        start: dayjs().startOf("week").format("YYYY-MM-DD"),
        end: dayjs().endOf("week").format("YYYY-MM-DD"),
      });
    } else {
      onDateReset(dayjs());
    }
  };

  return (
    <>
      {studios && selectedStudio ? (
        <div className="tw-flex tw-flex-col tw-gap-6">
          <section className="tw-flex tw-justify-start tw-gap-2">
            <Select
              size="large"
              options={calendarRangeOptions}
              value={dateType}
              onChange={(value) => setDateType(value)}
              style={{ width: 80 }}
            />
            <Button size="large" style={{ width: 180, position: "relative" }}>
              {dateType === "week" && (
                <div className="tw-flex tw-justify-center tw-items-center tw-gap-4">
                  {dayjs().startOf("week").isBefore(selectedWeek.start) && (
                    <Image
                      src="/assets/calendar/arrow-left.svg"
                      alt="back"
                      width={0}
                      height={0}
                      style={{
                        height: "auto",
                        width: "auto",
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      onClick={() => handleDateChange("subtract")}
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
                      style={{
                        height: "auto",
                        width: "auto",
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      onClick={() => handleDateChange("add")}
                    />
                  )}
                </div>
              )}
              {dateType === "day" && (
                <div className="tw-flex tw-justify-center tw-items-center tw-gap-4">
                  {dayjs(selectedDay).isAfter(selectedWeek.start) && (
                    <Image
                      src="/assets/calendar/arrow-left.svg"
                      alt="back"
                      width={0}
                      height={0}
                      style={{
                        height: "auto",
                        width: "auto",
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      onClick={() => handleDateChange("subtract")}
                    />
                  )}
                  <span className="tw-leading-[22px] tw-tracking-[0.14px] tw-text-secondary">
                    {dayjs(selectedDay).format("MM/DD")}
                  </span>
                  {dayjs(selectedDay)
                    .add(1, "day")
                    .isBefore(calendarDateLimit) && (
                    <Image
                      src="/assets/calendar/arrow-right.svg"
                      alt="next"
                      width={0}
                      height={0}
                      style={{
                        height: "auto",
                        width: "auto",
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      onClick={() => handleDateChange("add")}
                    />
                  )}
                </div>
              )}
            </Button>
            <Button size="large" onClick={() => handleDateReset()}>
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
                options={_.map(studios, ({ id: value, name: label }) => ({
                  value,
                  label,
                }))}
                onChange={(value) => {
                  setCalendarStore({ studioId: value });
                  onStudioChange(_.find(studios, { id: value }));
                }}
                value={selectedStudio.id}
                style={{ width: 200 }}
              />
              <Button size="large" onClick={() => setIsSettingsModalOpen(true)}>
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
                <Radio.Button value="member">予約スケジュール</Radio.Button>
                <Radio.Button value="staff">シフトスケジュール</Radio.Button>
              </Radio.Group>
            </div>
          </section>
          <section className="tw-h-[1px] tw-bg-bgTag"></section>
        </div>
      ) : null}
    </>
  );
};

export default CalendarFilters;
