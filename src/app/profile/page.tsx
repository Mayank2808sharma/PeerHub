'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import { Alert } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface Profile {
    id: number;
    login: string;
    bio: string | null;
    html_url: string;
    avatar_url: string;
}

export default function Home() {
    const [location, setLocation] = useState<string>('');
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const loader = useRef<HTMLDivElement | null>(null);

    const getProfiles = async (reset = false) => {
        if (!location) {
            setError('Location is required');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<Profile[]>(`/api/profile?location=${location}&page=${page}&per_page=10`);
            const newProfiles = response.data;

            setProfiles(prev => {
                const profileSet = new Set(prev.map(profile => profile.id));
                const uniqueProfiles = newProfiles.filter(profile => !profileSet.has(profile.id));
                return reset ? uniqueProfiles : [...prev, ...uniqueProfiles];
            });

            if (newProfiles.length === 0) setHasMore(false);
        } catch (error: any) {
            setError(error.message || 'Error fetching profiles. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleObserver = (entities: IntersectionObserverEntry[]) => {
        const target = entities[0];
        if (target.isIntersecting && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (page > 1) {
            getProfiles();
        }
    }, [page]);

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) observer.observe(loader.current);
        return () => {
            if (loader.current) observer.unobserve(loader.current);
        };
    }, [loader, hasMore]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">PeerHub Finder</h1>
            <div className="mb-4">
                <Input
                    value={location}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                    placeholder="Enter location"
                />
                <Button onClick={() => { setPage(1); setHasMore(true); getProfiles(true); }} className="ml-2">Search</Button>
            </div>

            {error && <Alert variant="destructive">{error}</Alert>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.map((profile) => (
                    <Card key={profile.id}>
                        <CardHeader>
                            <div className="flex items-center">
                                <img src={profile.avatar_url} alt={`${profile.login} avatar`} className="w-12 h-12 rounded-full mr-4" />
                                <h2 className="text-xl font-bold">{profile.login}</h2>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{profile.bio}</p>
                            <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                View Profile
                            </a>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div ref={loader}>
                {loading && <p>Loading more profiles...</p>}
                {!hasMore && <p>No more profiles</p>}
            </div>
        </div>
    );
}
