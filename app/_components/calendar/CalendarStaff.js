import $api from "@/app/_api";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import _ from "lodash";

const CalendarStaff = () => {
  const [slotList, setSlotList] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStaffTimeSlots();
  }, []);

  const fetchStaffTimeSlots = async () => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.staffSlot.getMany();
    if (isOk) {
      setSlotList(data);
    }
    setIsLoading(false);
  };

  const generateHoursInDay = (currentDay) => {
    const hours = [];
    let currentHour = dayjs().startOf("day");
    for (let i = 0; i < 24; i++) {
      hours.push({
        hour: currentHour.format("HH:00"),
        data: [],
        index: null,
      });
      currentHour = currentHour.add(1, "hour");
    }
    if (slotList?.length) {
      slotList.forEach((slot) => {
        if (slot.week_day === dayjs(currentDay).day()) {
          slot.reserved.forEach((reserved, reservedIndex) => {
            const matched = _.find(hours, { hour: reserved.start });
            if (matched) {
              matched.data.push(reserved);
              matched.index = reservedIndex;
            }
          });
        }
      });
    }
    return hours;
  };

  const generateDaysInWeek = () => {
    const days = [];
    let currentDay = dayjs().startOf("week");
    for (let i = 0; i < 7; i++) {
      days.push({
        day: currentDay,
        hours: generateHoursInDay(currentDay),
      });
      currentDay = currentDay.add(1, "day");
    }
    return days;
  };

  return (
    <>
      {!isLoading && slotList ? (
        <div className="tw-flex tw-justify-start tw-items-start">
          <section className="tw-flex tw-flex-col tw-min-w-[40px] tw-mr-2">
            <div className="tw-flex tw-flex-col tw-items-center tw-gap-1 tw-mb-2">
              <span className="tw-leading-[26px] tw-tracking-[0.14px] tw-text-transparent">
                *
              </span>
              <span className="tw-leading-[26px] tw-tracking-[0.14px] tw-text-transparent">
                *
              </span>
            </div>
            {generateHoursInDay().map((hour) => (
              <div
                key={hour.hour}
                className={`tw-h-[52px] tw-w-full tw-relative`}
              >
                <span className="tw-absolute tw-left-0 tw-top-[-12px] tw-leading-[22px] tw-tracking-[0.14px]">
                  {hour.hour}
                </span>
              </div>
            ))}
          </section>
          {generateDaysInWeek().map(({ day, hours }, dayIndex) => (
            <section
              id={`week-day-${dayIndex}`}
              key={dayjs(day).format("ddd")}
              className={`tw-flex tw-flex-col tw-min-w-[200px] tw-max-w-[200px] tw-overflow-hidden`}
            >
              <div className="tw-flex tw-flex-col tw-items-center tw-gap-1 tw-mb-2">
                <span className="tw-leading-[26px] tw-tracking-[0.14px]">
                  {dayjs(day).format("DD")}
                </span>
                <span className="tw-leading-[26px] tw-tracking-[0.14px]">
                  {dayjs(day).format("ddd")}
                </span>
              </div>
              {hours.map((hour, hourIndex) => (
                <div
                  id={`hour-${hour.hour}`}
                  key={hour.hour}
                  className={`tw-bg-white tw-h-[52px] tw-w-full ${
                    hourIndex === 0 ? "tw-border-y" : "tw-border-b"
                  } tw-border-divider tw-relative`}
                >
                  {hour.data?.length ? (
                    <>
                      <div className="tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-flex tw-justify-start">
                        {hour.data.map((item, itemIndex) => (
                          <section
                            key={itemIndex}
                            className={`tw-bg-bgCalendarBlue tw-p-2 tw-rounded-xl tw-border tw-border-available tw-overflow-hidden tw-cursor-pointer`}
                            style={{
                              flex: 1,
                              height: `${
                                (dayjs(item.end_at).diff(
                                  dayjs(item.start_at),
                                  "minute"
                                ) /
                                  60) *
                                52
                              }px`,
                            }}
                          >
                            <span className="tw-text-sm tw-tracking-[0.12px] tw-whitespace-nowrap">
                              {item.instructor?.name}
                            </span>
                          </section>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              ))}
            </section>
          ))}
        </div>
      ) : (
        <>Loading...</>
      )}
    </>
  );
};

export default CalendarStaff;
