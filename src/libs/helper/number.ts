// Put leading zero number
export function zeroPad(number: number, places = 2) {
  return String(number).padStart(places, `0`);
}
