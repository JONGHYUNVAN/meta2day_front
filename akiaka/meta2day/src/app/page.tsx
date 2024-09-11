import { redirect } from 'next/navigation';
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Meta2day",
  description: "Meta2day is an innovative platform that offers real-time news, trends, and personalized content based on real-time data.",
};

export default function Index() {
  redirect('/home');
  return null;
}