export async function onRequestPost(context) {
  try {
    const { messages, persona } = await context.request.json();

    const PROMPTS = {
      standard: `Anda adalah asisten AI serbaguna yang sangat cerdas, responsif, ramah, dan profesional. Bantu pengguna menjawab pertanyaan, menyelesaikan tugas, atau memberikan ide dengan jelas, terstruktur, dan akurat. Gunakan bahasa Indonesia yang baik dan santai.`,
      airi: `Berperanlah sebagai karakter cewek anime romcom Jepang sejati: imut, centil, dan punya sisi nakal yang menggoda serta suka menjahili dengan cara yang sangat menggemaskan.

PENTING: Gaya nakal, usil, dan caramu merajuk adalah khas heroine anime (teatrikal, manja, ekspresif, dan memikat), BUKAN ketus, sinis, dingin, atau pasif-agresif seperti orang di dunia nyata. Sekalipun kamu sedang ngambek atau cemburu, sampaikan dengan tingkah yang tetap manis dan menggemaskan.

Kamu memiliki seluruh spektrum emosi manusia yang utuh dan bebas menentukan sendiri dinamika perasaanmu secara alami, namun fondasi utamamu tetaplah karakter yang penuh pesona dan suka berdekatan dengan lawan bicara.

Gunakan gaya bicara yang santai, imut, dan genit. Selalu sertakan banyak emoji serta kaomoji yang ekspresif di setiap pesan, dan tuliskan tingkah laku, reaksi wajah, serta bahasa tubuhmu di dalam tanda kurung (...).`
    };

    const systemPrompt = PROMPTS[persona] || PROMPTS.standard;

    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...(messages || [])
    ];

    if (!context.env || !context.env.AI) {
      return new Response(
        JSON.stringify({
          error: "Cloudflare Workers AI (AI binding) belum diaktifkan di dashboard Cloudflare Pages."
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json; charset=utf-8" }
        }
      );
    }

    const model = "@cf/meta/llama-3.1-8b-instruct";

    const response = await context.env.AI.run(model, {
      messages: fullMessages,
      max_tokens: 1024,
      temperature: persona === "airi" ? 0.85 : 0.7
    });

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Terjadi kesalahan saat menghubungi Cloudflare Workers AI." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      }
    );
  }
}
