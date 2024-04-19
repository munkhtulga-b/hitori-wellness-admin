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
import _ from "lodash";
import $api from "../_api";
import { useCalendarStore } from "../_store/calendar";
import dayjs from "dayjs";
import ActiveSlotModal from "../_components/calendar/modals/ActiveSlotModal";

const CalendarPage = () => {
  const setCalendarStore = useCalendarStore((state) => state.setBody);
  const [studios, setStudios] = useState(null);
  const [slotListMember, setSlotListMember] = useState(null);
  const [slotListStaff, setSlotListStaff] = useState(null);

  const [calendarType, setCalendarType] = useState("member");
  const [dateType, setDateType] = useState("week");

  const [isFetching, setIsFetching] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isActiveSlotModalOpen, setIsActiveSlotModalOpen] = useState(false);
  const [selectedSettingsOption, setSelectedSettingsOption] = useState(null);
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [selectedActiveSlot, setSelectedActiveSlot] = useState(null);

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
    const { isOk, data } = await $api.admin.staffSlot.getMany(queries);
    if (isOk) {
      setSlotListStaff(data);
    }
    setIsFetching(false);
  };

  const fetchMemberTimeSlots = async (studioId, queries) => {
    setIsFetching(true);
    const { isOk, data } = await $api.admin.reservation.getAllTimeSlots(
      studioId,
      queries
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

  const onStudioChange = (studioId) => {
    if (studioId) {
      const matched = _.find(studios, { id: studioId });
      setSelectedStudio(matched);
      setCalendarStore({
        studioId: studioId,
      });
      if (calendarType === "staff") {
        fetchStaffTimeSlots({
          studioId,
          startAt: dayjs(
            dateType === "day" ? selectedDay : selectedWeek.start
          ).format("YYYY-MM-DD"),
        });
      } else {
        fetchMemberTimeSlots(studioId, {
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

  return (
    <>
      <div className="tw-flex tw-flex-col">
        <PageHeader title={"カレンダー"} />
        <div className="tw-bg-bgTag tw-my-5 tw-h-[1px]"></div>
        <CalendarFilters
          studios={studios}
          selectedStudio={selectedStudio}
          calendarType={calendarType}
          setCalendarType={setCalendarType}
          dateType={dateType}
          setDateType={setDateType}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
          onStudioChange={(studioId) => {
            onStudioChange(studioId);
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
              onActiveSlotSelect={(data) => {
                setSelectedActiveSlot(data);
                setIsActiveSlotModalOpen(true);
              }}
            />
          ) : (
            <CalendarStaff
              isFetching={isFetching}
              slotList={slotListStaff}
              selectedStudio={selectedStudio}
              dateType={dateType}
              selectedDay={selectedDay}
              selectedWeek={selectedWeek}
              onActiveSlotSelect={(data) => {
                setSelectedActiveSlot(data);
                setIsActiveSlotModalOpen(true);
              }}
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
              <span>店舗設定</span>
            </div>
          </>
        }
        open={isSettingsModalOpen}
        footer={null}
        onCancel={() => setIsSettingsModalOpen(false)}
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
        <CalendarSettingsModal
          selectedSettingsOption={selectedSettingsOption}
          setSelectedSettingsOption={setSelectedSettingsOption}
          closeModal={() => setIsSettingsModalOpen(false)}
          fetchStudios={fetchStudios}
        />
      </Modal>
      <Modal
        title={`シフト管理`}
        open={isActiveSlotModalOpen}
        footer={null}
        onCancel={() => setIsActiveSlotModalOpen(false)}
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
        <ActiveSlotModal
          data={selectedActiveSlot}
          closeModal={() => setIsActiveSlotModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default CalendarPage;
