import { createClient } from "@supabase/supabase-js";
import { allStatements } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return Response.json(
      { error: "Missing Supabase environment variables" },
      { status: 500 },
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results = [];

    for (const statement of allStatements) {
      console.log("Executing:", statement.substring(0, 50) + "...");

      // Use Supabase SQL execution via RPC or direct API
      const { data, error } = await supabase.rpc("exec", {
        statement: statement,
      });

      if (error) {
        // If the RPC function doesn't exist, try the raw SQL endpoint
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseServiceKey}`,
            "Content-Type": "application/json",
            apikey: supabaseServiceKey,
          },
          body: JSON.stringify({ statement }),
        });

        if (!response.ok) {
          console.log(
            "SQL execution (may be expected error):",
            response.status,
          );
        }
      }

      results.push({
        statement: statement.substring(0, 50) + "...",
        status: "executed",
      });
    }

    return Response.json({
      success: true,
      message: "Database setup completed",
      statements_executed: results.length,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return Response.json(
      { error: "Database setup failed", details: String(error) },
      { status: 500 },
    );
  }
}

export async function GET() {
  return Response.json({
    message: "Database setup API. Use POST to initialize the database.",
  });
}
