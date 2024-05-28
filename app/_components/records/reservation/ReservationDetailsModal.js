import { Button, Popconfirm } from "antd";
import EEnumReservationStatus from "@/app/_enums/EEnumReservationStatus";
import { nullSafety } from "@/app/_utils/helpers";
import dayjs from "dayjs";
import $api from "@/app/_api";
import { toast } from "react-toastify";
import { useState } from "react";

const columns = [
  {
    label: "予約日時",
    value: ["start_at", "end_at"],
    type: "date",
  },
  {
    label: "予約プログラム",
    value: "name",
    obj: "m_program",
    type: null,
  },
  {
    label: "予約店舗",
    value: "name",
    obj: "m_studio",
    type: null,
  },
  {
    label: "登録店舗",
    value: "name",
    obj: "m_studio",
    type: null,
  },
  {
    label: "ステータス",
    value: "status",
    type: "status",
  },
];

const ReservationDetailsModal = ({ data, closeModal, fetchList }) => {
  const [isLoading, setIsLoading] = useState(false);

  const cancelReservation = async () => {
    setIsLoading(true);
    const { isOk } = await $api.admin.reservation.cancel(data.id);
    if (isOk) {
      await fetchList();
      closeModal();
      toast.success("キャンセルされました。");
    }
    setIsLoading(false);
  };

  const formatData = (column) => {
    let result = "-";
    if (column.obj) {
      result = data[column.obj]?.[column.value];
    } else {
      if (column.type === "date") {
        if (Array.isArray(column.value)) {
          result = `${dayjs
            .utc(data[column.value[0]])
            .format("YYYY-MM-DD")} (${dayjs
            .utc(data[column.value[0]])
            .format("ddd")}) - 
                ${dayjs.utc(data[column.value[0]]).format("HH:mm")} - ${dayjs
            .utc(data[column.value[1]])
            .format("HH:mm")}`;
        }
      }
      if (column.type === "status") {
        result =
          data[column.value] === EEnumReservationStatus.ACTIVE.value
            ? EEnumReservationStatus.ACTIVE.label
            : data[column.value] === EEnumReservationStatus.CHECK_IN.value
            ? EEnumReservationStatus.CHECK_IN.label
            : data[column.value] === EEnumReservationStatus.CHECK_OUT.value
            ? EEnumReservationStatus.CHECK_OUT.label
            : data[column.value] === EEnumReservationStatus.CANCELLED.value
            ? EEnumReservationStatus.CANCELLED.label
            : EEnumReservationStatus.AUTOMATIC_CANCELLATION.label;
      }
    }
    return result;
  };
  return (
    <>
      {data ? (
        <div className="tw-flex tw-flex-col tw-gap-10">
          <section className="tw-flex tw-justify-start tw-items-center tw-gap-3">
            <div className="tw-flex tw-flex-col tw-gap-1">
              <span className="tw-leading-[22px] tw-tracking-[0.14px]">
                {`${nullSafety(data?.member?.last_name)} ${nullSafety(
                  data?.member?.first_name
                )}`}
              </span>
              <span className="tw-leading-[26px] tw-tracking-[0.14px] tw-text-secondary">
                {nullSafety(data?.member?.mail_address)}
              </span>
            </div>
          </section>
          <section className="tw-flex tw-justify-start tw-gap-4">
            <ul className="tw-flex tw-flex-col tw-gap-6">
              {columns.map((column) => (
                <li key={column.label} className="tw-text-lg">
                  {column.label}
                </li>
              ))}
            </ul>
            <ul className="tw-grow tw-flex tw-flex-col tw-gap-6">
              {columns.map((column) => (
                <li key={column.label} className="tw-text-lg">
                  {formatData(column)}
                </li>
              ))}
            </ul>
          </section>
          <section className="tw-flex tw-justify-end">
            <Popconfirm
              title="注意事項"
              description={
                <>
                  通知メールが送られます。
                  <br />
                  本当にキャンセルしますか？
                </>
              }
              onConfirm={() => cancelReservation()}
              okText="はい"
              cancelText="いいえ"
            >
              <Button
                disabled={data?.status !== EEnumReservationStatus.ACTIVE.value}
                loading={isLoading}
                type="primary"
                size="large"
              >
                キャンセルする
              </Button>
            </Popconfirm>
          </section>
        </div>
      ) : null}
    </>
  );
};

export default ReservationDetailsModal;
