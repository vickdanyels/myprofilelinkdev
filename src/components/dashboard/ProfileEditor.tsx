"use client";

import { useState } from "react";
import { Card, Button, Input, Switch } from "@/components/ui";
import { updateProfile } from "@/actions/profile";
import { User, Camera, Lock, Sparkles, X } from "lucide-react";

interface Profile {
    id: string;
    displayName: string;
    bio: string | null;
    avatarUrl: string | null;
    username: string;
    removeBranding?: boolean;
    displayPlanFrame?: boolean;
}

interface ProfileEditorProps {
    profile: Profile;
    isPro?: boolean;
    planType?: "FREE" | "PRO" | "DIAMOND";
}

export function ProfileEditor({ profile, isPro = false, planType = "FREE" }: ProfileEditorProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(profile.avatarUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [removeBranding, setRemoveBranding] = useState(profile.removeBranding || false);
    const [displayPlanFrame, setDisplayPlanFrame] = useState(profile.displayPlanFrame || false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create image element to load the file
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                // Calculate new dimensions (max 500px)
                const MAX_SIZE = 500;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                // Resize using canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to consistent JPEG base64
                    const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                    setPreviewUrl(optimizedBase64);
                }

                // Cleanup
                URL.revokeObjectURL(img.src);
            };
        }
    };

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setMessage(null);

        // Append boolean states
        formData.set('removeBranding', String(removeBranding));
        formData.set('displayPlanFrame', String(displayPlanFrame));

        const result = await updateProfile(formData);

        if (result.error) {
            setMessage({ type: "error", text: result.error });
        } else {
            setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
        }

        setIsLoading(false);
        setTimeout(() => setMessage(null), 3000);
    }

    return (
        <Card variant="glass" padding="lg">
            <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-8">
                Informações do Perfil
            </h2>

            {message && (
                <div
                    className={`mb-6 p-4 rounded-xl text-sm ${message.type === "success"
                        ? "bg-[rgb(var(--color-success))]/10 border border-[rgb(var(--color-success))]/30 text-[rgb(var(--color-success))]"
                        : "bg-[rgb(var(--color-error))]/10 border border-[rgb(var(--color-error))]/30 text-[rgb(var(--color-error))]"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <form action={handleSubmit} className="space-y-6">
                {/* Hidden input for Avatar URL (Base64) */}
                <input type="hidden" name="avatarUrl" value={previewUrl || ""} />

                {/* Avatar & Display Name */}
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] flex items-center justify-center overflow-hidden ${displayPlanFrame && (planType === 'DIAMOND' ? 'ring-4 ring-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]' : displayPlanFrame && isPro ? 'ring-4 ring-[rgb(var(--color-primary))] shadow-[0_0_15px_rgba(var(--color-primary),0.6)]' : '')}`}>
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <label
                            htmlFor="avatar-upload"
                            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] flex items-center justify-center text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-primary))] hover:text-white transition-all cursor-pointer shadow-lg"
                        >
                            <Camera className="w-4 h-4" />
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-1.5 ml-1">
                            Nome de exibição
                        </label>
                        <Input
                            name="displayName"
                            placeholder="Seu nome público"
                            defaultValue={profile.displayName}
                            required
                            maxLength={30}
                            className="border-[rgb(var(--color-primary))] shadow-[0_0_15px_-3px_rgb(var(--color-primary)/0.5)] focus:shadow-[0_0_25px_-5px_rgb(var(--color-primary)/0.6)] transition-shadow duration-300"
                        />
                    </div>
                </div>

                <div className="w-full pt-2">
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2 ml-1">
                        Bio
                    </label>
                    <textarea
                        name="bio"
                        rows={3}
                        maxLength={160}
                        defaultValue={profile.bio || ""}
                        placeholder="Conte um pouco sobre você..."
                        className="w-full px-4 py-3 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-muted))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--color-background))] focus:border-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))] transition-all duration-200 resize-none"
                    />
                    <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))] ml-1">
                        Máximo 160 caracteres
                    </p>
                </div>

                {/* Pro Features */}
                <div className="pt-2 space-y-4 border-t border-[rgb(var(--color-border))] mt-6">
                    <h3 className="text-sm font-semibold text-[rgb(var(--color-text-muted))] uppercase tracking-wider !mt-[20px] mb-4 ml-1 text-center">
                        Personalização Pro
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                        {/* Pro Feature: Profile Frame */}
                        <div
                            onClick={() => {
                                if (!isPro) return;
                                const newValue = !displayPlanFrame;
                                setDisplayPlanFrame(newValue);
                                // Auto-save
                                const formData = new FormData();
                                formData.append('displayName', profile.displayName);
                                formData.append('bio', profile.bio || "");
                                formData.append('avatarUrl', previewUrl || "");
                                formData.append('removeBranding', String(removeBranding));
                                formData.append('displayPlanFrame', String(newValue));
                                handleSubmit(formData);
                            }}
                            className={`group relative flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 aspect-square cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${displayPlanFrame && isPro
                                ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/5 shadow-[0_0_15px_-5px_rgb(var(--color-primary)/0.3)]"
                                : "border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] hover:border-[rgb(var(--color-primary))]/30"
                                }`}
                        >
                            {/* Selection Indicator (Matches LayoutSelector) */}
                            <div className={`absolute top-3 left-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors z-20 ${displayPlanFrame && isPro
                                ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]"
                                : "border-[rgb(var(--color-border))] bg-transparent"
                                }`}>
                                {displayPlanFrame && isPro && <Sparkles className="w-3 h-3 text-white" />}
                            </div>

                            {/* Lock for non-Pro */}
                            {!isPro && (
                                <div className="absolute top-3 right-3 z-20">
                                    <Lock className="w-4 h-4 text-[rgb(var(--color-text-muted))]" />
                                </div>
                            )}

                            {/* Main Icon / Avatar Preview */}
                            <div className="relative">
                                {isPro && displayPlanFrame ? (
                                    <div className={`w-20 h-20 rounded-full border-[3px] p-1 ${planType === "DIAMOND"
                                        ? "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                                        : "border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]"
                                        }`}>
                                        <img
                                            src={previewUrl || "/default-avatar.png"}
                                            alt="Avatar"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className={`p-4 rounded-2xl transition-colors ${displayPlanFrame && isPro
                                        ? "bg-[rgb(var(--color-primary))]/20 text-[rgb(var(--color-primary))]"
                                        : "bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-muted))]"
                                        }`}>
                                        <Sparkles className="w-10 h-10" />
                                    </div>
                                )}
                            </div>

                            {/* Label */}
                            <div className="text-center w-full px-1">
                                <span className={`text-sm font-semibold block uppercase ${displayPlanFrame && isPro ? "text-[rgb(var(--color-primary))]" : "text-[rgb(var(--color-text-primary))]"
                                    }`}>
                                    Moldura
                                </span>
                                <span className="text-[11px] text-[rgb(var(--color-text-muted))] mt-1 block leading-tight">
                                    Ativar moldura de plano
                                </span>
                            </div>
                        </div>

                        {/* Pro Feature: Remove Branding */}
                        <div
                            onClick={() => {
                                if (!isPro) return;
                                const newValue = !removeBranding;
                                setRemoveBranding(newValue);
                                // Auto-save
                                const formData = new FormData();
                                formData.append('displayName', profile.displayName);
                                formData.append('bio', profile.bio || "");
                                formData.append('avatarUrl', previewUrl || "");
                                formData.append('removeBranding', String(newValue));
                                formData.append('displayPlanFrame', String(displayPlanFrame));
                                handleSubmit(formData);
                            }}
                            className={`group relative flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 aspect-square cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${removeBranding && isPro
                                ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/5 shadow-[0_0_15px_-5px_rgb(var(--color-primary)/0.3)]"
                                : "border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] hover:border-[rgb(var(--color-primary))]/30"
                                }`}
                        >
                            {/* Selection Indicator */}
                            <div className={`absolute top-3 left-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors z-20 ${removeBranding && isPro
                                ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]"
                                : "border-[rgb(var(--color-border))] bg-transparent"
                                }`}>
                                {removeBranding && isPro && <X className="w-3 h-3 text-white" />}
                            </div>

                            {/* Lock for non-Pro */}
                            {!isPro && (
                                <div className="absolute top-3 right-3 z-20">
                                    <Lock className="w-4 h-4 text-[rgb(var(--color-text-muted))]" />
                                </div>
                            )}

                            {/* Main Icon / Branding Preview */}
                            <div className={`p-2 transition-all duration-300 flex items-center justify-center ${removeBranding && isPro
                                ? "blur-[1px] opacity-40 grayscale"
                                : "opacity-100"
                                }`}>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] shadow-sm whitespace-nowrap scale-110">
                                    <div className="p-1 rounded bg-gradient-to-br from-emerald-400 to-teal-600">
                                        <Sparkles className="w-3 h-3 text-white fill-white" />
                                    </div>
                                    <span className="text-xs font-medium text-[rgb(var(--color-text-primary))]">
                                        MyProfile
                                    </span>
                                </div>
                            </div>

                            {/* Label */}
                            <div className="text-center w-full px-1">
                                <span className={`text-sm font-semibold block uppercase ${removeBranding && isPro ? "text-[rgb(var(--color-primary))]" : "text-[rgb(var(--color-text-primary))]"
                                    }`}>
                                    Branding
                                </span>
                                <span className="text-[11px] text-[rgb(var(--color-text-muted))] mt-1 block leading-tight">
                                    Ocultar ícone MyProfile
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="!mt-[30px]">
                    <Button type="submit" isLoading={isLoading} className="!text-[rgb(var(--color-background))]">
                        Salvar alterações
                    </Button>
                </div>
            </form>
        </Card >
    );
}
