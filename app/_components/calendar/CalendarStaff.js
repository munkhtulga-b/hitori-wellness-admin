import dayjs from "dayjs";

const CalendarStaff = ({ dateType }) => {
  const fetchStaffTimeSlots = async () => {
    //TODO: fetch time slots
  };

  const generateHoursInDay = () => {
    const hours = [];
    let currentHour = dayjs().startOf("day");
    for (let i = 0; i < 24; i++) {
      hours.push(currentHour.format("HH:00"));
      currentHour = currentHour.add(1, "hour");
    }
    return hours;
  };

  const generateDaysInWeek = () => {
    const days = [];
    let currentDay = dayjs().startOf("week");
    for (let i = 0; i < 7; i++) {
      days.push(currentDay);
      currentDay = currentDay.add(1, "day");
    }
    return days;
  };

  return (
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
            <div key={hour} className={`tw-h-[52px] tw-w-full tw-relative`}>
              <span className="tw-absolute tw-left-0 tw-top-[-12px] tw-leading-[22px] tw-tracking-[0.14px]">
                {hour}
              </span>
            </div>
          ))}
        </section>
        {generateDaysInWeek().map((day) => (
          <section
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
            {generateHoursInDay().map((hour, hourIndex) => (
              <>
                <div
                  key={hour}
                  className={`tw-bg-white tw-h-[52px] tw-w-full ${
                    hourIndex === 0 ? "tw-border-y" : "tw-border-b"
                  } tw-border-divider`}
                ></div>
              </>
            ))}
          </section>
        ))}
      </div>
    </>
  );
};

export default CalendarStaff;
