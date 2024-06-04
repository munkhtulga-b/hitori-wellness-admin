import EEnumReservationStatus from "@/app/_enums/EEnumReservationStatus";
import dayjs from "dayjs";

const CalendarSlotCard = ({ item, itemIndex, hourIndex, handleSlotClick }) => {
  const getReservationDetails = (item) => {
    let result = "-";
    if (item.detailed?.member) {
      result = `${item.detailed.member.last_name} ${item.detailed.member.first_name}`;
    }
    if (item.detailed?.shift) {
      result = `${item.detailed.shift?.title}`;
    }
    return result;
  };

  const getSlotStyle = (item) => {
    let result = "";
    if (item.detailed?.shift) {
      result = "tw-bg-bgCancelled/30 tw-border-cancelled";
    } else {
      const status = item.detailed?.reservation_status;
      if (status === EEnumReservationStatus.ACTIVE.value) {
        result = "tw-bg-bgCalendarBlue tw-border-available";
      }
      if (status === EEnumReservationStatus.CHECK_IN.value) {
        result = "tw-bg-bgCalendarGreen tw-border-calendarGreen";
      }
    }
    return result;
  };

  return (
    <>
      <section
        key={itemIndex}
        className={`${getSlotStyle(
          item,
          hourIndex
        )} tw-p-2 tw-rounded-xl tw-border tw-overflow-hidden tw-cursor-pointer`}
        style={{
          flex: 1,
          height: `${
            (dayjs(item.end_at).diff(dayjs(item.start_at), "minute") / 60) * 52
          }px`,
        }}
        onClick={() => handleSlotClick(item)}
      >
        <span className="tw-text-sm tw-tracking-[0.12px] tw-whitespace-nowrap">
          {getReservationDetails(item)}
        </span>
      </section>
    </>
  );
};

export default CalendarSlotCard;
