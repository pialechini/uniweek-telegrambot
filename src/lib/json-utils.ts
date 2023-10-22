export function decode<T extends object>(encoded: string): T {
  const bytes = new Uint8Array(encoded.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = encoded.charCodeAt(i);
  }
  const string = String.fromCharCode(...new Uint16Array(bytes.buffer));
  return JSON.parse(string);
}

export function encode(obj: object): string {
  const string = JSON.stringify(obj);
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
}
