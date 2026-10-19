import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";
import { BottomNavigation } from "../BottomNavigation";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <div className="mx-auto flex w-full max-w-[1600px]">
        <Sidebar />

        <main className="min-w-0 flex-1 px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">
          <Outlet />
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}
