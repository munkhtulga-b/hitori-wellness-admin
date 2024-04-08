"use client";

import { ConfigProvider } from "antd";
import "dayjs/locale/ja";
import locale from "antd/locale/ja_JP";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.locale("ja");
dayjs.extend(updateLocale);
dayjs.updateLocale("ja", {
  weekStart: 0,
});

const colors = {
  primary: "#635D50",
  primaryHover: "#635D50",
  primaryDisabled: "#EFEFF1",
  secondary: "#B7DDFF",
  textPrimary: "#121316",
  textSecondary: "#1890FF",
  error: "#EA202B",
  inputPlaceholder: "#838795",
  formInputBackground: "#FAFAFA",
  formRequiredMark: "#D51E27",
  headerBg: "#E4DCD5",
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
          colorPrimaryText: colors.textPrimary,
          colorError: colors.error,
        },
        components: {
          Button: {
            defaultActiveBorderColor: colors.secondary,
            defaultHoverBorderColor: colors.secondary,
            defaultHoverColor: colors.textSecondary,
            defaultActiveColor: colors.textSecondary,
            colorBgContainerDisabled: colors.primaryDisabled,
            colorTextDisabled: "#BABCC4",
            borderRadius: 8,
            borderRadiusSM: 8,
            controlHeightLG: 48,
            controlHeight: 40,
            controlHeightSM: 36,
            paddingInline: 16,
            paddingInlineSM: 16,
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
          },
          Select: {
            controlHeightLG: 46,
            fontSizeLG: 14,
            fontSize: 14,
            colorBgContainer: colors.formInputBackground,
            colorTextPlaceholder: colors.inputPlaceholder,
          },
          DatePicker: {
            controlHeight: 46,
            colorBgContainer: colors.formInputBackground,
            colorTextPlaceholder: colors.inputPlaceholder,
          },
          Layout: {
            headerBg: colors.headerBg,
            siderBg: colors.headerBg,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AppProvider;
