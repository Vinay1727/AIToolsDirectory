import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-signature') || '';
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

        // 1. Verify Signature
        const hmac = crypto.createHmac('sha256', secret);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signatureBuffer = Buffer.from(signature, 'utf8');

        if (signatureBuffer.length !== digest.length || !crypto.timingSafeEqual(signatureBuffer, digest)) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const body = JSON.parse(rawBody);
        const eventName = body.meta.event_name;
        const customData = body.meta.custom_data;

        // 2. Handle Payment Success
        if (eventName === 'order_created' || eventName === 'order_paid') {
            const submissionId = customData.submission_id;
            const orderId = body.data.id;

            if (submissionId) {
                // Update submission status
                const { data: submission, error: updateError } = await supabase
                    .from('submissions')
                    .update({
                        payment_status: 'paid',
                        lemonsqueezy_order_id: orderId,
                        status: 'paid_pending_review' // Admin will review and move to tools
                    })
                    .eq('id', submissionId)
                    .select()
                    .single();

                if (updateError) throw updateError;

                console.log(`Payment confirmed for submission: ${submissionId}`);
            }
        }

        return NextResponse.json({ message: 'Webhook processed' });
    } catch (error: any) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
