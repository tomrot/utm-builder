export default function formatToDDMMYY(dateStr: string): string {
  const d = new Date(dateStr);
  const dd = (`0${d.getDate()}`).slice(-2);
  const mm = (`0${d.getMonth()+1}`).slice(-2);
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}${mm}${yy}`;
}
