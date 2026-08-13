"use client";

import { useSyncExternalStore } from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    picture: string;
}

const KEY = "ynote-user";
const EVENT = "ynote-auth-updated";
const EMPTY: User | null = null;

let cache: User | null = null;
let cacheRaw: string | null = null;

function read(): User | null {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(KEY) : null;
    if (raw === cacheRaw) return cache;
    cacheRaw = raw;
    try {
        cache = raw ? (JSON.parse(raw) as User) : EMPTY;
    } catch {
        cache = EMPTY;
    }
    return cache;
}

function subscribe(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    window.addEventListener(EVENT, callback);
    window.addEventListener("storage", callback);
    return () => {
        window.removeEventListener(EVENT, callback);
        window.removeEventListener("storage", callback);
    };
}

/** Hook to get current logged-in user. Re-renders automatically on auth state changes. */
export function useUser(): User | null {
    return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** Logs the user in and broadcasts the event. */
export function login(user: User): void {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(user));
    window.dispatchEvent(new Event(EVENT));
}

/** Logs the user out and broadcasts the event. */
export function logout(): void {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
}
