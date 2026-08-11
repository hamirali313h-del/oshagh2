/* =========================================================
   OSHAGH — SUPABASE CONNECTION
========================================================= */

const SUPABASE_URL =
  "https://YOUR-PROJECT-ID.supabase.co";

const SUPABASE_ANON_KEY =
  "YOUR-ANON-KEY";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );


/* =========================================================
   GET POSTS
========================================================= */

async function getPosts() {

  const { data, error } =
    await supabaseClient
      .from("posts")
      .select("*")
      .order("created_at", {
        ascending: false
      });

  if (error) {
    console.error(
      "Posts error:",
      error
    );

    return [];
  }

  return data || [];
}


/* =========================================================
   GET MUSIC
========================================================= */

async function getMusic() {

  const { data, error } =
    await supabaseClient
      .from("music")
      .select("*")
      .order("created_at", {
        ascending: false
      });

  if (error) {
    console.error(
      "Music error:",
      error
    );

    return [];
  }

  return data || [];
}
