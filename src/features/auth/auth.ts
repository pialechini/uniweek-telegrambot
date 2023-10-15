import supabase from "../../lib/supabase";
import { sha256 } from "js-sha256";
import * as types from "../../types/types";

export function makeCredentialsWith(senderId: number) {
  const token = sha256(`wer3489${senderId}@..sf.s.cxv`);

  return {
    email: `mail${token}@fake.com`,
    password: token,
  };
}

export async function signIn(senderId: number) {
  const { data } = await supabase.auth.signInWithPassword(
    makeCredentialsWith(senderId)
  );

  return data.user;
}

export async function singUp(senderId: number, username?: string) {
  const { data: signupResult } = await supabase.auth.signUp({
    ...makeCredentialsWith(senderId),
  });

  const { data } = await supabase
    .from("identities")
    .upsert(
      { telegram_username: username },
      {
        onConflict: "user_id",
      }
    )
    .select();

  return signupResult.user;
}
