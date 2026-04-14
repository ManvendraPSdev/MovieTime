import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import {
  RiAdminLine,
  RiHeartLine,
  RiHistoryLine,
  RiMenuLine,
  RiMoonLine,
  RiMovie2Line,
  RiSearchLine,
  RiSunLine,
} from "react-icons/ri";
import { useAuth } from "../features/auth/hooks/useAuth.hook";
import { useTheme } from "./ThemeContext";
import styles from "./Header.module.scss";

const Header = () => {
  const navigate = useNavigate();
  const { user, authReady, handelLogout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setMenuOpen(false);
  };

  const navClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <RiMovie2Line size={28} aria-hidden />
          <span>Movieverse</span>
        </Link>

        <form className={styles.searchForm} onSubmit={onSearchSubmit}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search movies, TV, people…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search"
          />
          <button type="submit" className={styles.searchBtn} aria-label="Submit search">
            <RiSearchLine size={18} />
          </button>
        </form>

        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.menuToggle}
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <RiMenuLine size={24} />
          </button>
          <button
            type="button"
            className={styles.themeBtnDesktop}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <RiSunLine size={20} /> : <RiMoonLine size={20} />}
          </button>
        </div>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/browse" className={navClass} onClick={() => setMenuOpen(false)}>
            Browse
          </NavLink>
          <NavLink to="/search" className={navClass} onClick={() => setMenuOpen(false)}>
            Search
          </NavLink>
          {authReady && user ? (
            <>
              <NavLink
                to="/favorites"
                className={navClass}
                onClick={() => setMenuOpen(false)}
              >
                <RiHeartLine className={styles.navIcon} aria-hidden />
                Favorites
              </NavLink>
              <NavLink
                to="/watch-history"
                className={navClass}
                onClick={() => setMenuOpen(false)}
              >
                <RiHistoryLine className={styles.navIcon} aria-hidden />
                History
              </NavLink>
            </>
          ) : null}
          {authReady && user?.isAdmin ? (
            <NavLink
              to="/admin"
              className={navClass}
              onClick={() => setMenuOpen(false)}
            >
              <RiAdminLine className={styles.navIcon} aria-hidden />
              Admin
            </NavLink>
          ) : null}
          {authReady && user ? (
            <button
              type="button"
              className={styles.ghostBtn}
              onClick={() => {
                handelLogout();
                setMenuOpen(false);
              }}
            >
              Log out
            </button>
          ) : (
            <NavLink to="/login" className={navClass} onClick={() => setMenuOpen(false)}>
              Log in
            </NavLink>
          )}
          <button
            type="button"
            className={styles.themeBtnMobile}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <RiSunLine size={20} /> : <RiMoonLine size={20} />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
