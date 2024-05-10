import dayjs from "dayjs";
import _ from "lodash";
import PartialLoading from "../PartialLoading";
import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import ReservationSlotModal from "./modals/ReservationSlotModal";
import StudioShiftSlotModal from "./modals/StudioShiftSlotModal";
import CalendarSlotCard from "./CalendarSlotCard";
import BusinessHourIndicator from "../custom/BusinessHourIndicator";

const CalendarMember = ({
  isFetching,
  slotList,
  selectedStudio,
  dateType,
  selectedDay,
  selectedWeek,
  fetchList,
}) => {
  const [modalType, setModalType] = useState("member");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

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
    }, 100); // Check every 100 milliseconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

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
        isEndTime:
          dayjs(
            selectedStudio.timeperiod_details[0]?.end_hour,
            "HH:mm"
          ).hour() === dayjs(currentHour, "HH:mm").hour(),
        index: null,
      });
      currentHour = currentHour.add(1, "hour");
    }
    return hours;
  };

  const generateCalendarSlots = (currentDay) => {
    const hours = [];
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
              reserved.details.forEach((detail) => {
                matched.data.push(detail);
                matched.index = reservedIndex;
              });
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

  const handleSlotClick = (item) => {
    item.detailed?.member ? setModalType("member") : setModalType("shift");
    setSelectedSlot(item);
    setIsModalOpen(true);
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
                          indicatorWidth={businessHourIndicatorWidth}
                        />
                      )}
                      {hour.isEndTime && (
                        <BusinessHourIndicator
                          indicatorWidth={businessHourIndicatorWidth}
                        />
                      )}
                    </div>
                  ))}
                </section>
                <section
                  ref={calendarSlotContainerRef}
                  className="tw-grow tw-flex tw-justify-start xl:tw-grid xl:tw-grid-cols-7 xl:tw-auto-rows-auto"
                >
                  {generateDaysInWeek().map(({ day, hours }, dayIndex) => (
                    <div
                      id={`week-day-${dayIndex}`}
                      key={dayjs(day).format("ddd")}
                      className={`tw-flex tw-flex-col tw-min-w-[200px] tw-max-w-[200px] xl:tw-min-w-[100%] xl:tw-max-w-[100%] tw-overflow-hidden ${
                        dayIndex === 0 ? "tw-border-x" : "tw-border-r"
                      } tw-border-divider`}
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
                                  <CalendarSlotCard
                                    key={itemIndex}
                                    item={item}
                                    itemIndex={itemIndex}
                                    hourIndex={hourIndex}
                                    handleSlotClick={handleSlotClick}
                                  />
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
                          indicatorWidth={businessHourIndicatorWidth}
                        />
                      )}
                      {hour.isEndTime && (
                        <BusinessHourIndicator
                          indicatorWidth={businessHourIndicatorWidth}
                        />
                      )}
                    </div>
                  ))}
                </section>
                <section
                  className={`tw-flex tw-flex-col tw-w-full tw-overflow-hidden`}
                >
                  <div className="tw-flex tw-flex-col tw-items-center tw-gap-1 tw-mb-2">
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
                                <CalendarSlotCard
                                  key={itemIndex}
                                  item={item}
                                  itemIndex={itemIndex}
                                  hourIndex={hourIndex}
                                  handleSlotClick={handleSlotClick}
                                />
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
        title={modalType === "member" ? "予約詳細" : "一時閉店時間"}
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
        {modalType === "member" ? (
          <ReservationSlotModal
            data={selectedSlot}
            fetchList={fetchList}
            selectedStudio={selectedStudio}
            selectedWeek={selectedWeek}
            closeModal={() => setIsModalOpen(false)}
          />
        ) : (
          <StudioShiftSlotModal
            data={selectedSlot}
            closeModal={() => setIsModalOpen(false)}
            fetchList={fetchList}
            selectedStudio={selectedStudio}
            selectedWeek={selectedWeek}
          />
        )}
      </Modal>
    </>
  );
};

export default CalendarMember;
