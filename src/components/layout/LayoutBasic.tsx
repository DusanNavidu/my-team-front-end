import Header from "../headers/Header";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="w-full">
      <Header />
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
