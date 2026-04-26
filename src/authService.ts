import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { User, UserCredential } from "firebase/auth";
import { auth } from "./firebase";

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const result: UserCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return result.user;
};

export const registerWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const result: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return result.user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};