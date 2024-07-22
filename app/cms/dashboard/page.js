"use client";

import $api from "@/app/_api";
import PageHeader from "@/app/_components/PageHeader";
import PartialLoading from "@/app/_components/PartialLoading";
import { useEffect, useState } from "react";
import { Empty } from "antd";

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lookerURL, setLookerURL] = useState(null);

  useEffect(() => {
    checkLookerPermission();
  }, []);

  const checkLookerPermission = async () => {
    setIsLoading(true);
    const { isOk, data } = await $api.admin.looker.check();
    if (isOk && data?.url) {
      setLookerURL(data.url);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-6">
        <PageHeader title={"ダッシュボード"} />
        {!isLoading ? (
          <>
            {lookerURL ? (
              <>
                <div className="iframe-container tw-flex tw-justify-center">
                  <iframe
                    src={lookerURL}
                    width="100%"
                    height="900"
                    style={{ border: "none", maxWidth: 1200 }}
                  ></iframe>
                </div>
              </>
            ) : (
              <>
                <div className="tw-py-20">
                  <Empty description="権限が不足しています。" />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <PartialLoading />
          </>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
