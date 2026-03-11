import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const locales = ["pt", "en"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = useTranslations();

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex flex-col min-h-screen">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-black focus:text-white focus:p-2 focus:rounded"
        >
          {t("skip_main_content")}
        </a>
        <Header />
        {children}
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
