import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchParticipantsCursor, clearParticipants, selectFilteredParticipants, addFakeParticipants,} from "../features/participants/participantsSlice";
import Spinner from "../components/Spinner";

function Participants() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const participants = useSelector((state) => selectFilteredParticipants(state, searchTerm, eventId));
  const loading = useSelector((state) => state.participants.loading);
  const error = useSelector((state) => state.participants.error);
  const [hasMore, setHasMore] = useState(true);

  const loadParticipants = () => {
    if (loading || !hasMore) return;
    const lastId = participants.length > 0 ? participants[participants.length - 1]._id : null;
    dispatch(fetchParticipantsCursor({ eventId, lastId, limit: 5 }))
      .unwrap()
      .then((data) => {
        if (data.length === 0) setHasMore(false);
      })
      .catch(() => setHasMore(false));
  };

  useEffect(() => {
    dispatch(clearParticipants());
    setHasMore(true);
    loadParticipants();
  }, [dispatch, eventId]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        loadParticipants();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [participants, hasMore]);

  const handleAddFake = () => {
    dispatch(addFakeParticipants(eventId));
  };

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
            <div key={p._id} className="participant-card">
              <strong>{p.fullName}</strong>
              <span>{p.email}</span>
            </div>
          ))}
        </div>
      )}

      {!hasMore && <p>Більше учасників немає</p>}

      <div className="footer-row">
        <Link className="back-button" to="/">
          Повернутися до подій
        </Link>
        <button className="back-button" onClick={handleAddFake}>
          Додати тестових учасників
        </button>
      </div>
    </div>
  );
}

export default Participants;
