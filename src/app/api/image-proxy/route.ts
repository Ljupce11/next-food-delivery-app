import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get("url");

  if (!imageUrl || typeof imageUrl !== "string") {
    return NextResponse.json({ error: "Image URL is required and must be a string" }, { status: 400 });
  }

  try {
    const decodedUrl = decodeURIComponent(imageUrl);

    // Fetch the image from the third-party URL
    const response = await fetch(decodedUrl);

    if (!response.ok) {
      console.error(`Failed to fetch image. HTTP status: ${response.status}`);
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.startsWith("image")) {
      return NextResponse.json({ error: "The provided URL does not point to a valid image" }, { status: 400 });
    }

    // Set headers for the image response
    const imageBuffer = await response.arrayBuffer();
    return new NextResponse(Buffer.from(imageBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "s-maxage=31536000, stale-while-revalidate",
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching image:", error);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
