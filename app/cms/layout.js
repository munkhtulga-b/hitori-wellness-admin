"use client";

import NavigationBar from "@/app/_components/NavigationBar";
import { useEffect, useState, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Layout } from "antd";
import { useUserStore } from "../_store/user";
import SideBar from "@/app/_components/SideBar";
import { motion } from "framer-motion";
import { useWindowWidth } from "../_utils/custom-hooks";
import { useSidebarStore } from "../_store/siderbar";

const { Header, Content, Sider } = Layout;

const AdminLayout = ({ children }) => {
  const pathName = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const windowWidth = useWindowWidth();
  const clearUser = useUserStore((state) => state.clearUser);
  const setSidebar = useSidebarStore((state) => state.setBody);

  useEffect(() => {
    setSidebar({
      isCollapsed: collapsed,
    });
  }, [collapsed]);

  const logOut = () => {
    clearUser();
    router.push("/auth/login");
  };

  return (
    <div className="tw-flex tw-flex-col">
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
                className="tw-p-6 tw-bg-white tw-rounded-[14px] tw-shadow tw-overflow-visible"
                style={{ minHeight: "70vh" }}
              >
                <Suspense fallback={<></>}>{children}</Suspense>
              </motion.div>
            </Content>
          </Layout>
        </Layout>
      </>
    </div>
  );
};

export default AdminLayout;
