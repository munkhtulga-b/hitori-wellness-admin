"use client";

import NavigationBar from "@/app/_components/NavigationBar";
import { useEffect, useState, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Layout } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useUserStore } from "../_store/user";
import SideBar from "@/app/_components/SideBar";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowWidth } from "../_utils/custom-hooks";
import { useSidebarStore } from "../_store/siderbar";
import Cookies from "js-cookie";
import { isMobile } from "react-device-detect";

const { Header, Content, Sider } = Layout;

const AdminLayout = ({ children }) => {
  const pathName = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const windowWidth = useWindowWidth();
  const clearUser = useUserStore((state) => state.clearUser);
  const setSidebar = useSidebarStore((state) => state.setBody);
  const [isMounted, setIsMounted] = useState(false);

  const [showMobileWarning, setShowMobileWarning] = useState(false);

  useEffect(() => {
    if (windowWidth) {
      setShowMobileWarning(isMobile);
      setIsMounted(true);
    }
  }, [windowWidth]);

  useEffect(() => {
    setSidebar({
      isCollapsed: collapsed,
    });
  }, [collapsed]);

  const logOut = () => {
    Cookies.remove("session");
    clearUser();
    router.push("/auth/login");
  };

  return (
    <div className="tw-flex tw-flex-col">
      {isMounted ? (
        <Layout
          style={{
            minHeight: "100svh",
          }}
        >
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            collapsedWidth={0}
            breakpoint="lg"
            onBreakpoint={(value) => setCollapsed(!value)}
            trigger={null}
            width={275}
            style={{
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              zIndex: windowWidth < 1024 ? 10000 : 0,
              backgroundColor: "#FFF",
            }}
          >
            <SideBar setCollapsed={setCollapsed} />
          </Sider>
          <Layout>
            <Header
              style={{
                padding: 0,
                height: 84,
                position: "sticky",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 999,
              }}
            >
              <NavigationBar
                setCollapsed={setCollapsed}
                collapsed={collapsed}
                onLogOut={logOut}
              />
            </Header>
            <Content
              style={{
                padding: "24px",
                marginLeft: windowWidth < 1024 || collapsed ? 0 : 275,
                overflow: "visible",
                backgroundColor: "#EBEBEB",
                transitionProperty: "all",
                transitionDuration: "0.2s",
              }}
            >
              {!collapsed && windowWidth < 1024 && (
                <div
                  onClick={() => setCollapsed(true)}
                  className="tw-fixed tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-bg-black/20 tw-z-[9999]"
                ></div>
              )}
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
              <motion.div
                id="scrollable-container"
                key={pathName}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{ duration: 0.5 }}
                className="tw-p-6 tw-bg-white tw-rounded-[14px] tw-shadow tw-overflow-clip"
                style={{ minHeight: "70vh" }}
              >
                <Suspense fallback={<></>}>{children}</Suspense>
              </motion.div>
            </Content>
          </Layout>
        </Layout>
      ) : null}
    </div>
  );
};

export default AdminLayout;
