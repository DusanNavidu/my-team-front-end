import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import type { SweetAlertIcon } from "sweetalert2";


const MySwal = withReactContent(Swal);

type AlertProps = {
    icon: SweetAlertIcon;
    title: string;
    text?: string;
    timer?: number;
};

export const showAlert = ({ icon, title, text, timer }: AlertProps) => {
    MySwal.fire({
        icon,
        title,
        text,
        timer,
        background: "#1f2937",
        color: "#fbbf24",
        confirmButtonColor: "#2563eb",
        iconColor: icon === "success" ? "#22c55e" : icon === "error" ? "#ef4444" : "#f59e0b",
        timerProgressBar: true,
    });
};
