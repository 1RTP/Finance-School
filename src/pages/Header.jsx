import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";

function Header({ search, setSearch }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.value);

  return (
    <header className="header">
      <div className="header-top">
        <h1>Школа фінансової грамотності</h1>
        <button 
          className={`theme-button ${theme}`} 
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>

      <p>
        Запис на інтенсиви з управління особистими фінансами та інвестицій
      </p>

      <input
        className="search-input"
        type="text"
        placeholder="Пошук подій..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
    </header>
  );
}

export default Header;
