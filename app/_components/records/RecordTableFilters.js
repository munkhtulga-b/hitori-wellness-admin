import { Input, Button, Modal } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const RecordTableFilters = ({
  children,
  onSearch,
  onSearchClear,
  onDelete,
  onAdd,
  isRequesting,
  checkedRows,
}) => {
  const [modal, contextHolder] = Modal.useModal();
  const showDeleteConfirm = () => {
    modal.confirm({
      title: "注意事項",
      content:
        "本当に消去しますか？消去すると紐づいている他の情報に影響を与える可能性がありますので、ご注意ください。",
      onOk() {
        onDelete();
      },
      cancelText: "戻る",
      okText: "削除する",
    });
  };

  return (
    <>
      {contextHolder}
      <section className="tw-flex tw-flex-col tw-items-end xl:tw-flex-row xl:tw-justify-between xl:tw-items-start tw-gap-10">
        <div className="tw-self-start tw-flex tw-justify-start tw-items-center tw-gap-3">
          <Input
            placeholder="検索"
            prefix={<SearchOutlined style={{ fontSize: "18px" }} />}
            style={{
              width: 300,
            }}
            allowClear
            onPressEnter={(e) => onSearch(e.target.value)}
            onChange={(e) => {
              if (!e.target.value.length) {
                onSearchClear();
              }
            }}
          />
          {children}
        </div>
        <div className="tw-flex tw-justify-start tw-gap-3">
          {onAdd !== null ? (
            <Button size="large" type="primary" onClick={() => onAdd()}>
              <div className="tw-flex tw-justify-start tw-items-center tw-gap-1">
                <PlusOutlined style={{ color: "white", fontSize: "18px" }} />
                <span>新規登録</span>
              </div>
            </Button>
          ) : null}
          {checkedRows ? (
            <Button
              disabled={!checkedRows?.length}
              loading={isRequesting}
              size="large"
              type="primary"
              danger
              onClick={() => showDeleteConfirm()}
            >
              {!isRequesting ? (
                <div className="tw-flex tw-justify-start tw-items-center tw-gap-1">
                  <DeleteOutlined
                    style={{
                      color: checkedRows?.length ? "white" : "#BABCC4",
                      fontSize: "18px",
                    }}
                  />
                  <span>削除</span>
                </div>
              ) : (
                <span>削除</span>
              )}
            </Button>
          ) : null}
        </div>
      </section>
    </>
  );
};

export default RecordTableFilters;
