"use client";

import { Card } from "@/components/ui";
import {
    User,
    Instagram,
    Youtube,
    Globe,
    MessageCircle,
    Twitch,
    Music2,
} from "lucide-react";

interface Link {
    id: string;
    title: string;
    url: string;
    icon: string | null;
    isEnabled: boolean;
}

interface Profile {
    displayName: string;
    bio: string | null;
    avatarUrl: string | null;
    username: string;
    links: Link[];
    updatedAt: Date;
    buttonSize: string;
}

interface ProfilePreviewProps {
    profile: Profile;
}

// ... ICONS ...

export function ProfilePreview({ profile }: ProfilePreviewProps) {
    // Generate a timestamp for cache busting based on profile update time
    const timestamp = new Date(profile.updatedAt).getTime();

    return (
        <div className="relative sticky top-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] rounded-3xl blur opacity-25" />

            <Card variant="elevated" className="relative">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                        Pré-visualização
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[rgb(var(--color-success))] animate-pulse" />
                        <span className="text-xs text-[rgb(var(--color-text-muted))]">
                            Ao vivo
                        </span>
                    </div>
                </div>

                {/* Phone Frame - iPhone 14 Pro dimensions (scaled) */}
                <div className="mx-auto w-[300px] h-[632px] bg-black rounded-[3rem] border-[8px] border-zinc-900 overflow-hidden shadow-2xl relative">
                    {/* Dynamic Island Notch */}
                    {/* Adjusted to top-[5px] to be closer to edge as requested */}
                    <div className="absolute top-[5px] left-0 right-0 mx-auto w-[90px] h-[24px] bg-black rounded-full z-20 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-black absolute -top-8 -right-8 blur-xl opacity-50" />
                        <div className="flex gap-2 items-center">
                            <div className="w-3 h-3 rounded-full bg-zinc-900/80 ring-1 ring-zinc-800" />
                        </div>
                    </div>

                    {/* Iframe for Perfect Fidelity */}
                    <div className="w-full h-full bg-[rgb(var(--color-background))] overflow-hidden rounded-[2.5rem]">
                        <iframe
                            src={`/${profile.username}?t=${timestamp}&preview=true`}
                            title="Profile Preview"
                            // Logical resolution for iPhone 14 Pro: 393x852
                            className="w-[393px] h-[852px] origin-top-left"
                            style={{
                                transform: 'scale(0.7227)', // 284 / 393 ≈ 0.7227
                                border: 'none',
                            }}
                        />
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-xs text-[rgb(var(--color-text-muted))]">
                        Visualização mobile em tempo real
                    </p>
                </div>
            </Card>
        </div>
    );
}
