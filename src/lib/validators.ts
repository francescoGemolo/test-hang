export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidMaxParticipants(value: string): boolean {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 2;
}