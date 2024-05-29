"use client";

import { isMobile } from "react-device-detect";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CloseCircleOutlined } from "@ant-design/icons";

const AuthLayout = ({ children }) => {
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  useEffect(() => {
    setShowMobileWarning(isMobile);
  }, []);

  return (
    <>
      <main className="tw-min-h-screen tw-grid tw-place-items-center tw-relative">
        <div className="tw-fixed tw-top-0 tw-left-0 tw-right-0 tw-z-10 tw-bg-primary tw-h-[84px] tw-flex tw-justify-start tw-items-end tw-px-4 tw-py-3">
          <Image
            src="/assets/logo-white.svg"
            alt="logo"
            width={0}
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
        <AnimatePresence>
          {showMobileWarning && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 0.2 }}
              className="tw-fixed tw-top-6 tw-left-6 tw-right-6 tw-z-[1000]"
            >
              <section
                onClick={() => setShowMobileWarning(false)}
                className="tw-bg-white tw-shadow tw-rounded-xl tw-p-4 tw-relative"
              >
                <span
                  onClick={() => setShowMobileWarning(false)}
                  className="tw-bg-white tw-absolute tw-top-[-4px] tw-right-[-4px] tw-rounded-full"
                >
                  <CloseCircleOutlined
                    style={{
                      fontSize: 20,
                    }}
                  />
                </span>
                <p className="tw-leading-[22px] tw-tracking-[0.14px] tw-text-support">
                  最適な環境で利用するにはパソコンでアクセスください。
                </p>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="tw-max-w-[335px] tw-w-[335px]">{children}</div>
      </main>
    </>
  );
};

export default AuthLayout;
