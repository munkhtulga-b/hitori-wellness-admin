const EEnumReservationStatus = {
  ACTIVE: {
    value: 2,
    label: "予約中",
  },
  CHECK_IN: {
    value: 3,
    label: "チェックイン",
  },
  CANCELLED: {
    value: 5,
    label: "キャンセル済み",
  },
  AUTOMATIC_CANCELLATION: {
    value: 6,
    label: "無断キャンセル",
  },
};

export default EEnumReservationStatus;
