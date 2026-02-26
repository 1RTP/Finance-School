import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registrationSchema } from "../utils/validation";
import Spinner from "../components/Spinner";
import { addParticipant } from "../features/participants/participantsSlice";

function Register() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ fullName: "", email: "", birthDate: "", source: "", });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      registrationSchema.parse(form);

      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventId }),
      });

      const data = await response.json();
      console.log("Відповідь сервера:", data);

      dispatch(
        addParticipant({
          id: Date.now(),
          fullName: form.fullName,
          email: form.email,
          birthDate: form.birthDate,
          source: form.source,
          eventId,
          createdAt: new Date().toISOString(),
        })
      );

      setSuccess(true);
      setTimeout(() => {
        navigate(`/participants/${eventId}`);
      }, 1500);
    } catch (err) {
      if (err.issues) {
        const mapped = {};
        err.issues.forEach((e) => {
          mapped[e.path[0]] = e.message;
        });
        setErrors(mapped);
      }
    }
  };

  if (success) {
    return (
      <div className="form-container">
        <h2>Учасника успішно додано!</h2>
        <p>Ви будете перенаправлені на список учасників...</p>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Реєстрація на подію</h2>

      <form onSubmit={handleSubmit}>
        <label> ПІБ
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </label>

        <label> Email
          <input type="email" name="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>

        <label> Дата народження
          <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
          {errors.birthDate && <span className="error">{errors.birthDate}</span>}
        </label>

        <fieldset>
          <legend>Звідки ви дізналися про подію?</legend>
          <div className="radio-group">
            <label>
              <input type="radio" name="source" value="social" checked={form.source === "social"} onChange={handleChange} />
              <span>Соціальні мережі</span>
            </label>

            <label>
              <input type="radio" name="source" value="friends" checked={form.source === "friends"} onChange={handleChange} />
              <span>Друзі</span>
            </label>

            <label>
              <input type="radio" name="source" value="self" checked={form.source === "self"} onChange={handleChange} />
              <span>Самостійно</span>
            </label>
          </div>
          {errors.source && <span className="error">{errors.source}</span>}
        </fieldset>

        <button type="submit">Зареєструватися</button>
      </form>
    </div>
  );
}

export default Register;
