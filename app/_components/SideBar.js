import Menus from "@/app/_resources/sidebar-menu.json";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SideBar = ({ setCollapsed }) => {
  const router = useRouter();

  const handleMenuClick = ({ route }) => {
    router.push(route);
    setCollapsed(true);
  };

  return (
    <>
      <div className="tw-h-full tw-flex tw-flex-col relative">
        <section className="tw-h-[124px] tw-relative">
          <Image
            src="/assets/sidebar/close-icon.svg"
            alt="close"
            width={0}
            height={0}
            style={{
              cursor: "pointer",
              height: "auto",
              width: "auto",
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
            onClick={() => setCollapsed(true)}
          />
        </section>
        <section className="tw-grow tw-flex tw-flex-col tw-justify-between">
          <ul className="tw-flex tw-flex-col tw-gap-5">
            {Menus.main.map((menu) => {
              return (
                <li
                  key={menu.text}
                  className="tw-py-2 tw-px-4 tw-flex tw-justify-start tw-items-center tw-gap-4 tw-whitespace-nowrap tw-cursor-pointer hover:tw-bg-grayLight tw-transition-all tw-duration-200"
                  onClick={() => handleMenuClick(menu)}
                >
                  <Image
                    src={menu.icon}
                    alt={menu.alt}
                    width={0}
                    height={0}
                    style={{ height: "auto", width: "auto" }}
                  />
                  <span className="tw-grow tw-text-lg">{menu.text}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
};

export default SideBar;
