'use client'
import React, { useState } from 'react'

export default function page() {

    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const handleClick = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/gemini')
            const data = await res.json()
            setResponse(data.text)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <button onClick={handleClick} disabled={loading}>
                {loading ? 'טוען...' : 'שלח שאלה ל-Gemini'}
            </button>

            {response && (
                <div>
                    <h3>תשובה:</h3>
                    <p>{response}</p>
                </div>
            )}
        </div>
    )
}


