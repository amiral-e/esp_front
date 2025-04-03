"use client";
import { signInWithGithub } from "@/app/oauth";

export const GithubSSO = () => (
  <div className="flex items-center gap-3">
    <div
      id="github-sso"
            role="button"
            tabIndex={0}
            onClick={signInWithGithub}
            onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
          signInWithGithub();
        }
      }}
      className="relative flex items-center bg-gray-100 justify-center shrink-0 h-10 w-full rounded-full group cursor-pointer overflow-hidden border border-gray-200 hover:bg-gray-200 transition"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h5 className="text-base text-foreground m-0">GitHub</h5>
        </div>
      </div>
    </div>
  </div>
);
