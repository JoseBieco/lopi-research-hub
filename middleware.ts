import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware({
  locales: ["pt", "en"],
  defaultLocale: "pt",
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Verifica se a rota é admin ou api (não precisa de tradução)
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    const baseResponse = NextResponse.next({ request });
    return await updateSession(request, baseResponse);
  }

  // 2. Para o site público, gera o redirecionamento de idioma (/pt ou /en)
  const i18nResponse = intlMiddleware(request);

  // 3. Passa a resposta para o Supabase validar o login
  return await updateSession(request, i18nResponse);
}

export const config = {
  matcher: [
    // Captura todas as rotas para o middleware avaliar, ignorando ficheiros estáticos
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
