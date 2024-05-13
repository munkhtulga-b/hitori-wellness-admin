"use client";

import Cookies from "js-cookie";
import NavigationBar from "@/app/_components/NavigationBar";
import { useLayoutEffect, useEffect, useState, Suspense } from "react";
import { usePathname, redirect, useRouter } from "next/navigation";
import { Layout } from "antd";
import { useUserStore } from "../_store/user";
import SideBar from "@/app/_components/SideBar";
import { motion } from "framer-motion";
import { useWindowWidth } from "../_utils/custom-hooks";
import { useAdminAccessStore } from "../_store/admin-access";

const { Header, Content, Sider } = Layout;

const handleScroll = (e) => {
  if (e.ctrlKey) {
    e.preventDefault();
    const delta = e.deltaY || e.detail || e.wheelDelta;
    const element = e.currentTarget;
    element.scrollLeft += delta;
  }
};

const AdminLayout = ({ children }) => {
  const pathName = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const windowWidth = useWindowWidth();
  const clearUser = useUserStore((state) => state.clearUser);
  const clearAccess = useAdminAccessStore((state) => state.clearAccess);

  useLayoutEffect(() => {
    const token = Cookies.get("cms-token");
    if (!token) {
      redirect("/auth/login");
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let element;
    if (isMounted) {
      element = document.querySelector("#scrollable-container");
      if (element) {
        element.addEventListener("wheel", handleScroll, { passive: false });
      }
    }

    return () => {
      if (element) {
        element.removeEventListener("wheel", handleScroll);
      }
    };
  }, [isMounted]);

  const logOut = () => {
    clearUser();
    clearAccess();
    Cookies.remove("cms-token");
    router.push("/auth/login");
  };

  return (
    <div className="tw-flex tw-flex-col">
      {isMounted ? (
        <>
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
                  overflow: "hidden",
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
                  className="tw-p-6 tw-bg-white tw-rounded-[14px] tw-shadow tw-overflow-auto"
                  style={{ minHeight: "50vh" }}
                >
                  <Suspense fallback={<></>}>{children}</Suspense>
                </motion.div>
              </Content>
            </Layout>
          </Layout>
        </>
      ) : null}
    </div>
  );
};

export default AdminLayout;
