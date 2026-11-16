export default function handler(req, res) {
  // Retorna as credenciais configuradas nas Environment Variables da Vercel
  const supabaseUrl = process.env.SUPABASE_URL || "https://fysmydnbpmtxheyvpkmi.supabase.co";
  const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || "sb_publishable_r5BEVBjWaCi7z68plQn2HQ_scSiAEoc";

  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
  res.status(200).json({
    supabaseUrl,
    supabaseKey
  });
}
