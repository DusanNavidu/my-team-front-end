import Panel from "../headers/AdminPanel"
import { Outlet } from "react-router-dom";

function LayoutAdmin() {
    return (
        <div className="w-full flex">
            <div className="fixed top-0 left-0 w-full h-16 z-0 bg-gray-900 text-white"></div>
            <Panel />
            <main className="bg-white text-black flex-1 pt-16">
                <Outlet />
            </main>
        </div>
    );
}

export default LayoutAdmin;