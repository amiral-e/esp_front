"use client";
import { signInWithGithub } from "@/app/oauth";

export const GithubSSO = () => (
    <div className="flex items-center gap-3">
        <div
            onClick={signInWithGithub}
            className="relative flex items-center justify-center shrink-0 h-10 w-full rounded-lg group cursor-pointer overflow-hidden border hover:border-strong transition">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <h5 className="text-base text-foreground m-0">GitHub</h5>
                </div>
            </div>
        </div>
    </div>
)
