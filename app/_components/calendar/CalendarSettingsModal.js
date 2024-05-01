import Image from "next/image";
import StaffTimeSlotForm from "./modals/StaffTimeSlotForm";
import StudioBusinessHourModal from "./modals/StudioBusinessHourModal";
import StudioShiftSlotModal from "./modals/StudioShiftSlotModal";

const SettingsOptionsList = [
  {
    label: "営業時間を設定する。",
    description: "07:00-23:00",
    icon: "settings-clock.svg",
    alt: "clock",
    value: 1,
  },
  {
    label: "一時閉店時間を設定する。",
    description: "2024-03-10（日） 01:00-02:00",
    icon: "settings-calendar.svg",
    alt: "calendar",
    value: 2,
  },
  {
    label: "スタッフのシフトを入れる。",
    description: null,
    icon: "settings-calendar.svg",
    alt: "calendar",
    value: 3,
  },
];

const CalendarSettingsModal = ({
  closeModal,
  selectedSettingsOption,
  setSelectedSettingsOption,
  fetchStudios,
  fetchList,
  selectedStudio,
  selectedWeek,
}) => {
  const SettingsOptions = () => {
    return (
      <>
        <ul className="tw-flex tw-flex-col tw-gap-4">
          {SettingsOptionsList.map((option) => (
            <li
              key={option.value}
              className="tw-bg-white tw-rounded-xl tw-p-4 tw-shadow tw-flex tw-justify-start tw-items-center tw-gap-2 tw-cursor-pointer hover:tw-ring hover:tw-ring-divider tw-transition-all tw-duration-200"
              onClick={() => setSelectedSettingsOption(option)}
            >
              <Image
                src={`/assets/calendar/${option.icon}`}
                alt={option.alt}
                width={0}
                height={0}
                style={{ height: "auto", width: "auto" }}
              />
              <section className="tw-grow tw-flex tw-flex-col tw-gap-1">
                <span className="tw-leading-[22px] tw-tracking-[0.14px]">
                  {option.label}
                </span>
                {option.description !== null && (
                  <span className="tw-text-secondary tw-text-sm tw-tracking-[0.12px]">
                    {option.description}
                  </span>
                )}
              </section>
              <Image
                src="/assets/calendar/arrow-right.svg"
                alt="arrow-right"
                width={0}
                height={0}
                style={{ height: "auto", width: "auto" }}
              />
            </li>
          ))}
        </ul>
      </>
    );
  };
  return (
    <>
      {!selectedSettingsOption ? (
        <SettingsOptions />
      ) : (
        <>
          {selectedSettingsOption.value === 1 ? (
            <>
              <StudioBusinessHourModal
                closeModal={closeModal}
                fetchStudios={fetchStudios}
              />
            </>
          ) : selectedSettingsOption.value === 2 ? (
            <>
              <StudioShiftSlotModal
                closeModal={closeModal}
                fetchList={fetchList}
                selectedStudio={selectedStudio}
                selectedWeek={selectedWeek}
              />
            </>
          ) : (
            <>
              <StaffTimeSlotForm
                closeModal={closeModal}
                fetchList={fetchList}
                selectedStudio={selectedStudio}
                selectedWeek={selectedWeek}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default CalendarSettingsModal;
