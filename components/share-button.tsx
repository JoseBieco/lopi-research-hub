"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  title: string;
  label: string;
}

export function ShareButton({ title, label }: ShareButtonProps) {
  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}
