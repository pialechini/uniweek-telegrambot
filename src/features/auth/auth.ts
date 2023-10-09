import supabase from '../../supabase';
import { sha256 } from 'js-sha256';

export function makeCredentialsWith(senderId: number) {
  const token = sha256(`wer3489${senderId}@..sf.s.cxv`);

  return {
    email: `mail${token}@fake.com`,
    password: token,
  };
}

export async function signIn(senderId: number, username?: string) {
  const { data, error } = await supabase.auth.signInWithPassword(
    makeCredentialsWith(senderId)
  );

  // Invalid login credentials
  if (error?.status === 400) {
    return singUp(senderId, username);
  }

  return data.user;
}

export async function singUp(senderId: number, username?: string) {
  const { data } = await supabase.auth.signUp({
    ...makeCredentialsWith(senderId),
    options: {
      data: {
        telegram_username: username ?? "",
      },
    },
  });

  return data.user;
}
