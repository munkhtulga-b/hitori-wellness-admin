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

const CalendarPage = () => {
  const [studios, setStudios] = useState(null);

  const [calendarType, setCalendarType] = useState("member");
  const [dateType, setDateType] = useState("week");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSettingsOption, setSelectedSettingsOption] = useState(null);

  useEffect(() => {
    fetchStudios();
  }, []);

  const fetchStudios = async () => {
    const { isOk, data } = await $api.admin.studio.getMany();
    if (isOk) {
      const sorted = _.map(data, ({ id: value, name: label }) => ({
        value,
        label,
      }));
      setStudios(sorted);
    }
  };

  return (
    <>
      <div className="tw-flex tw-flex-col">
        <PageHeader title={"カレンダー"} />
        <div className="tw-bg-bgTag tw-my-5 tw-h-[1px]"></div>
        <CalendarFilters
          studios={studios}
          calendarType={calendarType}
          setCalendarType={setCalendarType}
          dateType={dateType}
          setDateType={setDateType}
          setIsModalOpen={setIsModalOpen}
        />
        <div className="tw-mt-6">
          {calendarType === "member" ? (
            <CalendarMember dateType={dateType} />
          ) : (
            <CalendarStaff dateType={dateType} />
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
        <CalendarSettingsModal
          selectedSettingsOption={selectedSettingsOption}
          setSelectedSettingsOption={setSelectedSettingsOption}
          closeModal={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default CalendarPage;
