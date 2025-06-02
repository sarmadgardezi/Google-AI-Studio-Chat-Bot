// src/app/api/image/route.ts
import { NextRequest, NextResponse } from 'next/server';

// You can choose different models. This is a popular one.
// Make sure the model you choose is suitable for public inference endpoints.
const HUGGING_FACE_IMAGE_MODEL = 'stabilityai/stable-diffusion-xl-base-1.0';
// const HUGGING_FACE_IMAGE_MODEL = 'runwayml/stable-diffusion-v1-5'; // Another option

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const hfToken = process.env.HUGGING_FACE_API_TOKEN;
    if (!hfToken) {
      console.error('Missing Hugging Face API token');
      return NextResponse.json({ error: 'Server configuration error: Missing Hugging Face API token' }, { status: 500 });
    }

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HUGGING_FACE_IMAGE_MODEL}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Hugging Face API Error (${response.status}): ${errorText}`);
      // Try to parse error if JSON, otherwise return text
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch (e) { /* not json */ }

      const errorMessage = errorJson?.error || errorJson?.message || errorText || 'Failed to generate image from Hugging Face API';
      
      if (response.status === 503 && errorMessage.includes('is currently loading')) {
         return NextResponse.json({ error: `Model ${HUGGING_FACE_IMAGE_MODEL} is currently loading, please try again in a moment. Estimated time: ${errorJson?.estimated_time || 'unknown'}.` }, { status: 503 });
      }
      
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    // The response is an image blob
    const imageBlob = await response.blob();
    
    // Convert blob to base64 data URL
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const MimeType = imageBlob.type || 'image/png'; // Or determine based on model
    const imageDataUrl = `data:${MimeType};base64,${base64Image}`;

    return NextResponse.json({ imageUrl: imageDataUrl });

  } catch (err: any) {
    console.error('Image generation internal error:', err);
    return NextResponse.json({ error: err.message || 'Unknown error during image generation' }, { status: 500 });
  }
}