import { supabaseAdmin } from '@/lib/supabaseServer'; 
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId, role } = await req.json();
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ role: role === 'admin' ? 'user' : 'admin' })
      .eq('id', userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, data }, { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
