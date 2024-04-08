import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";

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
          <AppProvider fontFamily={font}>{children}</AppProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
