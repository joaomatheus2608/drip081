export default function handler(req, res) {
  // Lê estritamente das variáveis de ambiente configuradas no painel da Vercel
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      error: "Variáveis SUPABASE_URL e SUPABASE_KEY não foram encontradas no ambiente da Vercel."
    });
  }

  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
  res.status(200).json({
    supabaseUrl,
    supabaseKey
  });
}
