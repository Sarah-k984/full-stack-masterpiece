import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY is not set');
    }

    const demoScript = `
      Welcome to Ujuzi Skills, the revolutionary e-learning platform designed specifically for rural communities. 

      Are you ready to transform your life through digital education? At Ujuzi Skills, we believe that everyone deserves access to quality education, regardless of their location.

      Our platform offers interactive live classes where you can learn directly from expert instructors. Whether you want to develop digital literacy, learn new technical skills, or pursue professional development, we have courses tailored for your needs.

      With over 500 students already enrolled and a 95% success rate, Ujuzi Skills is bridging the digital divide one student at a time. Our courses are designed to be practical and applicable to rural contexts, ensuring that what you learn can be immediately implemented in your daily life.

      What makes us special? We provide lifetime access to course materials, certificates of completion, and most importantly, a supportive community of learners just like you. Many of our courses are completely free, because we believe education should be accessible to everyone.

      Join the hundreds of students who have already transformed their lives through digital education. From basic computer skills to advanced technical training, from entrepreneurship to agricultural technology, we have the tools you need to succeed.

      Don't let distance be a barrier to your dreams. With Ujuzi Skills, quality education is just a click away. Our mobile-friendly platform works on any device, so you can learn whenever and wherever it's convenient for you.

      Take the first step towards a brighter future. Enroll today and discover how digital education can unlock new opportunities for you and your community. Your journey to success starts here, at Ujuzi Skills.

      Click the enroll button now and join our growing community of lifelong learners. Together, we're building a more connected and educated world, one student at a time.
    `;

    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: demoScript,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioData = await response.arrayBuffer();
    
    return new Response(audioData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioData.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Error generating speech:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});