import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// App Provider
import AppProvider from "./_provider/AppProvider";

const font = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: process.env.BASE_META_TITLE,
    template: "%s | " + process.env.BASE_META_TITLE,
  },
  description: process.env.BASE_META_DESCRIPTION,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <AntdRegistry>
          <>
            <ToastContainer />
            <AppProvider fontFamily={font}>{children}</AppProvider>
          </>
        </AntdRegistry>
      </body>
    </html>
  );
}
