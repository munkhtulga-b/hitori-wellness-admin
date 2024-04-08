import Image from "next/image";
import { useWindowWidth } from "../_utils/custom-hooks";

const NavigationBar = ({ collapsed, setCollapsed }) => {
  const windowWidth = useWindowWidth();

  const isTogglerVisible = () => {
    let result = true;
    if (windowWidth < 1024 && !collapsed) {
      result = false;
    }
    return result;
  };
  return (
    <>
      <nav className="tw-h-[84px] tw-flex tw-justify-start tw-items-end tw-px-4 tw-py-[10px]">
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
          <li>
            <Image
              priority
              src="/assets/logo-white.png"
              alt="logo"
              width={188}
              height={0}
              style={{ height: "auto", width: "auto" }}
            />
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavigationBar;
