// import { NextResponse } from 'next/server';import { FieldValue } from 'firebase-admin/firestore';import { adminDb } from '@/lib/firebase-admin';
// export async function GET(request: Request){try{if(!process.env.PAYSTACK_SECRET_KEY)return NextResponse.json({error:'Paystack is not configured.'},{status:500});const reference=new URL(request.url).searchParams.get('reference');if(!reference)return NextResponse.json({error:'Missing payment reference.'},{status:400});const response=await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,{headers:{Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`},cache:'no-store'});const data=await response.json();if(!response.ok||data.data?.status!=='success')return NextResponse.json({error:'Payment was not successful.'},{status:400});const tx=data.data;const metadata=tx.metadata||{};const existing=await adminDb.collection('orders').where('paymentReference','==',reference).limit(1).get();if(existing.empty){await adminDb.collection('orders').add({userId:metadata.userId,email:tx.customer?.email,items:metadata.items||[],subtotal:metadata.subtotal||0,shipping:metadata.shipping||0,total:(metadata.total||tx.amount/100),status:'processing',paymentStatus:'paid',paymentReference:reference,shippingAddress:{name:metadata.name||'',phone:metadata.phone||'',address:metadata.address||'',city:metadata.city||''},createdAt:FieldValue.serverTimestamp()});}return NextResponse.json({ok:true});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Unable to verify payment.'},{status:500});}}


import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Transaction reference is required" },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack secret key is missing" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        reference
      )}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return NextResponse.json(
        {
          error:
            data.message ||
            "Unable to verify transaction",
        },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json({
      status: data.data.status,
      reference: data.data.reference,
      amount: data.data.amount,
      currency: data.data.currency,
      customer: data.data.customer,
    });
  } catch (error) {
    console.error(
      "Paystack verification error:",
      error
    );

    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}