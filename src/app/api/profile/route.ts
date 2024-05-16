import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    if (!location) {
        return NextResponse.json({ error: 'Location is required' }, { status: 400 });
    }

    try {
        const response = await axios.get(`https://api.github.com/search/users?q=location:${location}`);
        return NextResponse.json(response.data.items, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
