'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '../lib/api';

export default function BrandBriefPage() {
    const router = useRouter();

    const handleStart = async () => {
        const projectId = await createProject();
        router.push(`/brand-brief/${projectId}`);
    };

    return (
        <div>
            <h1>Brand Brief</h1>
            <button onClick={handleStart}>Start</button>
        </div>
    );
}
