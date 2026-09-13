import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import BottomNavigation from "./BottomNavigation";
import ToastContainer from "../common/Toast";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-content">
        <div className="app-content-inner">
          <Outlet />
        </div>
      </main>
      <BottomNavigation />
      <ToastContainer />
    </div>
  );
}
