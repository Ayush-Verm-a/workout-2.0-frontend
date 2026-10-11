import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, status } = useSelector((store) => store.user);
    const location = useLocation();
    const token = localStorage.getItem("token");

    if ((status === "idle" || status === "loading") && token) {
        return <div className="route-loading">Loading…</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return children;
};

export default ProtectedRoute;
