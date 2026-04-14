import { createContext, useState } from "react";

export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <AdminContext.Provider
      value={{
        users,
        setUsers,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};