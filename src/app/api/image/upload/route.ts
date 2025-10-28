import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY, // Click 'View API Keys' above to copy your API secret
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const MAX_SIZE = 1024 * 1024 * 10;
  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  if (!userId) {
    return NextResponse.json(
      { error: "Falha ao alterar imagem." },
      { status: 400 },
    );
  }

  if (file.type !== "image/jpeg" && file.type !== "image/png") {
    return NextResponse.json(
      { error: "Formato de imagem inválido." },
      {
        status: 400,
      },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      {
        error: "Tamanho de imagem muito grande.",
      },
      {
        status: 400,
      },
    );
  }

  const results = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          tags: [userId],
          public_id: file.name,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        },
      )
      .end(buffer);
  });

  const { secure_url } = results as any;
  
  return NextResponse.json({ url: secure_url });
}
