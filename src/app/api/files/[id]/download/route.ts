import { authenticateUser, validateAndGetFile } from "@/lib/chat-api/auth";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { user, error: authError } = await authenticateUser();
  if (authError) return authError;

  const { id } = params;
  const { file, error: fileError } = await validateAndGetFile(id, user.id);
  if (fileError) return fileError;

  try {
    const upstream = await fetch(file.url);
    if (!upstream.ok || !upstream.body) {
      return new Response("Failed to fetch file", { status: 502 });
    }

    const filename = file.name || "document.pdf";
    const contentType =
      upstream.headers.get("content-type") || "application/pdf";

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return new Response("Download error", { status: 500 });
  }
};
