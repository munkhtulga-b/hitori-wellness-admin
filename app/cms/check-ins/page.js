import BaseTable from "@/app/_components/tables/BaseTable";

const columns = [
  {
    title: "ステータス",
    dataIndex: "changed_field",
    customStyle: "",
    type: null,
  },
  {
    title: "日時 ",
    dataIndex: "new_value",
    nestedDataIndex: "id",
    type: "nestedObjectItem",
  },
  {
    title: "メンバー",
    dataIndex: "action",
    customStyle: "",
    type: null,
  },
  {
    title: "店舗",
    dataIndex: "mail_address",
    customStyle: "",
    type: null,
  },
  {
    title: "デバイス",
    dataIndex: "updated_at",
    customStyle: "",
    type: "date",
  },
];

const CheckIns = () => {
  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-4">
        <BaseTable data={null} columns={columns} />
      </div>
    </>
  );
};

export default CheckIns;
