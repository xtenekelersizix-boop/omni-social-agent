# omni-social-agent

Omni social media automation POC — LLM-driven content generation, TTS, image/video assembly and upload templates for YouTube Shorts, Instagram Reels, TikTok.

This repository is a proof-of-concept designed to run with zero or minimal cost using free services and local fallbacks. It creates short videos from a topic title using one of these flows:

- (preferred) Hugging Face / local LLM → script
- (fallback) local template script generator (no API key needed)

Audio generation:
- If you provide COQUI_TTS_URL (local Coqui TTS server), the system will call it to synthesize speech.
- If not provided, the system will generate a silent audio placeholder using ffmpeg so you can still build videos.

Images:
- If you provide UNSPLASH_ACCESS_KEY, the system will fetch royalty-free images from Unsplash.
- If not provided, it will download placeholder images from picsum.photos (no key required).

Video assembly: uses ffmpeg (docker or host install).

Quick links:
- Repo: https://github.com/xtenekelersizix-boop/omni-social-agent

Minimum requirements (zero- or low-cost setup)
- Docker & Docker Compose (recommended) OR Node.js 18+ & ffmpeg installed
- Git

Quickstart (local, minimal):
1) Clone
   git clone https://github.com/xtenekelersizix-boop/omni-social-agent.git
   cd omni-social-agent
2) Copy env
   cp .env.example .env
   Edit .env to set any keys you have (optional)
3) Start with Docker Compose (recommended):
   docker compose up --build
4) Generate a sample video:
   node scripts/generate_and_render.js --topic "günlük pazarlama tüyosu #1"

Outputs will be in the out/ directory (final.mp4 + metadata.json).

Next steps to enable platform uploads
- I will provide upload scripts (YouTube/Instagram/TikTok) after you create OAuth credentials. For full automation we will not store your raw passwords; tokens go into your environment.

Security & policy notes
- Do not share account passwords in plain text. Use OAuth flows and store secrets in your machine or a secret manager.
- Use royalty-free media or properly licensed content.

If you want, I can continue and add the upload scripts, analytics collection, and a web dashboard. For now this POC focuses on content generation + render with zero mandatory paid services.
