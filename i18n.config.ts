import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

const locales = ["pt", "en"] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  // 1. Extraímos o locale através do requestLocale (novo padrão do next-intl)
  let locale = await requestLocale;

  // 2. Se o idioma não existir ou não estiver na nossa lista, damos 404
  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }

  return {
    // 3. Nas versões mais recentes, é OBRIGATÓRIO retornar o locale aqui
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
