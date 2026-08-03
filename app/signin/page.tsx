'use client';

import { useActionState } from "react";
import { signIn } from "@/controllers/auth.controller";

const Page = () => {
    const [state, action] = useActionState(signIn, undefined);
    
    return (<>
        <main className="bg-surface flex min-h-screen justify-center p-gutter">
            <div className="max-w-110">
                <div className="bg-surface-container border border-outline-variant rounded-xl p-margin">
                    <div className="flex flex-col gap-6">
                        <div className="space-y-1">
                            <h2 className="font-headline-md text-headline-md text-on-surface">
                                Sign in to your account
                            </h2>
                            <p className="text-body-sm text-on-surface-variant">
                                Enter your credentials.
                            </p>
                        </div>
                        <form action={action} className="flex flex-col gap-gutter">
                            <div>
                                <label htmlFor="email" className="signin-label">
                                    EMAIL ADDRESS
                                </label>
                                <input 
                                    id="email" 
                                    name="email" 
                                    type="email" 
                                    className="signin-input" 
                                />
                            </div>
                            {state?.zoderrors?.email && <p className="text-body-sm text-error">{state.zoderrors.email}</p>}
                            <div>
                                <label htmlFor="password" className="signin-label">
                                    CREDENTIAL KEY
                                </label>
                                <input 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    className="signin-input" 
                                />
                            </div>
                            {state?.zoderrors?.password && <p className="text-body-sm text-error">{state.zoderrors.password}</p>}
                            {state?.error && <p className="text-body-sm text-error">{state.error}</p>}
                            <button type="submit" className="bg-primary-container hover:opacity-90 font-semibold py-3 rounded-lg">
                                Sign in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    </>);
};

export default Page;