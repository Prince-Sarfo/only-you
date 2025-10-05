export function makeRoomId(userA: string, userB: string): string {
  const [a, b] = [userA, userB].sort();
  return `${a}__${b}`;
}

export function generateMessageId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
