import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { id } = await req.json();

        // 1. Get the submission
        const { data: submission, error: fetchError } = await supabase
            .from('submissions')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !submission) throw new Error('Submission not found');

        // 2. Insert into tools
        const { error: insertError } = await supabase
            .from('tools')
            .insert([
                {
                    name: submission.tool_name,
                    description: submission.description,
                    website_url: submission.website_url,
                    category: submission.category,
                    logo_url: submission.logo_url
                }
            ]);

        if (insertError) throw insertError;

        // 3. Update status or delete submission
        const { error: deleteError } = await supabase
            .from('submissions')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;

        return NextResponse.json({ message: 'Submission approved and added to directory' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
