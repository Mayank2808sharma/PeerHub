import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface Profile {
    id: number;
    login: string;
    bio: string | null;
    html_url: string;
    avatar_url: string;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '30';

    if (!location) {
        return NextResponse.json({ error: 'Location is required' }, { status: 400 });
    }

    try {
        const response = await axios.get(`https://api.github.com/search/users?q=location:${location}&page=${page}&per_page=${perPage}`);
        const profiles: Profile[] = response.data.items.map((profile: any) => ({
            id: profile.id,
            login: profile.login,
            bio: profile.bio,
            html_url: profile.html_url,
            avatar_url: profile.avatar_url,
        }));


        return NextResponse.json(profiles, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to fetch profiles' }, { status: 500 });
    }
}
