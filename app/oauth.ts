import { createClient } from "@/utils/supabase/client";

export const signInWithGithub = async () => {
	const supabase = createClient();

	await supabase.auth.signInWithOAuth({
		provider: "github",
		options: {
			redirectTo: `${process.env.NEXT_PUBLIC_HOMEPAGE_URL}/auth/callback`,
		},
	});
};
