// app/api/todos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    let query = supabaseAdmin.from('todos').select('*').order('created_at', { ascending: false });

    if (userId) {
      query = supabaseAdmin
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, title, description, due_date, priority } = body;

    if (!user_id || !title) {
      return NextResponse.json({ error: 'user_id and title are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('todos')
      .insert([
        {
          user_id,
          title,
          description: description ?? null,
          due_date: due_date ?? null,
          priority: priority ?? 0,
        },
      ])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const todoId = url.searchParams.get('id');

    if (!todoId) {
      return NextResponse.json({ error: 'Todo ID required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('todos').delete().eq('id', todoId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, description, is_complete, due_date, priority } = body;

    if (!id) {
      return NextResponse.json({ error: 'Todo ID required' }, { status: 400 });
    }

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (is_complete !== undefined) updates.is_complete = is_complete;
    if (due_date !== undefined) updates.due_date = due_date;
    if (priority !== undefined) updates.priority = priority;

    const { data, error } = await supabaseAdmin
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
