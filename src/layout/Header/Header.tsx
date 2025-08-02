import React, { useEffect, useState } from "react";
import {
  HeaderModel,
  PROFILE_CLICK,
  ProfileModel,
} from "../Header/HeaderModel";
import { getHeaderConfig } from "../../api/config";
import "./header.css";
import "../../css/_variables.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ProfileDropdown from "../Header/components/ProfileDropdown";
import { useKeycloak } from "@react-keycloak/web";

function Header() {
  const [config, setConfig] = useState<HeaderModel | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const { keycloak } = useKeycloak();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    getHeaderConfig()
      .then((res) => {
        if (res) {
          setConfig(res);
        }
      })
      .catch((error) => {
        console.error("Failed to load header config:", error);
      });
  }, []);

  useEffect(() => {
    if (keycloak) {
      const updateAuthStatus = () => {
        setIsAuthenticated(!!keycloak.authenticated);
      };

      keycloak.onAuthSuccess = updateAuthStatus;
      keycloak.onAuthLogout = updateAuthStatus;

      // Initial check
      updateAuthStatus();

      return () => {
        keycloak.onAuthSuccess = undefined;
        keycloak.onAuthLogout = undefined;
      };
    }
  }, [keycloak]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const alertsSection = document.querySelector(".alarm-section");
      const profileSection = document.querySelector(".profile-section");
      const searchSection = document.querySelector(".search-section");

      if (alertsSection && !alertsSection.contains(event.target as Node)) {
        setShowAlerts(false);
      }

      if (profileSection && !profileSection.contains(event.target as Node)) {
        setShowDropdown(false);
      }

      if (searchSection && !searchSection.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        handleSearchBarClick();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
    setShowAlerts(false);
  };

  const handleAlarmClick = () => {
    setShowAlerts(!showAlerts);
    setShowDropdown(false);
  };

  const handleSearchBarClick = () => {
    setShowSearchDropdown(true);
    setShowAlerts(false);
    setShowDropdown(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setSearchQuery("");
  };

  const handleRemoveFilter = () => {
    setActiveFilter("");
    setSearchQuery("");
  };

  const handleItemClick = (item: ProfileModel) => {
    if (item.click === PROFILE_CLICK.NEW_TAB) {
      window.open(item.path, "_blank");
    } else if (item.click === PROFILE_CLICK.SAME_TAB) {
      window.location.href = item.path || "";
    } else if (item.click === PROFILE_CLICK.LOG_OUT) {
      keycloak.logout();
    }
    setShowDropdown(false);
  };

  const handleLogin = () => {
    keycloak.login();
  };

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const generateIcon = (
    text: string,
    itemId?: string
  ): JSX.Element | string => {
    if (itemId === "all_store") {
      return <i className="bi bi-shop"></i>;
    }

    const words = text.split(" ");
    if (words.length === 1) {
      return text.slice(0, 3).toUpperCase();
    }
    return words.map((word) => word.charAt(0).toUpperCase()).join("");
  };

  return (
    <div id="main-header">
      <div className="header">
        {!config || Object.keys(config).length === 0 ? (
          <div className="header-error">No header configuration available</div>
        ) : (
          <>
            {/* Logo Section */}
            <div className="logo-section">
              {config.logo?.img && (
                <img
                  className="logo"
                  src={config.logo.img}
                  alt="Logo"
                  onClick={handleLogoClick}
                />
              )}
              {config.logo?.text && (
                <span className="logo-text">{config.logo.text}</span>
              )}
            </div>

            {/* Search Section */}
            {config.showSearch && (
              <div className="search-section">
                <div className="search-bar" onClick={handleSearchBarClick}>
                  <i className="bi bi-search"></i>
                  <span className="search-placeholder">Search</span>
                  <div className="search-shortcuts">
                    <span className="search-shortcut">CTRL</span>
                    <span className="search-shortcut">K</span>
                  </div>
                </div>

                {showSearchDropdown && (
                  <div className="search-dropdown">
                    <div className="search-input-container">
                      <i className="bi bi-search"></i>
                      <div className="active-filters">
                        {activeFilter && (
                          <div className="active-filter">
                            {activeFilter}
                            <span
                              className="remove-filter"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFilter();
                              }}
                            >
                              ×
                            </span>
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        className="search-input"
                        placeholder={!activeFilter ? "Search" : ""}
                        value={searchQuery}
                        onChange={handleSearch}
                        autoFocus
                      />
                    </div>

                    {!activeFilter && (
                      <div className="search-filters">
                        <div className="filter-options">
                          <div
                            className="filter-option"
                            onClick={() => handleFilterClick("Apps")}
                          >
                            Apps
                          </div>
                          <div
                            className="filter-option"
                            onClick={() => handleFilterClick("Customers")}
                          >
                            Customers
                          </div>
                          <div
                            className="filter-option"
                            onClick={() => handleFilterClick("Orders")}
                          >
                            Orders
                          </div>
                          <div
                            className="filter-option"
                            onClick={() => handleFilterClick("Products")}
                          >
                            Products
                          </div>
                          <div
                            className="filter-option"
                            onClick={() => handleFilterClick("Sales channels")}
                          >
                            Sales channels
                          </div>
                        </div>
                      </div>
                    )}

                    {searchQuery && (
                      <div className="search-results">
                        <div className="results-list">
                          <div className="no-results">
                            Start typing to see results...
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Right Section */}
            <div className="right-section">
              {/* Alarm Section */}
              {config.showAlarm && (
                <div className="alarm-section">
                  <div
                    className={`icon alarm-icon ${showAlerts ? "active" : ""}`}
                    onClick={handleAlarmClick}
                  >
                    <i className="bi bi-bell"></i>
                    {config.notifications &&
                      config.notifications.some((n) => !n.isRead) && (
                        <span className="notification-badge"></span>
                      )}
                  </div>
                  {showAlerts && (
                    <div className="alerts-dropdown">
                      <div className="alerts-header">
                        <h3>Alerts</h3>
                      </div>
                      <div className="alerts-content">
                        {config.notifications?.map((notification) => (
                          <div key={notification.id} className="alert-item">
                            <div className="alert-icon">📢</div>
                            <div className="alert-details">
                              <div className="alert-message">
                                {notification.message}
                              </div>
                              <div className="alert-time">
                                {new Date(
                                  notification.timestamp
                                ).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                        {(!config.notifications ||
                          config.notifications.length === 0) && (
                          <div className="no-alerts">No notifications</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Profile Section */}
              {isAuthenticated ? (
                <div className="profile-section">
                  <div
                    className={`profile-header-item ${
                      showDropdown ? "active" : ""
                    }`}
                    onClick={handleProfileClick}
                  >
                    {config.profile?.find(
                      (section) => section.id === "store_list"
                    )?.list[0] ? (
                      <>
                        {config.profile.find(
                          (section) => section.id === "store_list"
                        )?.list[0].id === "all_store" ? (
                          generateIcon(
                            config.profile.find(
                              (section) => section.id === "store_list"
                            )?.list[0].text || "",
                            config.profile.find(
                              (section) => section.id === "store_list"
                            )?.list[0].id
                          )
                        ) : (
                          <span className="profile-icon">
                            {generateIcon(
                              config.profile.find(
                                (section) => section.id === "store_list"
                              )?.list[0].text || "",
                              config.profile.find(
                                (section) => section.id === "store_list"
                              )?.list[0].id
                            )}
                          </span>
                        )}
                        <div className="profile-text">
                          <span className="main-text">
                            {
                              config.profile.find(
                                (section) => section.id === "store_list"
                              )?.list[0].text
                            }
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="profile-icon">👤</span>
                        <div className="profile-text">
                          <span className="main-text">
                            {keycloak.tokenParsed?.preferred_username ||
                              "Profile"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {showDropdown && config && (
                    <ProfileDropdown
                      config={config}
                      handleItemClick={handleItemClick}
                      generateIcon={generateIcon}
                    />
                  )}
                </div>
              ) : (
                <div className="profile-section">
                  <div className="profile-header-item" onClick={handleLogin}>
                    <span className="profile-icon">
                      <i className="bi bi-box-arrow-in-right"></i>
                    </span>
                    <div className="profile-text">
                      <span className="main-text">Login</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
