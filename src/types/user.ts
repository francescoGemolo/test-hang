export interface UserProfile {
  id: string;
  nickname: string;
  whatsapp?: string;
  instagram?: string;
  telegram?: string;
}

export type UserDraft = Omit<UserProfile, 'id'>;