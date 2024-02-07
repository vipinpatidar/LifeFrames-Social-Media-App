import React, { useContext, useState, useEffect } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
//CSS
import "./navbar.scss";
import { DarkModeContext } from "../../context/darkMode";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "react-query";
import { makeRequest } from "../../utils/axios";

const Navbar = ({ logoutHandler }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const context = useContext(DarkModeContext);
  const { user, isLoginUser } = useContext(AuthContext);

  const toggleDarkMode = context.toggleDarkMode;
  const isDarkMode = context.isDark;

  /*================ GET RESIZE PAGE VALUE =============== */

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isBigScreen = windowWidth > 960;
  const tabletScreenWidth = windowWidth > 700;

  /*================= OPEN / CLOSE ========================== */

  const closeOpenMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };
  const closeOpenSearch = () => {
    if (!isBigScreen) {
      setIsSearchOpen((prevState) => !prevState);
      setSearch("");
    }
  };

  const clearSearch = () => {
    setSearch("");
    closeOpenSearch();
  };

  /*===================== GET SEARCHED  USER ===================*/

  const {
    isLoading,
    error,
    data: allUsers,
  } = useQuery("allUsers", async () => {
    if (isLoginUser) {
      const res = await makeRequest.get("/users/all");
      return res.data;
    }
  });

  // console.log(allUsers);
  let filterTimeout;

  const searchUsers = (query) => {
    clearTimeout(filterTimeout);

    if (!query) setFilteredUsers([]);

    filterTimeout = setTimeout(() => {
      setFilteredUsers(
        allUsers?.filter((profile) =>
          profile?.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }, 300);
  };

  useEffect(() => {
    searchUsers(search);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // console.log(filteredUsers);

  return (
    <div className="navbar">
      <div className="left">
        <Link to={"/"} className="appName">
          <span>LifeFrames</span>
        </Link>
        <Link to={"/"} className="homeIcon">
          <HomeOutlinedIcon />
        </Link>
        {isDarkMode ? (
          <WbSunnyOutlinedIcon
            onClick={toggleDarkMode}
            style={{ cursor: "pointer" }}
          />
        ) : (
          <DarkModeOutlinedIcon
            onClick={toggleDarkMode}
            style={{ cursor: "pointer" }}
          />
        )}
        <GridViewOutlinedIcon className="hideOnMin" />
        <div
          className="search"
          style={{ position: `${isBigScreen ? "relative" : "static"}` }}
        >
          {search && (
            <div className="searchedResult">
              <ul>
                {filteredUsers?.length > 0 ? (
                  filteredUsers.map((people) => (
                    <li key={people.id} onClick={clearSearch}>
                      <Link
                        to={`/profile/${people.id}`}
                        className="searchedList"
                      >
                        <img
                          src={`${import.meta.env.VITE_SERVER_URL}/uploads/${
                            people?.profilePic
                          }`}
                          alt="users"
                        />
                        <p>{people.name}</p>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li
                    className="searchedList"
                    style={{ padding: "10px 26px", fontSize: "17px" }}
                  >
                    No Search Match
                  </li>
                )}
              </ul>
            </div>
          )}

          <label
            htmlFor="search"
            className="searchLabel"
            onClick={closeOpenSearch}
          >
            <SearchOutlinedIcon />
          </label>
          <div
            className="SearchInput"
            style={{
              transform: `${
                !isBigScreen
                  ? isSearchOpen
                    ? "translateX(0%)"
                    : "translateX(-100%)"
                  : "translateX(0%)"
              }`,
            }}
          >
            <input
              type="text"
              placeholder="Search people..."
              name="search"
              id="search"
              value={search}
              autoComplete="off"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="right">
        <PersonOutlinedIcon className="hideOnMin" />
        <EmailOutlinedIcon className="hideOnMin" />
        <NotificationsOutlinedIcon className="hideOnMin" />
      </div>
      <MenuIcon className="menuIcon" onClick={closeOpenMenu} />
      {!isBigScreen && isMenuOpen && (
        <div className="nameAndLogout">
          <Link to={`/profile/${user.id}`} className="user">
            <span>{user?.name}</span>
            <img
              src={`http://localhost:3000/uploads/${user?.profilePic}`}
              alt="user profile"
            />
          </Link>
          <button onClick={logoutHandler} className="logoutBtn">
            Logout
          </button>
        </div>
      )}

      {tabletScreenWidth && (
        <div className="nameAndLogout showOnBig">
          <Link to={`/profile/${user.id}`} className="user">
            <span>{user?.name}</span>
            <img
              src={`http://localhost:3000/uploads/${user?.profilePic}`}
              alt="user profile"
            />
          </Link>
          <button onClick={logoutHandler} className="logoutBtn">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
