import dayjs from "dayjs";
import _ from "lodash";
import PartialLoading from "../PartialLoading";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import StaffTimeSlotForm from "./modals/StaffTimeSlotForm";
import { useEffect, useRef, useState } from "react";
import BusinessHourIndicator from "../custom/BusinessHourIndicator";
import { useSidebarStore } from "@/app/_store/siderbar";

const CalendarStaff = ({
  isFetching,
  slotList,
  selectedStudio,
  dateType,
  selectedDay,
  selectedWeek,
  fetchList,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const sidebar = useSidebarStore((state) => state.body);

  const calendarSlotContainerRef = useRef(null);
  const [businessHourIndicatorWidth, setBusinessHourIndicatorWidth] =
    useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (calendarSlotContainerRef.current) {
        clearInterval(interval);
        // Element is not null, trigger your function here
        setBusinessHourIndicatorWidth(
          calendarSlotContainerRef.current.offsetWidth
        );
      }
    }, 300); // Check every 300 milliseconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [sidebar?.isCollapsed]);

  const generateHoursInDay = () => {
    const hours = [];
    const currentDay = dayjs();
    const startTime = "00:00";
    const endTime = "23:00";
    let currentHour = dayjs(
      `${currentDay.format("YYYY-MM-DD")} ${startTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const endHour = dayjs(
      dayjs(`${currentDay.format("YYYY-MM-DD")} ${endTime}`),
      "HH:mm"
    );
    while (
      dayjs(currentHour).isSame(endHour) ||
      dayjs(currentHour).isBefore(endHour)
    ) {
      hours.push({
        hour: currentHour.format("HH:mm"),
        isStartTime:
          dayjs(
            selectedStudio.timeperiod_details[0]?.start_hour,
            "HH:mm"
          ).hour() === dayjs(currentHour, "HH:mm").hour(),
        isStartHalf:
          selectedStudio.timeperiod_details[0]?.start_hour.split(":")[1] ===
          "30",
        isEndTime:
          dayjs(
            selectedStudio.timeperiod_details[0]?.end_hour,
            "HH:mm"
          ).hour() === dayjs(currentHour, "HH:mm").hour(),
        index: null,
        isEndHalf:
          selectedStudio.timeperiod_details[0]?.end_hour.split(":")[1] === "30",
      });
      currentHour = currentHour.add(1, "hour");
    }
    return hours;
  };

  const generateCalendarSlots = (currentDay) => {
    const hours = [];
    const startTime = "00:00";
    const endTime = "23:30";
    let currentHour = dayjs(
      `${currentDay.format("YYYY-MM-DD")} ${startTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const endHour = dayjs(
      dayjs(`${currentDay.format("YYYY-MM-DD")} ${endTime}`),
      "HH:mm"
    );
    while (
      dayjs(currentHour).isSame(endHour) ||
      dayjs(currentHour).isBefore(endHour)
    ) {
      hours.push({
        hour: currentHour.format("HH:mm"),
        data: [],
        index: null,
      });
      currentHour = currentHour.add(30, "minute");
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
    let currentDay = dayjs(selectedWeek.start);
    for (let i = 0; i < 7; i++) {
      days.push({
        day: currentDay,
        hours: generateCalendarSlots(currentDay),
      });
      currentDay = currentDay.add(1, "day");
    }
    return days;
  };

  return (
    <>
      {!isFetching && slotList && selectedStudio ? (
        <>
          {dateType === "week" ? (
            <>
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
                      {hour.isStartTime && (
                        <BusinessHourIndicator
                          isHalf={hour.isStartHalf}
                          indicatorWidth={businessHourIndicatorWidth}
                        />
                      )}
                      {hour.isEndTime && (
                        <BusinessHourIndicator
                          isHalf={hour.isEndHalf}
                          indicatorWidth={businessHourIndicatorWidth}
                        />
                      )}
                    </div>
                  ))}
                </section>
                <section
                  ref={calendarSlotContainerRef}
                  className="tw-grow tw-grid tw-grid-cols-7 tw-auto-rows-auto tw-overflow-clip"
                >
                  {generateDaysInWeek().map(({ day, hours }, dayIndex) => (
                    <div
                      id={`week-day-${dayIndex}`}
                      key={dayjs(day).format("ddd")}
                      className={`tw-flex tw-flex-col ${
                        dayIndex === 0 ? "tw-border-x" : "tw-border-r"
                      } tw-border-divider`}
                    >
                      <div className="tw-flex tw-flex-col tw-items-center tw-gap-1 tw-mb-2 tw-sticky tw-top-[84px] tw-z-[99] tw-bg-white">
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
                          className={`tw-bg-white tw-h-[26px] tw-w-full ${
                            hourIndex === 0 ? "tw-border-t" : "tw-border-b"
                          } ${
                            hour.hour.split(":")[1] === "30" || hourIndex === 0
                              ? "tw-border-divider"
                              : "tw-border-transparent"
                          } tw-relative`}
                        >
                          {hour.data?.length ? (
                            <>
                              <div
                                className="tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-flex tw-justify-start"
                                style={{ zIndex: 10 + hour.index }}
                              >
                                {hour.data.map((item, itemIndex) => (
                                  <section
                                    key={itemIndex}
                                    className={`${
                                      hourIndex % 2 === 0
                                        ? "tw-bg-bgCalendarBlue"
                                        : "tw-bg-bgCalendarGreen"
                                    } tw-p-2 tw-rounded-xl tw-border tw-border-available tw-overflow-x-hidden tw-cursor-pointer`}
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
                                    onClick={() => {
                                      setSelectedSlot(item);
                                      setIsModalOpen(true);
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
                    </div>
                  ))}
                </section>
              </div>
            </>
          ) : (
            <>
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
                      {hour.isStartTime && (
                        <BusinessHourIndicator
                          isHalf={hour.isStartHalf}
                          indicatorWidth={businessHourIndicatorWidth}
                        />
                      )}
                      {hour.isEndTime && (
                        <BusinessHourIndicator
                          isHalf={hour.isEndHalf}
                          indicatorWidth={businessHourIndicatorWidth}
                        />
                      )}
                    </div>
                  ))}
                </section>
                <section
                  className={`tw-flex tw-flex-col tw-w-full tw-overflow-clip`}
                >
                  <div className="tw-flex tw-flex-col tw-items-center tw-gap-1 tw-mb-2 tw-sticky tw-top-[84px] tw-z-[99] tw-bg-white">
                    <span className="tw-leading-[26px] tw-tracking-[0.14px]">
                      {dayjs(
                        generateDaysInWeek()[dayjs(selectedDay).day()].day
                      ).format("DD")}
                    </span>
                    <span className="tw-leading-[26px] tw-tracking-[0.14px]">
                      {dayjs(
                        generateDaysInWeek()[dayjs(selectedDay).day()].day
                      ).format("ddd")}
                    </span>
                  </div>
                  {generateDaysInWeek()[dayjs(selectedDay).day()].hours.map(
                    (hour, hourIndex) => (
                      <div
                        id={`hour-${hour.hour}`}
                        key={hour.hour}
                        className={`tw-bg-white tw-h-[26px] tw-w-full ${
                          hourIndex === 0 ? "tw-border-t" : "tw-border-b"
                        } ${
                          hour.hour.split(":")[1] === "30" || hourIndex === 0
                            ? "tw-border-divider"
                            : "tw-border-transparent"
                        } tw-relative`}
                      >
                        {hour.data?.length ? (
                          <>
                            <div
                              className="tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-flex tw-justify-start"
                              style={{ zIndex: 10 + hour.index }}
                            >
                              {hour.data.map((item, itemIndex) => (
                                <section
                                  key={itemIndex}
                                  className={`${
                                    hourIndex % 2 === 0
                                      ? "tw-bg-bgCalendarBlue"
                                      : "tw-bg-bgCalendarGreen"
                                  } tw-p-2 tw-rounded-xl tw-border tw-border-available tw-overflow-x-hidden tw-cursor-pointer`}
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
                                  onClick={() => {
                                    setSelectedSlot(item);
                                    setIsModalOpen(true);
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
                    )
                  )}
                </section>
              </div>
            </>
          )}
        </>
      ) : (
        <PartialLoading />
      )}

      <Modal
        title={`シフト管理`}
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        styles={{
          header: {
            marginBottom: 24,
          },
          content: {
            padding: 40,
          },
        }}
        closeIcon={<CloseOutlined style={{ fontSize: 24 }} />}
      >
        <StaffTimeSlotForm
          data={selectedSlot}
          closeModal={() => setIsModalOpen(false)}
          fetchList={fetchList}
          selectedStudio={selectedStudio}
          selectedWeek={selectedWeek}
        />
      </Modal>
    </>
  );
};

export default CalendarStaff;
