const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
const MONTHS = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
];

export function formatEventDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return `${WEEKDAYS[date.getDay()]}. ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}