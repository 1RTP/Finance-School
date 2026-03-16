import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

function UserRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setErrors({ general: data.error || "Помилка реєстрації" });
      }
    } catch (err) {
      setErrors({ general: "Помилка сервера" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="form-container">
        <h2>Користувача успішно зареєстровано!</h2>
        <p>Ви будете перенаправлені на сторінку входу...</p>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Реєстрація користувача</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Логін
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </label>

        <label>
          Пароль
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </label>

        {errors.general && <span className="error">{errors.general}</span>}

        <button type="submit" disabled={loading}>
          {loading ? "Завантаження..." : "Зареєструватися"}
        </button>
      </form>
    </div>
  );
}

export default UserRegister;
