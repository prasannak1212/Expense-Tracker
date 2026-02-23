import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Layout({ children }) {
  const { isAuthenticated, logout, user} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="app-header">
        {/* <div className="logo-section">
          <img
            src="../favicon.png"
            alt="logo"
          />
          <h1>SpendNest</h1>
        </div> */}
        <div className="logo-section">
        <img src="../favicon.png" alt="logo" />
        <h1>SpendNest</h1>
        </div>

        {isAuthenticated && (
        <div className="user-section-lb">
            {/* <span>Hi {user?.split("@")[0]} 👋</span> */}
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        )}

      </header>

      {/* {isAuthenticated && (<span>Hi {user?.split("@")[0]} 👋</span>)} */}
      
      <main>
        {children}
      </main>
    </>
  );
}

export default Layout;