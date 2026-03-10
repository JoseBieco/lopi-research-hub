import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching news:", error);
      return Response.json({ error: "Failed to fetch news" }, { status: 500 });
    }

    return Response.json(data || []);
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !user.user_metadata?.is_admin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.from("news").insert([body]).select();

    if (error) {
      console.error("Error:", error);
      return Response.json({ error: "Failed" }, { status: 500 });
    }

    return Response.json(data?.[0], { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
