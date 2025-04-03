// import React, { useEffect } from 'react';
// import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../App';
// import { jwtDecode } from 'jwt-decode';

// const PrivateRoutes = () => {
//   const { isAuthenticated, setIsAuthenticated } = React.useContext(AuthContext);
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
//         if (decodedToken.exp > currentTime) {
//           setIsAuthenticated(true);
//           if (location.pathname === '/sign-in' || location.pathname === '/sign-up') {
//             navigate('/', { replace: false });
//           }
//         } else {
//           // Token has expired
//           localStorage.removeItem('token');
//           localStorage.removeItem('authUser');
//           setIsAuthenticated(false);
//           navigate('/sign-in', { replace: false });
//         }
//       } catch (error) {
//         console.error('Error decoding token:', error);
//         setIsAuthenticated(false);
//         navigate('/sign-in', { replace: false });
//       }
//     } else {
//       setIsAuthenticated(false);
//       if (location.pathname !== '/sign-in' && location.pathname !== '/sign-up') {
//         navigate('/sign-in', { replace: false });
//       }
//     }
//   }, [location, navigate, setIsAuthenticated]);

//   return isAuthenticated ? <Outlet /> : null;
// };

// export default PrivateRoutes;
