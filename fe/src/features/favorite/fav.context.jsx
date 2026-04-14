import { createContext, useState } from "react";

export const FavContext = createContext();

export const FavContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  return (
    <FavContext.Provider
      value={{
        loading,
        setLoading,
        favorites,
        setFavorites,
        error,
        setError,
      }}
    >
      {children}
    </FavContext.Provider>
  );
};