import { createClient } from "@/utils/supabase/client";

export const signInWithGithub = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: 'http://localhost:3000/auth/callback' }
    })
}
