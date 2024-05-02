"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import PageHeader from "../_components/PageHeader";
import CalendarFilters from "../_components/calendar/CalendarFilters";
import CalendarMember from "../_components/calendar/CalendarMember";
import CalendarStaff from "../_components/calendar/CalendarStaff";
import CalendarSettingsModal from "../_components/calendar/CalendarSettingsModal";
import $api from "../_api";
import { useCalendarStore } from "../_store/calendar";
import dayjs from "dayjs";

const CalendarPage = () => {
  const setCalendarStore = useCalendarStore((state) => state.setBody);
  const [studios, setStudios] = useState(null);
  const [slotListMember, setSlotListMember] = useState(null);
  const [slotListStaff, setSlotListStaff] = useState(null);

  const [calendarType, setCalendarType] = useState("member");
  const [dateType, setDateType] = useState("week");

  const [isFetching, setIsFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSettingsOption, setSelectedSettingsOption] = useState(null);
  const [selectedStudio, setSelectedStudio] = useState(null);

  const [selectedWeek, setSelectedWeek] = useState({
    start: dayjs().startOf("week"),
    end: dayjs().endOf("week"),
  });
  const [selectedDay, setSelectedDay] = useState(dayjs(selectedWeek.start));

  useEffect(() => {
    fetchStudios();
  }, []);

  const fetchStaffTimeSlots = async (queries) => {
    setIsFetching(true);
    const { isOk, data } = await $api.admin.staffSlot.getMany(
      queries
        ? queries
        : {
            studioId: selectedStudio.id,
            startAt: dayjs(selectedWeek.start).format("YYYY-MM-DD"),
          }
    );
    if (isOk) {
      setSlotListStaff(data);
    }
    setIsFetching(false);
  };

  const fetchMemberTimeSlots = async (studioId, queries) => {
    setIsFetching(true);
    const { isOk, data } = await $api.admin.reservation.getAllTimeSlots(
      studioId ? studioId : selectedStudio.id,
      queries
        ? queries
        : { startAt: dayjs(selectedWeek.start).format("YYYY-MM-DD") }
    );
    if (isOk) {
      setSlotListMember(data);
    }
    setIsFetching(false);
  };

  const fetchStudios = async () => {
    const { isOk, data } = await $api.admin.studio.getMany();
    if (isOk) {
      setStudios(data);
      setSelectedStudio(data[0]);
      setCalendarStore({
        studioId: data[0].id,
      });
      fetchStaffTimeSlots({
        studioId: data[0].id,
        startAt: dayjs().startOf("week").format("YYYY-MM-DD"),
      });
      fetchMemberTimeSlots(data[0].id, {
        startAt: dayjs().startOf("week").format("YYYY-MM-DD"),
      });
    }
  };

  const onStudioChange = (studio) => {
    if (studio) {
      setSelectedStudio(studio);
      setCalendarStore({
        studioId: studio.id,
      });
      if (calendarType === "staff") {
        fetchStaffTimeSlots({
          studioId: studio.id,
          startAt: dayjs(
            dateType === "day" ? selectedDay : selectedWeek.start
          ).format("YYYY-MM-DD"),
        });
      } else {
        fetchMemberTimeSlots(studio.id, {
          startAt: dayjs(
            dateType === "day" ? selectedDay : selectedWeek.start
          ).format("YYYY-MM-DD"),
        });
      }
    }
  };

  const handleFetch = (queries) => {
    if (calendarType === "staff") {
      fetchStaffTimeSlots(queries);
    } else {
      fetchMemberTimeSlots(selectedStudio.id, queries);
    }
  };

  const onCalendarTypeChange = (type) => {
    setCalendarType(type);
    setSelectedWeek({
      start: dayjs().startOf("week"),
      end: dayjs().endOf("week"),
    });
    setDateType("week");
    if (type === "member") {
      fetchMemberTimeSlots(selectedStudio.id, {
        startAt: dayjs().startOf("week").format("YYYY-MM-DD"),
      });
    }
    if (type === "staff") {
      fetchStaffTimeSlots({
        studioId: selectedStudio.id,
        startAt: dayjs().startOf("week").format("YYYY-MM-DD"),
      });
    }
  };

  return (
    <>
      <div className="tw-flex tw-flex-col">
        <PageHeader title={"カレンダー"} />
        <div className="tw-bg-bgTag tw-my-5 tw-h-[1px]"></div>
        <CalendarFilters
          studios={studios}
          selectedStudio={selectedStudio}
          calendarType={calendarType}
          setCalendarType={(type) => onCalendarTypeChange(type)}
          dateType={dateType}
          setDateType={setDateType}
          setIsSettingsModalOpen={setIsModalOpen}
          onStudioChange={(studio) => {
            onStudioChange(studio);
          }}
          onDateChange={(value) => {
            handleFetch({
              startAt: value,
              studioId: selectedStudio.id,
            });
          }}
          onDateReset={(value) => {
            setSelectedWeek(value);
            handleFetch({
              studioId: selectedStudio.id,
              startAt: value.start,
            });
          }}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
        />
        <div className="tw-mt-6">
          {calendarType === "member" ? (
            <CalendarMember
              isFetching={isFetching}
              slotList={slotListMember}
              selectedStudio={selectedStudio}
              dateType={dateType}
              selectedDay={selectedDay}
              selectedWeek={selectedWeek}
              fetchList={fetchMemberTimeSlots}
            />
          ) : (
            <CalendarStaff
              isFetching={isFetching}
              slotList={slotListStaff}
              selectedStudio={selectedStudio}
              dateType={dateType}
              selectedDay={selectedDay}
              selectedWeek={selectedWeek}
              fetchList={fetchStaffTimeSlots}
            />
          )}
        </div>
      </div>

      <Modal
        title={
          <>
            <div className="tw-flex tw-justtify-start tw-items-center tw-gap-2">
              {selectedSettingsOption !== null && (
                <Image
                  src="/assets/calendar/arrow-left.svg"
                  alt="back"
                  width={0}
                  height={0}
                  style={{ height: "auto", width: "auto", cursor: "pointer" }}
                  onClick={() => setSelectedSettingsOption(null)}
                />
              )}
              <span>
                {!selectedSettingsOption
                  ? "店舗設定"
                  : `${selectedSettingsOption.label}`}
              </span>
            </div>
          </>
        }
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
        destroyOnClose
      >
        <CalendarSettingsModal
          selectedSettingsOption={selectedSettingsOption}
          setSelectedSettingsOption={setSelectedSettingsOption}
          closeModal={() => setIsModalOpen(false)}
          fetchStudios={fetchStudios}
          fetchList={
            calendarType === "member"
              ? fetchMemberTimeSlots
              : fetchStaffTimeSlots
          }
          selectedStudio={selectedStudio}
          selectedWeek={selectedWeek}
        />
      </Modal>
    </>
  );
};

export default CalendarPage;
