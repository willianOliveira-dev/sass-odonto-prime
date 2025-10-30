"use client";
import { signIn } from "next-auth/react";

type LoginActionProviderProps = "google" | "facebook";

export async function loginActionProvider(provider: LoginActionProviderProps) {
  const result = await signIn(provider, { callbackUrl: "/dashboard" });
  if (result?.error) {
    console.log(result.error);
  }
}
