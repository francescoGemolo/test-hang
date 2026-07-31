export function mapAuthError(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;

  switch (code) {
    case 'auth/email-already-in-use':
      return 'Questa email è già registrata.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email o password non corretti.';
    case 'auth/weak-password':
      return 'La password è troppo debole.';
    case 'auth/invalid-email':
      return "L'indirizzo email non è valido.";
    case 'auth/popup-closed-by-user':
      return 'Accesso con Google annullato.';
    case 'auth/too-many-requests':
      return 'Troppi tentativi, riprova più tardi.';
    case 'auth/requires-recent-login':
      return 'Per motivi di sicurezza, esci e accedi di nuovo prima di ripetere questa azione.';
    default:
      return 'Si è verificato un errore. Riprova.';
  }
}