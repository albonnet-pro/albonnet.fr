import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";

export const clashDisplay = localFont({
  src: [
    { path: "../fonts/ClashDisplay-Regular.woff2",  weight: "400", style: "normal" },
    { path: "../fonts/ClashDisplay-Medium.woff2",   weight: "500", style: "normal" },
    { path: "../fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/ClashDisplay-Bold.woff2",     weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const generalSans = localFont({
  src: [
    { path: "../fonts/GeneralSans-Regular.woff2",  weight: "400", style: "normal" },
    { path: "../fonts/GeneralSans-Medium.woff2",   weight: "500", style: "normal" },
    { path: "../fonts/GeneralSans-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});