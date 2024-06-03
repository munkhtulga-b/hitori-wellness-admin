import { CheckCircleOutlined } from "@ant-design/icons";
import { isValidPassword } from "@/app/_utils/helpers";

const PasswordCretaria = ({ password }) => {
  return (
    <>
      <div className="tw-bg-grayLight tw-p-4 tw-rounded-xl tw-border tw-border-info">
        <ul className="tw-flex tw-flex-col">
          <li className="tw-text-sm tw-leading-[22px] tw-tracking-[0.14px]">
            以下の必須事項から最低二つを含んだ8文字以上のパスワードを入力ください：
          </li>
          <li className="tw-flex tw-justify-start tw-gap-2 tw-mt-2">
            <span className="tw-text-sm">半角英小文字</span>
            {isValidPassword(password)?.isContainingLowercase && (
              <CheckCircleOutlined style={{ fontSize: 16, color: "#57B65D" }} />
            )}
          </li>
          <li className="tw-flex tw-justify-start tw-gap-2">
            <span className="tw-text-sm">半角英大文字</span>
            {isValidPassword(password)?.isContainingUppercase && (
              <CheckCircleOutlined style={{ fontSize: 16, color: "#57B65D" }} />
            )}
          </li>
          <li className="tw-flex tw-justify-start tw-gap-2">
            <span className="tw-text-sm">数字</span>
            {isValidPassword(password)?.isContainingNumber && (
              <CheckCircleOutlined style={{ fontSize: 16, color: "#57B65D" }} />
            )}
          </li>
          <li className="tw-flex tw-justify-start tw-gap-2">
            <span className="tw-text-sm">記号</span>
            {isValidPassword(password)?.isContainingSymbol && (
              <CheckCircleOutlined style={{ fontSize: 16, color: "#57B65D" }} />
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default PasswordCretaria;
