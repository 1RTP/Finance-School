import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchParticipants, selectFilteredParticipants } from "../features/participants/participantsSlice";
import Spinner from "../components/Spinner";

function Participants() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const participants = useSelector((state) => selectFilteredParticipants(state, searchTerm, eventId));
  const loading = useSelector((state) => state.participants.loading);
  const error = useSelector((state) => state.participants.error);
  const handleLoad = () => { dispatch(fetchParticipants(eventId));};

  return (
    <div className="participants-page">
      <h2>Учасники події</h2>

      <input
        type="text"
        placeholder="Пошук учасників за ім'ям або email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {loading && <Spinner />}
      {error && <p className="error">{error}</p>}
      {!loading && !error && participants.length === 0 ? (
        <p>Поки що немає зареєстрованих учасників</p>
      ) : (
        <div className="participants-grid">
          {participants.map((p) => (
            <div key={p.id} className="participant-card">
              <strong>{p.fullName}</strong>
              <span>{p.email}</span>
            </div>
          ))}
        </div>
      )}

      <div className="footer-row">
        <Link className="back-button" to="/">
          Повернутися до подій
        </Link>
        <button onClick={handleLoad} className="footer-button">
          Завантажити учасників
        </button>
      </div>
    </div>
  );
}

export default Participants;
