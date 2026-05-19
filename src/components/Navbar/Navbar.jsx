import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaGift } from "react-icons/fa";
import { LuTags } from "react-icons/lu";

import BrandAvatar from "../BrandAvatar/BrandAvatar";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import styles from "./Navbar.module.scss";

const navItems = [
  { to: "/", label: "Inicio", icon: <FaHome /> },
  { to: "/ofertas", label: "Ofertas", icon: <LuTags /> },
  { to: "/sorteos", label: "Sorteos", icon: <FaGift /> },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className={styles.navbar}>
      <nav className={`navbar navbar-expand-lg ${styles.nav}`}>
        <div className="container">
          <NavLink to="/" className={`navbar-brand ${styles.brandLink}`} onClick={closeMenu}>
            <BrandAvatar name="Kitos" />
          </NavLink>

          <button
            className={`navbar-toggler ${styles.toggler}`}
            type="button"
            onClick={() => setOpen(!open)}
            aria-controls="mainNavbar"
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${open ? "show" : ""}`}
            id="mainNavbar"
          >
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3 pt-3 pt-lg-0">
              {navItems.map((item) => (
                <li className="nav-item" key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      isActive
                        ? `nav-link ${styles.link} ${styles.active}`
                        : `nav-link ${styles.link}`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="nav-item">
                <ThemeToggle />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}