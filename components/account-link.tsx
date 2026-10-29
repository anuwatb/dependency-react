'use client';

import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/controllers/auth.controller";

const AccountLink = ({ role }: { role: string }) => {
    return (
        <Link 
            href={role == 'editor' ? "" : "/signin"}
            onNavigate={async (e) => {
                if (role == 'editor') {
                    if (window.confirm('Sign out?')) await signOut();
                    else e.preventDefault();
                }
            }}
        >
            <Image className="w-full h-full" src="/account_circle.svg" alt={role == 'editor' ? "Sign out" : "Sign in"} width={24} height={24} />
        </Link>
    );
};

export default AccountLink;