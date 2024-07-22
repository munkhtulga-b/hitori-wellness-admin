"use client";

import $api from "@/app/_api";
import PageHeader from "@/app/_components/PageHeader";
import PartialLoading from "@/app/_components/PartialLoading";
import { useEffect, useState } from "react";

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
                <div className="iframe-container">
                  <iframe
                    src={lookerURL}
                    width="100%"
                    height="800"
                    style={{ border: "none" }}
                  ></iframe>
                </div>
              </>
            ) : (
              <>Not permitted</>
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
