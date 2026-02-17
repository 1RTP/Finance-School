import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectEventById, updateEvent } from "../features/events/eventsSlice";

function EventCard({ id }) {
  const dispatch = useDispatch();
  const event = useSelector((state) => selectEventById(state, id));

  if (!event) return null;

  const { title, description, date, organizer, favorite } = event;
  const handleFavorite = () => { dispatch(updateEvent({ id, changes: { favorite: !favorite } }));};

  return (
    <div className={`event-card ${favorite ? "favorite" : ""}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p>
        <b>Дата:</b> {date}
      </p>
      <p>
        <b>Організатор:</b> {organizer}
      </p>

      <div className="actions">
        <button onClick={handleFavorite} className="main-button">
          {favorite ? "Видалити з цікавих" : "Цікаво"}
        </button>
        <div className="sub-actions">
          <Link to={`/register/${id}`} className="link-button">
            Реєстрація
          </Link>
          <Link to={`/participants/${id}`} className="link-button">
            Учасники
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
