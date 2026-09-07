/**
 * generate_script.js
 *
 * Minimal script generator. If HF_API_KEY is set, it will call Hugging Face text-generation.
 * Otherwise it uses a simple local template.
 */

const fs = require('fs');
const fetch = require('node-fetch');

async function generate(topic, lang='tr') {
  const hfKey = process.env.HF_API_KEY;
  if (hfKey) {
    // call HF inference (text-generation) - this is optional and will fail without key
    const url = 'https://api-inference.huggingface.co/models/gpt2';
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${hfKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: `Kısa video için başlık: ${topic}\nBir akış oluştur ve 3 kısa sahne yaz.` })
    });
    const data = await resp.json();
    if (Array.isArray(data)) return data[0].generated_text;
    if (data.error) throw new Error('HF error: ' + data.error);
    return JSON.stringify(data);
  } else {
    // fallback simple template in Turkish
    const out = `Konu: ${topic}\n\n1) Hızlı giriş: ${topic} hakkında 1 cümle.\n2) 3 pratik nokta:\n - Nokta 1: Bir ipucu\n - Nokta 2: Uygulanabilir öneri\n - Nokta 3: Çağrı-işlem (CTA): takip et / linke tıkla\n\nKapanış: Kısa özet ve CTA.`;
    return out;
  }
}

module.exports = { generate };
