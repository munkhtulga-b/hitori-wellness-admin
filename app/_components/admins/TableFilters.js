import { Input, Button, Select } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useAdminAccessStore } from "@/app/_store/admin-access";

const AdminTableFilters = ({
  onSearch,
  onDelete,
  onAdd,
  onLevelTypeChange,
  onStudioChange,
  onFilterClear,
  isRequesting,
  studios,
}) => {
  const getLevelTypes = useAdminAccessStore((state) => state.getAccess());
  return (
    <>
      <section className="tw-flex tw-justify-between tw-items-start">
        <div className="tw-flex tw-justify-start tw-items-center tw-gap-3">
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
                console.log("Empty");
              }
            }}
          />
          <Select
            allowClear
            disabled={!getLevelTypes}
            size="large"
            style={{
              width: 120,
            }}
            options={getLevelTypes}
            onChange={(value) =>
              value ? onLevelTypeChange(value) : onFilterClear("levelType")
            }
            placeholder="権限タイプ"
          />
          <Select
            allowClear
            disabled={!studios}
            size="large"
            style={{
              width: 200,
            }}
            options={studios}
            onChange={(value) =>
              value ? onStudioChange(value) : onFilterClear("studioId")
            }
            placeholder="店舗"
          />
        </div>
        <div className="tw-flex tw-justify-start tw-gap-3">
          <Button size="large" type="primary" onClick={() => onAdd()}>
            <div className="tw-flex tw-justify-start tw-items-center tw-gap-1">
              <PlusOutlined style={{ color: "white", fontSize: "18px" }} />
              <span>新規登録</span>
            </div>
          </Button>
          <Button
            loading={isRequesting}
            size="large"
            type="primary"
            danger
            onClick={() => onDelete()}
          >
            {!isRequesting ? (
              <div className="tw-flex tw-justify-start tw-items-center tw-gap-1">
                <DeleteOutlined style={{ color: "white", fontSize: "18px" }} />
                <span>削除</span>
              </div>
            ) : (
              <span>削除</span>
            )}
          </Button>
        </div>
      </section>
    </>
  );
};

export default AdminTableFilters;
