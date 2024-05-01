import { Button } from "antd";
import EEnumReservationStatus from "@/app/_enums/EEnumReservationStatus";
import { nullSafety } from "@/app/_utils/helpers";
import dayjs from "dayjs";

const columns = [
  {
    label: "予約日時",
    value: ["start_at", "end_at"],
    type: "date",
  },
  {
    label: "予約プログラム",
    value: "program_name",
    obj: "detailed",
    type: null,
  },
  {
    label: "予約店舗",
    value: "studio_name",
    obj: "detailed",
    type: null,
  },
  {
    label: "登録店舗",
    value: "studio_name",
    obj: "detailed",
    type: null,
  },
  {
    label: "ステータス",
    value: "reservation_status",
    obj: "detailed",
    type: "status",
  },
];

const ReservationSlotModal = ({ data, onCancel, isRequesting }) => {
  const formatData = (column) => {
    let result = "-";
    if (column.obj) {
      if (column.type === "status") {
        result =
          data[column.obj][column.value] === EEnumReservationStatus.ACTIVE.value
            ? "予約中"
            : data[column.obj][column.value] ===
              EEnumReservationStatus.CHECK_IN.value
            ? "チェックイン"
            : data[column.obj][column.value] ===
              EEnumReservationStatus.CHECK_OUT.value
            ? "チェックアウト"
            : "キャンセル済み";
      } else {
        result = data[column.obj][column.value];
      }
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
                {`${nullSafety(data.detailed?.member?.last_name)} ${nullSafety(
                  data.detailed?.member?.first_name
                )}`}
              </span>
              <span className="tw-leading-[26px] tw-tracking-[0.14px] tw-text-secondary">
                {nullSafety(data.detailed?.member?.mail_address)}
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
            <Button
              loading={isRequesting}
              type="primary"
              size="large"
              onClick={() => onCancel()}
            >
              キャンセルする
            </Button>
          </section>
        </div>
      ) : null}
    </>
  );
};

export default ReservationSlotModal;
