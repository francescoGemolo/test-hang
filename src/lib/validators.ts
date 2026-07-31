const NICKNAME_PATTERN = /^[a-zA-Z0-9_.]{3,15}$/;
const WHATSAPP_PATTERN = /^\+?[0-9\s]{8,16}$/;
const HANDLE_PATTERN = /^@?[a-zA-Z0-9_.]{1,30}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidMaxParticipants(value: string): boolean {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 2;
}

export function isValidNickname(value: string): boolean {
  return NICKNAME_PATTERN.test(value.trim());
}

export function isValidWhatsapp(value: string): boolean {
  return WHATSAPP_PATTERN.test(value.trim());
}

export function isValidHandle(value: string): boolean {
  const trimmed = value.trim();
  return trimmed === '' || HANDLE_PATTERN.test(trimmed);
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidPassword(value: string): boolean {
  return value.length >= 8 && /[A-Za-z]/.test(value) && /[0-9]/.test(value);
}