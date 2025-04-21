"use client";
import { Link } from "lucide-react"
import { usePathname } from "next/navigation";

export const Logo = () => {
    const pathname = usePathname();
    if (pathname !== "/protected/chat") {
        return null;
    }
    return (
        <Link href="/" className="text-2xl font-bold text-orange-500 hover:text-orange-600 transition-colors">
            ComptaCompanion
        </Link>
    );
}