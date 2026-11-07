'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import AccountLink from "@/components/account-link";

interface NavbarProps {
    role: string;
    currentProjectId?: string;
}

const navItems = [
    { label: "Home", href: "/" },
    { label: "Editor", href: "/editor" },
];

export default function Navbar({ role, currentProjectId }: NavbarProps) {
    const pathName = usePathname();
    
    return (
        <header className="bg-surface border-b border-outline-variant fixed w-full z-50 flex items-center justify-between px-margin h-14">
            <div className="flex items-center gap-8">
                <span className="font-headline-md text-headline-md text-primary font-bold">Dependency Diagram</span>
                <nav className="flex items-center gap-6 font-body-base text-body-base">
                    {navItems.map(({ label, href }) => (
                        <Link 
                            key={label} 
                            href={href} 
                            onNavigate={e => {
                                if (currentProjectId && !window.confirm('The unsaved diagram (if any) will be deleted.')) e.preventDefault();
                            }}
                            className={pathName == href ? "text-primary border-b-2" : "text-on-surface-variant"}
                        >{label}</Link>
                    ))}
                </nav>
            </div>
            <div className="w-8 h-8 rounded-full border border-outline-variant cursor-pointer">
                <AccountLink role={role} />
            </div>
        </header>
    );
}