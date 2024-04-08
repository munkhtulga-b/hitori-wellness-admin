import Image from "next/image";

const AuthLayout = ({ children }) => {
  return (
    <>
      <main className="tw-min-h-screen tw-grid tw-place-items-center tw-relative">
        <div className="tw-fixed tw-top-0 tw-left-0 tw-right-0 tw-z-10 tw-bg-primary tw-h-[84px] tw-flex tw-justify-start tw-items-end tw-px-4 tw-py-3">
          <Image
            src="/assets/logo-white.png"
            alt="logo"
            width={188}
            height={0}
            style={{ height: "auto", width: "auto" }}
            priority
          />
        </div>
        <div className="tw-absolute tw-top-[184px] tw-left-1/2 tw-translate-x-[-50%]">
          <span className="tw-text-[24px] tw-font-bold tw-leading-[30px]">
            アドミン管理システム
          </span>
        </div>
        <div className="tw-max-w-[335px] tw-w-[335px]">{children}</div>
      </main>
    </>
  );
};

export default AuthLayout;
