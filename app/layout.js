import localFont from "next/font/local";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";
import Menu from "@/components/Menu";
import TopMenu from "@/components/TopMenu";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased p-2 flex justify-center items-center`}
        >
          <div className="max-w-[1440px] w-full ">{children}</div>
        </body>
      </html>
    </SessionWrapper>
  );
}
