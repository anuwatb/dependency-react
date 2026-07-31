'use client';

import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/controllers/auth.controller";

const AccountLink = ({ role }: { role: string }) => {
    return (
        <Link 
            href={role == 'editor' ? "" : "/signin"}
            onNavigate={(e) => {
                if (role == 'editor') {
                    if (window.confirm('Sign out?')) signOut();
                    else e.preventDefault();
                }
            }}
        >
            <Image className="w-full h-full" src="/account_circle.svg" alt="" width={24} height={24} />
        </Link>
    );
};

export default AccountLink;