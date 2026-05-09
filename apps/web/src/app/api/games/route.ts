import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials in environment');
      return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Using service role key to bypass potential RLS and confirm if game data exists
    const { data, error, count } = await supabase
      .from('documents')
      .select('id', { count: 'exact' })
      .limit(1);

    if (error) {
      console.error('Supabase error in /api/games:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const uniqueGames: string[] = [];
    
    // Logic: If documents exist, we have active experts.
    // Based on current project config, any data present is for Stardew Valley.
    if ((count !== null && count > 0) || (data && data.length > 0)) {
      uniqueGames.push('Stardew Valley');
    }

    return NextResponse.json(uniqueGames);
  } catch (err) {
    console.error('Unhandled error in /api/games:', err);
    return NextResponse.json([], { status: 500 });
  }
}
