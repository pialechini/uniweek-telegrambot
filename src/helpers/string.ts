export function tokenFromEmail(email: string) {
  return email.split('@')[0].replace(/_/g, '-');
}

export function tokenToEmail(token: string) {
  return token.replace(/-/g, '_') + '@somewhere.com';
}
