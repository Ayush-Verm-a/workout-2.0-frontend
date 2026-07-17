import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((store) => store.user);

    if (!isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default ProtectedRoute;
