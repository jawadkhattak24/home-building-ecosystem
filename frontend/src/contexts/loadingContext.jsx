import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const LoadingContext = createContext();

export function useLoading() {
  return useContext(LoadingContext);
}

const styles = {
  loadingWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#f9f9f9",
    position: "fixed",
    zIndex: 1000,
  },
  loader: {
    border: "8px solid #f3f3f3",
    borderTop: "8px solid #fb5012",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "10px",
    fontSize: "18px",
    color: "#555",
  },
};

const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const LoadingUI = () => {
    return (
      <>
        <style>{keyframes}</style>
        <div style={styles.loadingWrapper}>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={styles.loader}></div>
              <p style={styles.loadingText}>Loading...</p>
            </div>
          ) : (
            <p style={styles.loadingText}>Loading...</p>
          )}
        </div>
      </>
    );
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, LoadingUI }}>
      {children}
    </LoadingContext.Provider>
  );
};

LoadingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
