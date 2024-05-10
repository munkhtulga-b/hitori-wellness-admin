const BusinessHourIndicator = ({ indicatorWidth }) => {
  return (
    <>
      <div className="tw-absolute tw-left-[47px] tw-top-[-4px] tw-z-10">
        <div className="tw-relative">
          <div className="tw-bg-bgCancelled tw-rounded-full tw-size-[12px] tw-absolute tw-top-[-4px] tw-left-[-6px]"></div>
          <div
            style={{
              width: `${indicatorWidth}px`,
            }}
            className="tw-bg-bgCancelled tw-h-[4px] tw-absolute tw-top-0 tw-left-0"
          ></div>
        </div>
      </div>
    </>
  );
};

export default BusinessHourIndicator;
