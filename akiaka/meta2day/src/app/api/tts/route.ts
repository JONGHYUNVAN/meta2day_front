import { NextResponse } from 'next/server';

function getVoiceForCharacter(characterId: number) {
    switch (characterId) {
        case 1: // Joy - Female
            return { voiceName: 'ko-KR-Neural2-A', prosody: 'pitch="+20%" rate="fast" volume="loud" duration="0.5s"' };
        case 2: // Anger - Male
            return { voiceName: 'ko-KR-Neural2-C', prosody: 'pitch="-120%" rate="fast" volume="x-loud" duration="0.1s"' };
        case 3: // Annoyance - Female
            return { voiceName: 'ko-KR-Neural2-B', prosody: 'pitch="120%" rate="fast" volume="medium" duration="0.1s"' };
        case 4: // Sadness - Female
            return { voiceName: 'ko-KR-Neural2-A', prosody: 'pitch="-30%" rate="x-slow" volume="soft" duration="1s"' };
        case 5: // Fear - Male
            return { voiceName: 'ko-KR-Wavenet-D', prosody: 'pitch="+300%" rate="medium" volume="x-soft" duration="100ms"' };
        default: // Neutral voice
            return { voiceName: 'ko-KR-Neural2-A', prosody: 'pitch="0%" rate="medium" volume="medium" ' };
    }
}

export async function POST(req: Request) {
    const { text, characterId } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TTS_API_KEY;
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    const voiceConfig = getVoiceForCharacter(characterId);

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            input: { ssml: `<speak><prosody ${voiceConfig.prosody}>${text}</prosody></speak>` },
            voice: { languageCode: 'ko-KR', name: voiceConfig.voiceName },
            audioConfig: { audioEncoding: 'MP3' },
        }),
    });

    const data = await response.json();
    return NextResponse.json({ audioContent: data.audioContent });
}
