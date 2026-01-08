"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components/ui";
import { addLink, deleteLink, toggleLink, reorderLinks, updateButtonSize } from "@/actions/profile";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Plus,
    GripVertical,
    Trash2,
    ExternalLink,
    Instagram,
    Youtube,
    Globe,
    MessageCircle,
    Twitch,
    Music2,
    ToggleLeft,
    ToggleRight,
    Sparkles,
    Lock
} from "lucide-react";

interface Link {
    id: string;
    title: string;
    url: string;
    icon: string | null;
    isEnabled: boolean;
    order: number;
}

interface LinkManagerProps {
    links: Link[];
    isPro: boolean;
    buttonSize: string;
}

const FREE_LINK_LIMIT = 3;

const ICONS: Record<string, typeof Instagram> = {
    instagram: Instagram,
    youtube: Youtube,
    tiktok: Music2,
    twitch: Twitch,
    whatsapp: MessageCircle,
    website: Globe,
};

const ICON_OPTIONS = [
    { value: "instagram", label: "Instagram" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "twitch", label: "Twitch" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "website", label: "Website" },
];

function SortableLinkItem({
    link,
    index,
    isPro,
    handleToggle,
    handleDelete
}: {
    link: Link;
    index: number;
    isPro: boolean;
    handleToggle: (id: string) => void;
    handleDelete: (id: string, e: React.MouseEvent) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const IconComponent = link.icon ? ICONS[link.icon] : Globe;

    const isOverLimit = !isPro && index >= FREE_LINK_LIMIT;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all mb-3 ${link.isEnabled
                ? "bg-[rgb(var(--color-surface-elevated))] border-[rgb(var(--color-border))]"
                : "bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))]/50 opacity-60"
                } ${isOverLimit ? "opacity-50 grayscale" : ""}`}
        >
            <button
                type="button"
                className="text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text-secondary))] cursor-grab touch-none"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="w-5 h-5" />
            </button>

            <div className={`p-2 rounded-lg bg-[rgb(var(--color-primary))]/10 ${isOverLimit ? "bg-gray-500/10" : ""}`}>
                <IconComponent className={`w-5 h-5 ${isOverLimit ? "text-gray-500" : "text-[rgb(var(--color-primary))]"}`} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className={`font-medium truncate ${isOverLimit ? "text-gray-500" : "text-[rgb(var(--color-text-primary))]"}`}>
                        {link.title}
                    </p>
                    {isOverLimit && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-500 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Excede limite (Free)
                        </span>
                    )}
                </div>
                <p className="text-sm text-[rgb(var(--color-text-muted))] truncate">
                    {link.url}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => handleToggle(link.id)}
                    className="p-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] transition-colors"
                    title={link.isEnabled ? "Desativar" : "Ativar"}
                >
                    {link.isEnabled ? (
                        <ToggleRight className={`w-6 h-6 ${isOverLimit ? "text-gray-400" : "text-[rgb(var(--color-success))]"}`} />
                    ) : (
                        <ToggleLeft className="w-6 h-6" />
                    )}
                </button>

                <div
                    className="p-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-error))] transition-colors cursor-pointer"
                    onClick={(e) => handleDelete(link.id, e)}
                    title="Excluir"
                >
                    <Trash2 className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}

export function LinkManager({ links: initialLinks, isPro, buttonSize: initialSize }: LinkManagerProps) {
    const [links, setLinks] = useState<Link[]>(initialLinks);
    const [buttonSize, setButtonSize] = useState(initialSize);
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setLinks(initialLinks);
        setButtonSize(initialSize);
    }, [initialLinks, initialSize]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const canAddMore = isPro || links.length < FREE_LINK_LIMIT;
    const linksRemaining = FREE_LINK_LIMIT - links.length;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setLinks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                const orderedIds = newItems.map(item => item.id);
                reorderLinks(orderedIds);

                return newItems;
            });
        }
    }

    async function handleAddLink(formData: FormData) {
        setIsLoading(true);
        const result = await addLink(formData);

        if (result?.error) {
            alert(result.error);
            setIsLoading(false);
            return;
        }

        setIsLoading(false);
        setIsAdding(false);
        // Force router refresh to ensure UI update
        router.refresh();
    }

    async function handleDelete(linkId: string, e: React.MouseEvent) {
        e.stopPropagation();
        if (confirm("Tem certeza que deseja excluir este link?")) {
            await deleteLink(linkId);
        }
    }

    async function handleToggle(linkId: string) {
        await toggleLink(linkId);
    }

    async function handleSizeChange(newSize: string) {
        setButtonSize(newSize);
        setIsLoading(true);
        await updateButtonSize(newSize);
        setIsLoading(false);
    }

    if (!mounted) {
        return (
            <Card variant="glass" padding="lg">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
                            Seus Links
                        </h2>
                    </div>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-[rgb(var(--color-surface))] rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <Card variant="glass" padding="lg">
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
                            Seus Links
                        </h2>
                        {!isPro && (
                            <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1">
                                {linksRemaining > 0
                                    ? `${links.length}/${FREE_LINK_LIMIT} links usados`
                                    : "Limite de links atingido (Excedentes ocultos)"}
                            </p>
                        )}
                    </div>
                    {canAddMore ? (
                        <Button
                            size="sm"
                            onClick={() => setIsAdding(true)}
                            disabled={isAdding}
                            className="!text-[rgb(var(--color-background))]"
                        >
                            <Plus className="w-4 h-4" />
                            Adicionar
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            onClick={() => window.location.href = "/pricing"}
                            className="bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))]"
                        >
                            <Sparkles className="w-4 h-4" />
                            Seja Pro
                        </Button>
                    )}
                </div>

                {/* Size Selector */}
                <div className="flex flex-col items-center gap-2 mb-4">
                    <label className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                        Tamanho dos links
                    </label>
                    <div className="flex items-center gap-3 p-1 bg-[rgb(var(--color-surface))] rounded-lg w-fit border border-[rgb(var(--color-border))]">
                        {(["micro", "small", "regular", "large"] as const).map((size) => (
                            <button
                                key={size}
                                onClick={() => handleSizeChange(size)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${buttonSize === size
                                    ? "bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-primary))] shadow-sm"
                                    : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
                                    }`}
                            >
                                {size === "micro" && "Micro"}
                                {size === "small" && "Pequeno"}
                                {size === "regular" && "Médio"}
                                {size === "large" && "Grande"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isAdding && (
                <div className="mb-6 p-4 rounded-xl bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))]">
                    <form action={handleAddLink} className="space-y-4">
                        <Input
                            label="Título do link"
                            name="title"
                            placeholder="Ex: Meu Instagram"
                            required
                        />

                        <Input
                            label="URL"
                            name="url"
                            type="url"
                            placeholder="https://..."
                            required
                        />

                        <div className="w-full">
                            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                                Ícone
                            </label>
                            <select
                                name="icon"
                                className="w-full px-4 py-3 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--color-background))] focus:border-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))] transition-all duration-200"
                            >
                                <option value="">Selecione um ícone</option>
                                {ICON_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit" isLoading={isLoading}>
                                Salvar link
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsAdding(false)}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {links.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgb(var(--color-surface-elevated))] flex items-center justify-center">
                        <ExternalLink className="w-8 h-8 text-[rgb(var(--color-text-muted))]" />
                    </div>
                    <p className="text-[rgb(var(--color-text-secondary))]">
                        Você ainda não tem links.
                    </p>
                    <p className="text-sm text-[rgb(var(--color-text-muted))]">
                        Clique em "Adicionar" para criar seu primeiro link.
                    </p>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={links.map(l => l.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {links.map((link, index) => (
                                <SortableLinkItem
                                    key={link.id}
                                    link={link}
                                    index={index}
                                    isPro={isPro}
                                    handleToggle={handleToggle}
                                    handleDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </Card>
    );
}
