export function generateId(prefix: string = 'id'): string {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${time}_${rand}`;
}
