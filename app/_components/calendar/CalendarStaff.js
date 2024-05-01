import dayjs from "dayjs";
import _ from "lodash";
import PartialLoading from "../PartialLoading";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import StaffTimeSlotForm from "./modals/StaffTimeSlotForm";
import $api from "@/app/_api";
import { toast } from "react-toastify";
import { useState } from "react";

const CalendarStaff = ({
  isFetching,
  slotList,
  selectedStudio,
  dateType,
  selectedDay,
  selectedWeek,
  fetchList,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const createSlot = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.staffSlot.create(body);
    if (isOk) {
      await fetchList({
        studioId: selectedStudio?.id,
        startAt: dayjs(selectedWeek.start).format("YYYY-MM-DD"),
      });
      setModalKey((prev) => prev + 1);
      setIsModalOpen(false);
      toast.success("Staff slot created");
    }
    setIsRequesting(false);
  };

  const updateSlot = async (body) => {
    setIsRequesting(true);
    const { isOk } = await $api.admin.staffSlot.update(selectedSlot.id, body);
    if (isOk) {
      await fetchList({
        studioId: selectedStudio?.id,
        startAt: dayjs(selectedWeek.start).format("YYYY-MM-DD"),
      });
      setModalKey((prev) => prev + 1);
      setIsModalOpen(false);
      toast.success("Staff slot updated");
    }
    setIsRequesting(false);
  };

  const deleteSlot = async () => {
    setIsDeleting(true);
    const { isOk } = await $api.admin.staffSlot.destroy(selectedSlot.id);
    if (isOk) {
      await fetchList({
        studioId: selectedStudio?.id,
        startAt: dayjs(selectedWeek.start).format("YYYY-MM-DD"),
      });
      setIsModalOpen(false);
      toast.success("Staff slot deleted");
    }
    setIsDeleting(false);
  };

  const generateHoursInDay = () => {
    const hours = [];
    const currentDay = dayjs();
    const startTime = selectedStudio.timeperiod_details[0].start_hour;
    const endTime = selectedStudio.timeperiod_details[0].end_hour;
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
      currentHour = currentHour.add(1, "hour");
    }
    return hours;
  };

  const generateCalendarSlots = (currentDay) => {
    const hours = [];
    const startTime = selectedStudio.timeperiod_details[0].start_hour;
    const endTime = selectedStudio.timeperiod_details[0].end_hour;
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
                    </div>
                  ))}
                </section>
                <section className="tw-grow tw-flex tw-justify-start xl:tw-grid xl:tw-grid-cols-7 xl:tw-auto-rows-auto">
                  {generateDaysInWeek().map(({ day, hours }, dayIndex) => (
                    <div
                      id={`week-day-${dayIndex}`}
                      key={dayjs(day).format("ddd")}
                      className={`tw-flex tw-flex-col tw-min-w-[200px] tw-max-w-[200px] xl:tw-min-w-[100%] xl:tw-max-w-[100%] ${
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
          onComplete={selectedSlot ? updateSlot : createSlot}
          deleteSlot={deleteSlot}
          isDeleting={isDeleting}
          isRequesting={isRequesting}
          modalKey={modalKey}
        />
      </Modal>
    </>
  );
};

export default CalendarStaff;
