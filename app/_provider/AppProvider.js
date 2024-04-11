"use client";

import { ConfigProvider } from "antd";
import "dayjs/locale/ja";
import locale from "antd/locale/ja_JP";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";

dayjs.locale("ja");
dayjs.extend(updateLocale);
dayjs.extend(utc);
dayjs.updateLocale("ja", {
  weekStart: 0,
});

const colors = {
  primary: "#121316",
  primaryHover: "#1D1F24",
  primaryDisabled: "#EFEFF1",
  secondary: "#B7DDFF",
  textSecondary: "#1890FF",
  error: "#EA202B",
  inputPlaceholder: "#838795",
  formInputBackground: "#FAFAFA",
  formRequiredMark: "#D51E27",
  headerBg: "#E4DCD5",
  optionSelected: "#ECEDF0",
};

const AppProvider = ({ children, fontFamily }) => {
  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          fontFamily,
          colorPrimary: colors.primary,
          colorPrimaryHover: colors.primaryHover,
          colorPrimaryText: colors.primary,
          colorError: colors.error,
        },
        components: {
          Button: {
            defaultActiveBorderColor: colors.primary,
            defaultHoverBorderColor: colors.primary,
            defaultHoverColor: colors.textSecondary,
            defaultActiveColor: colors.textSecondary,
            colorBgContainerDisabled: colors.primaryDisabled,
            colorTextDisabled: "#BABCC4",
            lineHeightLG: 26,
            borderRadius: 8,
            borderRadiusSM: 8,
            controlHeightLG: 46,
            controlHeight: 40,
            controlHeightSM: 36,
            paddingInline: 16,
            paddingInlineSM: 16,
            primaryShadow: "0 8px 16px 0 rgba(0, 0, 0, 0)",
            primaryColor: "#FFF",
          },
          Radio: {
            colorPrimary: colors.textSecondary,
            radioSize: 20,
            dotSize: 10,
          },
          Form: {
            labelHeight: 22,
            verticalLabelPadding: "0 0 8px 0",
            itemMarginBottom: 16,
            labelRequiredMarkColor: colors.formRequiredMark,
          },
          Input: {
            controlHeight: 46,
            fontSize: 14,
            colorBgContainer: colors.formInputBackground,
            colorTextPlaceholder: colors.inputPlaceholder,
            controlOutlineWidth: 0.5,
          },
          Select: {
            controlHeightLG: 46,
            fontSizeLG: 14,
            fontSize: 14,
            colorBgContainer: colors.formInputBackground,
            colorTextPlaceholder: colors.inputPlaceholder,
            controlOutlineWidth: 0.5,
            optionSelectedBg: colors.optionSelected,
          },
          DatePicker: {
            controlHeight: 46,
            colorBgContainer: colors.formInputBackground,
            colorTextPlaceholder: colors.inputPlaceholder,
          },
          Layout: {
            headerBg: colors.headerBg,
            siderBg: colors.headerBg,
            screenLG: 1024,
          },
          Tabs: {
            horizontalItemPadding: "8px 16px",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AppProvider;
