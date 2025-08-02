import React, { useEffect, useState } from "react";
import { HeaderModel, ProfileModel } from "../HeaderModel";
import "../header.css";
import { useKeycloak } from "@react-keycloak/web";

interface ProfileDropdownProps {
  config: HeaderModel;
  handleItemClick: (item: ProfileModel) => void; // Changed from PROFILE_CLICK to ProfileModel
  generateIcon: (text: string, itemId?: string) => JSX.Element | string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  config,
  handleItemClick,
  generateIcon,
}) => {
  const { keycloak } = useKeycloak();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (keycloak) {
      const updateLoginState = () => {
        setIsLoggedIn(keycloak.authenticated || false);
      };

      keycloak.onAuthSuccess = updateLoginState;
      keycloak.onAuthLogout = updateLoginState;

      // Initial check
      updateLoginState();

      return () => {
        keycloak.onAuthSuccess = undefined;
        keycloak.onAuthLogout = undefined;
      };
    }
  }, [keycloak]);

  const handleLogin = () => {
    keycloak.login();
  };

  return (
    <div className="profile-dropdown">
      {config?.profile?.map((section) => (
        <div key={section.id} className="profile-section-container">
          {section.id === "user_info" ? (
            isLoggedIn ? (
              section.list.map((item) => (
                <div
                  key={item.id}
                  className="profile-dropdown-item"
                  onClick={() => handleItemClick(item)}
                >
                  {item.id === "user_name" ? (
                    <div className={`profile-text`}>
                      <span className="main-text">
                        {keycloak.tokenParsed?.preferred_username || "Username"}
                      </span>
                      {keycloak.tokenParsed?.email && (
                        <span className="sub-text">
                          {keycloak.tokenParsed?.email}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className={`profile-text`}>
                      <span className="main-text">{item.text}</span>
                      {item.subText && (
                        <span className="sub-text">{item.subText}</span>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="profile-dropdown-item" onClick={handleLogin}>
                <div className="main-text login-button">Login</div>
              </div>
            )
          ) : (
            section.list.map((item) => (
              <div
                key={item.id}
                className="profile-dropdown-item"
                onClick={() => handleItemClick(item)}
              >
                {section.id === "store_list" && (
                  <>
                    {item.id === "all_store" ? (
                      generateIcon(item.text, item.id)
                    ) : (
                      <span className="profile-icon">
                        {generateIcon(item.text, item.id)}
                      </span>
                    )}
                  </>
                )}
                <div
                  className={`profile-text ${
                    section.id !== "store_list" ? "no-icon" : ""
                  }`}
                >
                  <span className="main-text">{item.text}</span>
                  {item.subText && (
                    <span className="sub-text">{item.subText}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
};

export default ProfileDropdown;
