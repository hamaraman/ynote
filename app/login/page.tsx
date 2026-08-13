"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, useUser } from "@/lib/auth";

declare global {
    interface Window {
        google?: any;
    }
}

export default function LoginPage() {
    const router = useRouter();
    const user = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    // Google OAuth Web Client ID는 브라우저에 노출되는 공개 식별자입니다.
    // 환경변수가 없는 자동 배포 환경에서도 로그인 버튼이 동작하도록 기본값을 둡니다.
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "59719943280-0na6m9vtnigsphmts2459q118448sqle.apps.googleusercontent.com";

    // If already logged in, redirect to bookmarks page
    useEffect(() => {
        if (user) {
            router.push("/bookmarks");
        }
    }, [user, router]);

    // Load Google Identity Services SDK dynamically
    useEffect(() => {
        const scriptId = "google-gsi-client";
        let script = document.getElementById(scriptId) as HTMLScriptElement;

        const initializeGsi = () => {
            if (window.google?.accounts?.id) {
                setSdkLoaded(true);
                window.google.accounts.id.initialize({
                    client_id: googleClientId,
                    callback: handleCredentialResponse,
                });

                if (buttonRef.current) {
                    window.google.accounts.id.renderButton(buttonRef.current, {
                        type: "standard",
                        theme: "outline",
                        size: "large",
                        text: "signin_with",
                        shape: "rectangular",
                        width: 320,
                    });
                }
            }
        };

        if (!script) {
            script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = initializeGsi;
            document.head.appendChild(script);
        } else {
            initializeGsi();
        }

        return () => {
            // Keep script loaded to avoid re-fetching, but clear prompts
            if (window.google?.accounts?.id) {
                window.google.accounts.id.cancelPrompt();
            }
        };
    }, [googleClientId]);

    const handleCredentialResponse = (response: any) => {
        setIsLoading(true);
        try {
            const token = response.credential;
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            const payload = JSON.parse(jsonPayload);

            // Set login user state
            login({
                id: payload.sub,
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
            });

            alert(`${payload.name}님, 로그인되었습니다!`);
            router.push("/bookmarks");
        } catch (err) {
            console.error("Token decoding error:", err);
            alert("Google 로그인 데이터를 처리하지 못했습니다.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50/50 dark:bg-slate-950/20 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-lg">
                
                {/* Logo & Headline */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 justify-center group">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-blue-500/25">
                            청
                        </div>
                        <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                            청년노트
                        </span>
                    </div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white pt-2">
                        청년노트에 오신 것을 환영합니다
                    </h2>
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 leading-relaxed max-w-xs mx-auto">
                        청년 정책 비서 청년노트와 함께<br />
                        나에게 딱 맞는 혜택과 정보를 놓치지 마세요.
                    </p>
                </div>

                {/* Google Sign-In Container */}
                <div className="flex flex-col items-center justify-center pt-6 space-y-4">
                    {isLoading ? (
                        <div className="w-full flex items-center justify-center py-4">
                            <span className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        /* Target container for standard Google button */
                        <div ref={buttonRef} className="w-full flex justify-center" />
                    )}
                </div>

                {/* Back to Home Link */}
                <div className="text-center pt-2">
                    <Link
                        href="/"
                        className="text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        ← 홈으로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    );
}
