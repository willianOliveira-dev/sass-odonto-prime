"use client";
import logoOdonto from "../../../../../../../public/foto1.png";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { ChangeEvent, useState } from "react";
import { CloudUpload, ImageUp } from "lucide-react";
import { toast } from "sonner";
import { updateImageProfile } from "../../_actions/update-image-profile";
import { useSession } from "next-auth/react";

interface AvatarProfileProps {
    avatarUrl: string | null;
    alt: string;
    userId: string;
}

export function AvatarProfile({ avatarUrl, alt, userId }: AvatarProfileProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(avatarUrl);
    const [loading, setLoading] = useState<boolean>(false);
    const { update } = useSession();

    const handleUploadImage = async (image: File) => {
        toast("Estamos enviando sua imagem...", {
            icon: <CloudUpload className="w-5 h-5" />,
        });

        const formData = new FormData();
        formData.append("file", image);
        formData.append("userId", userId);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/image/upload`,
                {
                    method: "POST",
                    body: formData,
                },
            );

            const imageUrl = await response.json();

            return imageUrl.url;
        } catch (error) {
            console.log(error);
            toast.error("Falha ao salvar imagem.");
            return avatarUrl;
        }
    };

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLoading(true);
            const MAX_SIZE = 10 * 1024 * 1024; // 10 MB - > 1024 bytes (KB) * 1024 kilobytes (MB)
            const imagePath = e.target.files[0];

            if (
                imagePath.type !== "image/jpeg" &&
                imagePath.type !== "image/png"
            ) {
                setLoading(false);
                toast.error("Formato de imagem inválido:", {
                    description: "Somente JPEG e PNG são permitidos.",
                    richColors: true,
                    duration: 6000,
                });
                return;
            }

            if (imagePath.size > MAX_SIZE) {
                (setLoading(false),
                    toast.error("O tamanho da imagem muito grande:", {
                        description:
                            "O tamanho da imagem deve ser menor que 10 MB.",
                        richColors: true,
                        duration: 6000,
                    }));

                return;
            }

            const newFileName = userId;

            const image = new File([imagePath], newFileName, {
                type: imagePath.type,
            });

            const imageUrl = await handleUploadImage(image);

            if (!imageUrl) {
                setLoading(false);
                toast.error("Falha ao carregar a imagem:", {
                    description: "Tente novamente mais tarde.",
                    richColors: true,
                    duration: 6000,
                });
                return;
            }

            const res = await updateImageProfile(imageUrl);

            if (res.error) {
                setLoading(false);
                toast.error("Falha ao salvar imagem:", {
                    description: res.error,
                    richColors: true,
                    duration: 6000,
                });
                return;
            }

            if (res.data) {
                setPreviewImage(imageUrl);

                await update({
                    image: imageUrl,
                });

                toast.success(res.data);
            }

            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center">
            <div className="flex justify-center items-center bg-gradient-to-tr from-lime-400 via-emerald-500 to-sky-500 rounded-full h-42 w-42 shadow-xl">
                <div className="relative h-40 w-40 overflow-hidden rounded-full bg-gray-200">
                    <div className="relative size-full z-20">
                        <span className="absolute flex items-center justify-center top-1/2 p.0.5 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white/50 rounded-full shadow-2xl w-10 h-10">
                            {loading ? (
                                <Spinner />
                            ) : (
                                <ImageUp className="text-black/40" />
                            )}
                        </span>

                        <input
                            type="file"
                            onChange={handleChange}
                            className="opacity-0 size-full cursor-pointer"
                        />
                    </div>

                    {previewImage ? (
                        <Image
                            src={previewImage}
                            className="object-cover"
                            alt={alt}
                            fill
                            quality={100}
                            priority
                            sizes="(max-width: 480px): 100vh, (max-width: 1024px) 75vw, 60w"
                        />
                    ) : (
                        <Image
                            src={logoOdonto}
                            alt={alt}
                            className="object-cover"
                            fill
                            quality={100}
                            priority
                            sizes="(max-width: 480px): 100vh, (max-width: 1024px) 75vw, 60w"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
