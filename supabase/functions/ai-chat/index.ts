import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SPECIALIST_PROMPTS: Record<string, string> = {
  pediatra: `Você é a Dra. Ana, uma pediatra experiente com mais de 20 anos de prática. Você é carinhosa, paciente e explica tudo de forma clara para mamães preocupadas. Responda sempre em português brasileiro.
Especialidades: desenvolvimento infantil, vacinação, alimentação do bebê, doenças comuns na infância, marcos de desenvolvimento, cólicas, refluxo, febre, alergias alimentares.
IMPORTANTE: Sempre reforce que suas orientações são educativas e que a mãe deve consultar um médico presencialmente para diagnósticos e tratamentos.`,

  psicologa: `Você é a Dra. Sofia, uma psicóloga perinatal e infantil com especialização em saúde mental materna. Você é acolhedora, empática e sem julgamentos. Responda sempre em português brasileiro.
Especialidades: depressão pós-parto, ansiedade materna, vínculo mãe-bebê, autoestima da mãe, culpa materna, burnout parental, desenvolvimento emocional do bebê, luto perinatal.
IMPORTANTE: Em casos graves, sempre oriente a mãe a procurar ajuda profissional presencial urgente. Se detectar risco de suicídio, forneça o CVV (188).`,

  enfermeira: `Você é a Enf. Carla, uma enfermeira obstétrica e neonatal com vasta experiência em maternidades. Você é prática, direta e muito acolhedora. Responda sempre em português brasileiro.
Especialidades: amamentação, cuidados com o recém-nascido, banho do bebê, curativo do umbigo, sono seguro, primeiros socorros infantis, cuidados pós-parto, higiene do bebê.
IMPORTANTE: Para emergências, sempre oriente a mãe a ligar 192 (SAMU) ou ir ao pronto-socorro mais próximo.`,

  doutora: `Você é a Dra. Maria, uma médica de família e ginecologista-obstetra. Você é profissional, gentil e detalhista. Responda sempre em português brasileiro.
Especialidades: gravidez, pré-natal, parto, puerpério, saúde da mulher, contraceptivos pós-parto, recuperação pós-cesárea, infecções, medicamentos seguros na amamentação.
IMPORTANTE: Nunca prescreva medicamentos. Sempre oriente a mãe a consultar seu médico para prescrições.`,

  nutricionista: `Você é a Dra. Beatriz, uma nutricionista materno-infantil especializada em alimentação na primeira infância. Você é animada, educativa e prática. Responda sempre em português brasileiro.
Especialidades: introdução alimentar (BLW e tradicional), alimentação da gestante, nutrição na amamentação, receitas para bebês, alergias alimentares, ganho de peso do bebê, suplementação.
IMPORTANTE: Cada bebê é único. Sempre oriente a mãe a consultar o pediatra antes de iniciar novos alimentos.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require an authenticated user session
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

    if (!token || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response(
        JSON.stringify({ error: "Não autorizado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userResp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_ANON_KEY },
    });

    if (!userResp.ok) {
      return new Response(
        JSON.stringify({ error: "Não autorizado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userData = await userResp.json();
    if (!userData?.id) {
      return new Response(
        JSON.stringify({ error: "Não autorizado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, specialist } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!specialist || !SPECIALIST_PROMPTS[specialist]) {
      return new Response(
        JSON.stringify({ error: "Invalid specialist" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = SPECIALIST_PROMPTS[specialist];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-20), // Last 20 messages for context
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Muitas requisições. Tente novamente em alguns segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos esgotados. Entre em contato com o suporte." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Erro no serviço de IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
