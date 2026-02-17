const KEY = "favoriteEvents";
const PARTICIPANTS_KEY = "eventParticipants";

function safeParse(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return data || {};
  } catch {
    return {};
  }
}

export function getFavorites() {
  const data = safeParse(KEY);
  return Array.isArray(data) ? data : [];
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}

export function toggleFavorite(id) {
  const favorites = getFavorites();
  const updated = favorites.includes(id)
    ? favorites.filter(item => item !== id)
    : [...favorites, id];
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function getParticipants(eventId) {
  const data = safeParse(PARTICIPANTS_KEY);
  return data[eventId] || [];
}

export function addParticipant(eventId, participant) {
  const data = safeParse(PARTICIPANTS_KEY);
  const list = data[eventId] || [];

  if (!list.some(p => p.email === participant.email)) {
    data[eventId] = [...list, participant];
    localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(data));
  }
}

export function removeParticipant(eventId, email) {
  const data = safeParse(PARTICIPANTS_KEY);
  const list = data[eventId] || [];
  data[eventId] = list.filter(p => p.email !== email);
  localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(data));
}
