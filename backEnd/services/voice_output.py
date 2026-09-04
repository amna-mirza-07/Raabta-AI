import os
import edge_tts
import asyncio


async def generate_voice(text):

    output = os.path.join("/tmp", "voice_reply.mp3") if os.environ.get("VERCEL") else "voice_reply.mp3"

    communicate = edge_tts.Communicate(
        text,
        "ur-PK-UzmaNeural"
    )

    await communicate.save(output)

    return output



def text_to_speech(text):

    return asyncio.run(
        generate_voice(text)
    )