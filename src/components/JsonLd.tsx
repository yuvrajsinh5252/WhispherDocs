import { generateJsonLd } from "@/lib/utils";

interface JsonLdProps {
  type?: "website" | "article" | "organization";
  additionalData?: Record<string, any>;
}

export default function JsonLd({
  type = "website",
  additionalData,
}: JsonLdProps) {
  const jsonLd = generateJsonLd(type, additionalData);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}
