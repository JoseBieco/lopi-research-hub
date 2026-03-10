import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("name_pt", { ascending: true });

    if (error) {
      console.error("Error fetching members:", error);
      return Response.json(
        { error: "Failed to fetch members" },
        { status: 500 },
      );
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

    // Check authorization
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.user_metadata?.is_admin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("members")
      .insert([body])
      .select();

    if (error) {
      console.error("Error creating member:", error);
      return Response.json(
        { error: "Failed to create member" },
        { status: 500 },
      );
    }

    return Response.json(data?.[0], { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
