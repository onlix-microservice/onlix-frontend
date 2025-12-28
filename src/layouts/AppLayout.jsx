import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}