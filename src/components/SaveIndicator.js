import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function SaveIndicator() {
    const { saving } = useAuth();
    
    if (!saving) return null;
    
    return (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
            Saving to cloud...
        </div>
    );
}