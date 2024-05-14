import Image from "next/image";
import { useWindowWidth } from "../_utils/custom-hooks";
import { useRouter } from "next/navigation";
import {
  DownOutlined,
  LoadingOutlined,
  UnlockOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { Dropdown, Spin } from "antd";
import { useUserStore } from "../_store/user";
import { useState } from "react";

const NavigationBar = ({ collapsed, setCollapsed, onLogOut }) => {
  const router = useRouter();
  const windowWidth = useWindowWidth();

  const user = useUserStore((state) => state.getUser());
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const items = [
    {
      label: (
        <div
          className="tw-flex tw-justify-start tw-items-center tw-gap-2"
          onClick={() => router.push("/cms/password")}
        >
          <UnlockOutlined style={{ fontSize: 16 }} />
          <span>パスワードを変更する</span>
        </div>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: (
        <div
          className="tw-flex tw-justify-start tw-items-center tw-gap-2"
          onClick={() => {
            setIsLoggingOut(true);
            setTimeout(() => {
              onLogOut();
            }, 1500);
          }}
        >
          <PoweroffOutlined style={{ fontSize: 16 }} />
          <span>ログアウト</span>
        </div>
      ),
      key: "1",
    },
  ];

  const isTogglerVisible = () => {
    let result = true;
    if (windowWidth < 1024 && !collapsed) {
      result = false;
    }
    return result;
  };
  return (
    <>
      <nav className="tw-h-[84px] tw-flex tw-justify-between tw-items-end tw-px-4 tw-py-[10px]">
        <ul className="tw-flex tw-justify-start tw-items-center tw-gap-4">
          {isTogglerVisible() && (
            <li onClick={() => setCollapsed(!collapsed)}>
              <Image
                src="/assets/sidebar-toggler.svg"
                alt="menu"
                width={0}
                height={0}
                style={{ height: "auto", width: "auto", cursor: "pointer" }}
              />
            </li>
          )}
          <li onClick={() => router.push("/cms")} className="tw-cursor-pointer">
            <Image
              priority
              src="/assets/logo-white.svg"
              alt="logo"
              width={0}
              height={0}
              style={{ height: "auto", width: "auto" }}
            />
          </li>
        </ul>
        <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
          className="tw-self-center"
        >
          <div className="tw-cursor-pointer tw-flex tw-justify-start tw-items-center tw-gap-2">
            <span className="tw-leading-[22px] tw-tracking-[0.14px] tw-underline tw-underline-offset-4">
              {user?.mail_address ?? "-"}
            </span>
            <DownOutlined style={{ fontSize: 12 }} />
          </div>
        </Dropdown>
        {isLoggingOut && (
          <Spin
            fullscreen
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 40,
                }}
                spin
              />
            }
          />
        )}
      </nav>
    </>
  );
};

export default NavigationBar;
