import { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export const useError = () => {
  const [, setError] = useState(null);

  const setError = (error) => {
    setError(error);
  };

  return { error, setError };
};
