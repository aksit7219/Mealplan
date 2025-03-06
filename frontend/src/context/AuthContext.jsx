// import React, { createContext, useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             try {
//                 const decodedToken = jwtDecode(token);
//                 const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
//                 if (decodedToken.exp > currentTime) {
//                     setIsAuthenticated(true);
//                     setUser(JSON.parse(localStorage.getItem('authUser')));
//                 } else {
//                     // Token has expired
//                     localStorage.removeItem('token');
//                     localStorage.removeItem('authUser');
//                     setIsAuthenticated(false);
//                     setUser(null);
//                 }
//             } catch (error) {
//                 console.error('Error decoding token:', error);
//                 setIsAuthenticated(false);
//                 setUser(null);
//             }
//         } else {
//             setIsAuthenticated(false);
//             setUser(null);
//         }
//     }, []);

//     const login = (token, user) => {
//         localStorage.setItem('token', token);
//         localStorage.setItem('authUser', JSON.stringify(user));
//         setIsAuthenticated(true);
//         setUser(user);
//     };

//     const logout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('authUser');
//         setIsAuthenticated(false);
//         setUser(null);
//     };

//     return (
//         <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
