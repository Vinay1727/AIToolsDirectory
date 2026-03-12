import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, websiteUrl, category, email, logoUrl, listingType } = body;

        // 1. Insert into submissions table
        const { data: submission, error: subError } = await supabase
            .from('submissions')
            .insert([
                {
                    tool_name: name,
                    description: description,
                    website_url: websiteUrl,
                    category: category,
                    email: email,
                    logo_url: logoUrl || null,
                    status: 'pending',
                    listing_type: listingType || 'free',
                    payment_status: listingType === 'featured' ? 'pending' : 'n/a'
                }
            ])
            .select()
            .single();

        if (subError) throw subError;

        // 2. If featured, create Lemon Squeezy Checkout
        if (listingType === 'featured') {
            const LS_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
            const LS_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;
            const LS_VARIANT_ID = process.env.LEMONSQUEEZY_VARIANT_ID;

            if (!LS_API_KEY || !LS_VARIANT_ID) {
                throw new Error('Lemon Squeezy configuration is missing. Please contact admin.');
            }

            const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    'Authorization': `Bearer ${LS_API_KEY}`
                },
                body: JSON.stringify({
                    data: {
                        type: 'checkouts',
                        attributes: {
                            checkout_data: {
                                email: email,
                                custom: {
                                    submission_id: submission.id
                                }
                            }
                        },
                        relationships: {
                            store: {
                                data: { type: 'stores', id: LS_STORE_ID }
                            },
                            variant: {
                                data: { type: 'variants', id: LS_VARIANT_ID }
                            }
                        }
                    }
                })
            });

            const checkout = await response.json();

            if (!response.ok) {
                console.error('Lemon Squeezy Error:', checkout);
                throw new Error('Failed to create checkout session');
            }

            return NextResponse.json({
                message: 'Featured submission created',
                checkoutUrl: checkout.data.attributes.url
            });
        }

        return NextResponse.json({ message: 'Submission successful' });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
