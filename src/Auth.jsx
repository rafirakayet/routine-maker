import React, { useState } from 'react';
    import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

    function Auth() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [isSignup, setIsSignup] = useState(false);

      const handleSubmit = async () => {
        const auth = getAuth();
        try {
          if (isSignup) {
            await createUserWithEmailAndPassword(auth, email, password);
          } else {
            await signInWithEmailAndPassword(auth, email, password);
          }
          alert(isSignup ? 'Account created!' : 'Logged in!');
        } catch (error) {
          alert(`Error: ${error.message}`);
        }
      };

      return (
        <div className="p-4 space-y-4 bg-white border rounded max-w-md mx-auto mt-10">
          <h2 className="text-lg font-semibold">{isSignup ? 'Sign Up' : 'Log In'}</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-2 py-1 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-2 py-1 border rounded"
          />
          <button className="w-full bg-blue-600 text-white px-3 py-1 rounded" onClick={handleSubmit}>
            {isSignup ? 'Sign Up' : 'Log In'}
          </button>
          <button className="w-full bg-gray-300 px-3 py-1 rounded" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Switch to Log In' : 'Switch to Sign Up'}
          </button>
        </div>
      );
    }

    export default Auth;