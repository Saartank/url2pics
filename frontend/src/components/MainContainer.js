import React from "react";

const MainContainer = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default MainContainer;
