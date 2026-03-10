import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !user.user_metadata?.is_admin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase.from("tools").delete().eq("id", id);

    if (error) {
      console.error("Error:", error);
      return Response.json({ error: "Failed" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
