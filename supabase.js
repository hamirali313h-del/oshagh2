/* =========================================================
   OSHAGH — SUPABASE
========================================================= */

const SUPABASE_URL =
  "https://imjakeedjogezaujuduf.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_DC8rHyQjyasN4C7y2QbkmA_fmXpr07I";


/* =========================================================
   CONNECTION
========================================================= */

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
    console.error("خطا در دریافت مطالب:", error);
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
    console.error("خطا در دریافت موزیک:", error);
    return [];
  }

  return data || [];
}


/* =========================================================
   ADD POST
========================================================= */

async function addPost(postData) {

  const { data, error } =
    await supabaseClient
      .from("posts")
      .insert([postData])
      .select();

  if (error) {
    console.error("خطا در اضافه کردن مطلب:", error);
    throw error;
  }

  return data;
}


/* =========================================================
   ADD MUSIC
========================================================= */

async function addMusic(musicData) {

  const { data, error } =
    await supabaseClient
      .from("music")
      .insert([musicData])
      .select();

  if (error) {
    console.error("خطا در اضافه کردن موزیک:", error);
    throw error;
  }

  return data;
}


/* =========================================================
   DELETE POST
========================================================= */

async function deletePost(id) {

  const { error } =
    await supabaseClient
      .from("posts")
      .delete()
      .eq("id", id);

  if (error) {
    console.error("خطا در حذف مطلب:", error);
    throw error;
  }

}


/* =========================================================
   DELETE MUSIC
========================================================= */

async function deleteMusic(id) {

  const { error } =
    await supabaseClient
      .from("music")
      .delete()
      .eq("id", id);

  if (error) {
    console.error("خطا در حذف موزیک:", error);
    throw error;
  }

}


/* =========================================================
   UPDATE POST
========================================================= */

async function updatePost(id, postData) {

  const { data, error } =
    await supabaseClient
      .from("posts")
      .update(postData)
      .eq("id", id)
      .select();

  if (error) {
    console.error("خطا در ویرایش مطلب:", error);
    throw error;
  }

  return data;
}


/* =========================================================
   UPDATE MUSIC
========================================================= */

async function updateMusic(id, musicData) {

  const { data, error } =
    await supabaseClient
      .from("music")
      .update(musicData)
      .eq("id", id)
      .select();

  if (error) {
    console.error("خطا در ویرایش موزیک:", error);
    throw error;
  }

  return data;
}


/* =========================================================
   AUTH — CURRENT USER
========================================================= */

async function getCurrentUser() {

  const {
    data: {
      user
    }
  } = await supabaseClient.auth.getUser();

  return user;
}


/* =========================================================
   AUTH — LOGIN
========================================================= */

async function loginAdmin(email, password) {

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

  if (error) {
    console.error("خطا در ورود مدیر:", error);
    throw error;
  }

  return data;
}


/* =========================================================
   AUTH — LOGOUT
========================================================= */

async function logoutAdmin() {

  const { error } =
    await supabaseClient.auth.signOut();

  if (error) {
    console.error("خطا در خروج:", error);
    throw error;
  }

}


/* =========================================================
   AUTH — SESSION CHECK
========================================================= */

async function isAdminLoggedIn() {

  const {
    data: {
      session
    }
  } = await supabaseClient.auth.getSession();

  return !!session;
}


/* =========================================================
   CONNECTION TEST
========================================================= */

async function testSupabaseConnection() {

  const { error } =
    await supabaseClient
      .from("posts")
      .select("id")
      .limit(1);

  if (error) {

    console.error(
      "Supabase connection error:",
      error
    );

    return false;
  }

  console.log(
    "Supabase connection successful."
  );

  return true;
}
