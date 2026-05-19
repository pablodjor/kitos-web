import { useEffect, useId, useMemo, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

import styles from "./CountryAutocomplete.module.scss";

export default function CountryAutocomplete({
  countries,
  value,
  onChange,
  disabled = false,
  required = false,
  placeholder = "Selecciona tu país",
}) {
  const listId = useId();
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const visibleCountries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return countries;
    }

    return countries.filter((country) =>
      country.name.toLowerCase().includes(normalizedQuery)
    );
  }, [countries, query]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [visibleCountries]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setQuery(value || "");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [value]);

  const closeDropdown = () => {
    setIsOpen(false);
    setQuery(value || "");
    setHighlightedIndex(-1);
  };

  const selectCountry = (countryName) => {
    onChange(countryName);
    setQuery(countryName);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const openDropdown = () => {
    if (disabled) return;

    setIsOpen(true);
  };

  const handleToggle = () => {
    if (disabled) return;

    if (isOpen) {
      closeDropdown();
      return;
    }

    openDropdown();
    inputRef.current?.focus();
  };

  const handleInputChange = (event) => {
    const nextQuery = event.target.value;

    setQuery(nextQuery);
    setIsOpen(true);

    if (!nextQuery.trim()) {
      onChange("");
      return;
    }

    const exactMatch = countries.find(
      (country) =>
        country.name.toLowerCase() === nextQuery.trim().toLowerCase()
    );

    if (exactMatch) {
      onChange(exactMatch.name);
    } else if (value) {
      onChange("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!isOpen) {
        openDropdown();
        setHighlightedIndex(0);
        return;
      }

      if (visibleCountries.length === 0) return;

      setHighlightedIndex((prev) =>
        prev < visibleCountries.length - 1 ? prev + 1 : 0
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!isOpen || visibleCountries.length === 0) return;

      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : visibleCountries.length - 1
      );
      return;
    }

    if (event.key === "Enter" && isOpen) {
      if (highlightedIndex >= 0 && visibleCountries[highlightedIndex]) {
        event.preventDefault();
        selectCountry(visibleCountries[highlightedIndex].name);
      }

      return;
    }

    if (event.key === "Escape") {
      closeDropdown();
    }
  };

  const showDropdown = isOpen && !disabled;

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div className={styles.control}>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          value={query}
          onChange={handleInputChange}
          onFocus={openDropdown}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={50}
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listId}
          aria-autocomplete="list"
        />

        <button
          type="button"
          className={styles.toggle}
          onClick={handleToggle}
          disabled={disabled}
          aria-label={isOpen ? "Cerrar lista de países" : "Abrir lista de países"}
          aria-expanded={showDropdown}
        >
          <FaChevronDown
            className={isOpen ? styles.chevronOpen : undefined}
          />
        </button>
      </div>

      <input
        type="hidden"
        name="country"
        value={value}
        required={required}
        readOnly
      />

      {showDropdown && (
        <ul id={listId} className={styles.dropdown} role="listbox">
          {visibleCountries.length > 0 ? (
            visibleCountries.map((country, index) => (
              <li key={country.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === country.name}
                  className={
                    index === highlightedIndex ? styles.optionActive : undefined
                  }
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectCountry(country.name)}
                >
                  {country.name}
                </button>
              </li>
            ))
          ) : (
            <li className={styles.empty}>No se encontraron países</li>
          )}
        </ul>
      )}
    </div>
  );
}
