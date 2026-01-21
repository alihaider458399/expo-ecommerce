import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
const App = () => {
    return (
        <div>
            <h1>Home page</h1>
            <header>
                <SignedOut>
                    <SignInButton mode="modal"/>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </header>
        </div>
    )
}
export default App
