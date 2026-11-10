import type { Metadata } from "next";
import { GetTheApp } from "@/components/go/GetTheApp";

export const metadata: Metadata = {
  title: "Get the app",
};

export default function GoHome() {
  return <GetTheApp />;
}
