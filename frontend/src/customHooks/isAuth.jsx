import React, { useEffect } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'

const IsAuth = ({ setisauthenticated }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
                if (decodedToken.exp < currentTime) {
                    // Token has expired, log out and clear local storage
                    localStorage.removeItem("token");
                    localStorage.removeItem("authUser");
                    setisauthenticated(false); // Update authentication state
                    navigate("/sign-in", { replace: false }); // Redirect to sign-in
                } else {
                    setisauthenticated(true);
                    if (
                        location.pathname === "/sign-in" ||
                        location.pathname === "/sign-up"
                    ) {
                        navigate(from, { replace: true }); // Use replace to avoid adding to history
                    }
                }
            } catch (error) {
                console.error("Token decoding failed:", error);
                navigate("/sign-in", { replace: false });
            }
        }
        // else {
        //     navigate("/sign-up", { replace: true }); // Redirect if no token
        // }
    }, [location.pathname, navigate, setisauthenticated, from]); // Added from to dependencies

    return null;
}

export default IsAuth