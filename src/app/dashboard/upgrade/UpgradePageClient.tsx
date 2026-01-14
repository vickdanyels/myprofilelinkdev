"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Sparkles, Zap, Copy, CheckCircle, X, Lock, Crown } from "lucide-react";
import {
    PLANS,
    DURATION_OPTIONS,
    calculatePrice,
    formatPrice,
    type PlanType
} from "@/lib/upgrade-pricing";
import { generatePixCode, generatePixQRCode, PIX_CONFIG } from "@/lib/pix-generator";

// PRO to DIAMOND discount
const PRO_TO_DIAMOND_DISCOUNT = 0.15; // 15%

interface UpgradePageClientProps {
    userPlan: 'FREE' | 'PRO' | 'DIAMOND';
}

export function UpgradePageClient({ userPlan }: UpgradePageClientProps) {
    const searchParams = useSearchParams();
    const initialPlan = (searchParams.get("plan")?.toUpperCase() as PlanType) || "PRO";

    // If user is DIAMOND, they can only stay on DIAMOND (no selection)
    // If user is PRO, they can only buy DIAMOND
    // If user is FREE, they can buy PRO or DIAMOND
    const getAvailablePlans = (): PlanType[] => {
        if (userPlan === "DIAMOND") return [];
        if (userPlan === "PRO") return ["DIAMOND"];
        return ["PRO", "DIAMOND"];
    };

    const availablePlans = getAvailablePlans();
    const defaultPlan = availablePlans.includes(initialPlan as PlanType)
        ? initialPlan as PlanType
        : availablePlans[0] || "DIAMOND";

    const [selectedPlan, setSelectedPlan] = useState<PlanType>(defaultPlan);
    const [selectedMonths, setSelectedMonths] = useState<number>(12);
    const [showPixModal, setShowPixModal] = useState(false);
    const [pixCode, setPixCode] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [copied, setCopied] = useState(false);

    // Calculate pricing with PRO to DIAMOND discount
    const basePricing = calculatePrice(selectedPlan, selectedMonths);
    const hasProDiscount = userPlan === "PRO" && selectedPlan === "DIAMOND";
    const proDiscountAmount = hasProDiscount ? basePricing.finalPrice * PRO_TO_DIAMOND_DISCOUNT : 0;
    const finalPriceWithDiscount = basePricing.finalPrice - proDiscountAmount;

    const pricing = {
        ...basePricing,
        finalPrice: Math.round(finalPriceWithDiscount * 100) / 100,
        proDiscountAmount: Math.round(proDiscountAmount * 100) / 100,
        hasProDiscount
    };

    const planConfig = PLANS[selectedPlan];

    useEffect(() => {
        const plan = searchParams.get("plan")?.toUpperCase() as PlanType;
        if (plan && availablePlans.includes(plan)) {
            setSelectedPlan(plan);
        }
    }, [searchParams, availablePlans]);

    const handlePayClick = async () => {
        // Generate PIX code and QR with final price
        const code = generatePixCode(pricing.finalPrice);
        setPixCode(code);

        const qr = await generatePixQRCode(pricing.finalPrice);
        setQrCodeUrl(qr);

        setShowPixModal(true);
    };

    const handleCopyCode = async () => {
        await navigator.clipboard.writeText(pixCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    // If user is already DIAMOND, show message
    if (userPlan === "DIAMOND") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pb-20">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <Crown className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Você já é <span className="text-cyan-400">DIAMOND</span>! 💎
                    </h1>
                    <p className="text-gray-400 mb-8">
                        Você já possui o plano mais completo. Aproveite todos os recursos premium!
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Back Button */}
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Dashboard
            </Link>

            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {userPlan === "PRO" ? "Upgrade para Diamond" : "Escolha seu plano"}
                </h1>
                <p className="text-gray-400 text-lg">
                    {userPlan === "PRO"
                        ? "Desbloqueie recursos exclusivos do Diamond com 15% de desconto!"
                        : "Desbloqueie recursos premium e eleve sua presença digital"
                    }
                </p>
                {userPlan === "PRO" && (
                    <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400 font-medium text-sm">
                            Desconto PRO: -15% no DIAMOND
                        </span>
                    </div>
                )}
            </div>

            {/* Plan Toggle - Only show if FREE user */}
            {userPlan === "FREE" && (
                <div className="flex justify-center gap-4 mb-12">
                    {(["PRO", "DIAMOND"] as PlanType[]).map((plan) => {
                        const config = PLANS[plan];
                        const isSelected = selectedPlan === plan;

                        return (
                            <button
                                key={plan}
                                onClick={() => setSelectedPlan(plan)}
                                className={`
                                    relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300
                                    flex items-center gap-3
                                    ${isSelected
                                        ? plan === "PRO"
                                            ? "pro-badge text-black scale-105"
                                            : "diamond-badge text-white scale-105"
                                        : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                                    }
                                `}
                                style={isSelected ? { boxShadow: `0 0 30px ${config.glowColor}` } : {}}
                            >
                                <span className="text-2xl">{config.icon}</span>
                                <div className="text-left">
                                    <div className="tracking-wider">{plan}</div>
                                    <div className={`text-xs ${isSelected ? 'opacity-80' : 'text-gray-500'}`}>
                                        {formatPrice(config.monthly)}/mês
                                    </div>
                                </div>
                                {isSelected && (
                                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* PRO user upgrading to DIAMOND - Fixed plan display */}
            {userPlan === "PRO" && (
                <div className="flex justify-center mb-12">
                    <div
                        className="relative px-10 py-5 rounded-2xl font-bold text-lg diamond-badge text-white flex items-center gap-4"
                        style={{ boxShadow: `0 0 40px ${PLANS.DIAMOND.glowColor}` }}
                    >
                        <span className="text-3xl">💎</span>
                        <div className="text-left">
                            <div className="tracking-wider text-xl">DIAMOND</div>
                            <div className="text-sm opacity-80">
                                {formatPrice(PLANS.DIAMOND.monthly)}/mês
                            </div>
                        </div>
                        <div className="absolute -top-3 -right-3 px-3 py-1 bg-green-500 rounded-full text-xs font-bold text-black flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> -15%
                        </div>
                    </div>
                </div>
            )}

            {/* Duration Options */}
            <div className="max-w-4xl mx-auto mb-12">
                <h2 className="text-xl font-semibold text-white mb-6 text-center">
                    Escolha a duração
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {DURATION_OPTIONS.map((option) => {
                        const isSelected = selectedMonths === option.months;
                        const optionPricing = calculatePrice(selectedPlan, option.months);

                        // Apply PRO discount for DIAMOND
                        const optionDiscount = hasProDiscount ? optionPricing.finalPrice * PRO_TO_DIAMOND_DISCOUNT : 0;
                        const optionFinalPrice = optionPricing.finalPrice - optionDiscount;

                        return (
                            <button
                                key={option.months}
                                onClick={() => setSelectedMonths(option.months)}
                                className={`
                                    relative p-6 rounded-2xl transition-all duration-300 text-left
                                    ${isSelected
                                        ? `bg-${planConfig.color}-500/20 border-2 border-${planConfig.color}-500/50 scale-[1.02]`
                                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                    }
                                    ${option.months === 0 ? 'col-span-2 md:col-span-3' : ''}
                                `}
                                style={isSelected ? {
                                    boxShadow: `0 0 20px ${planConfig.glowColor}`,
                                    borderColor: selectedPlan === "PRO" ? "rgba(245, 158, 11, 0.5)" : "rgba(103, 254, 253, 0.5)"
                                } : {}}
                            >
                                {/* Popular Badge */}
                                {option.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs font-bold text-black flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        POPULAR
                                    </div>
                                )}

                                {/* Lifetime Special */}
                                {option.months === 0 && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-xs font-bold text-white flex items-center gap-1">
                                        <Zap className="w-3 h-3" />
                                        MELHOR VALOR
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-2">
                                    <span className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                        {option.label}
                                    </span>
                                    {option.discount > 0 && option.months !== 0 && (
                                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">
                                            -{optionPricing.discountPercent}%
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    {(option.discount > 0 || hasProDiscount) && (
                                        <div className="text-gray-500 line-through text-sm">
                                            {formatPrice(optionPricing.originalPrice)}
                                        </div>
                                    )}
                                    <div className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                                        {formatPrice(optionFinalPrice)}
                                    </div>
                                    {(optionPricing.savings > 0 || optionDiscount > 0) && (
                                        <div className="text-green-400 text-sm font-medium">
                                            Economia de {formatPrice(optionPricing.savings + optionDiscount)}
                                        </div>
                                    )}
                                </div>

                                {/* Lifetime Description */}
                                {option.months === 0 && (
                                    <p className="mt-3 text-gray-400 text-sm">
                                        Acesso eterno + todos os recursos futuros inclusos
                                    </p>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Summary Card */}
            <div className="max-w-md mx-auto">
                <div
                    className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10"
                    style={{ boxShadow: `0 0 40px ${planConfig.glowColor}`, marginBottom: '100px' }}
                >
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-3xl">{planConfig.icon}</span>
                            <span className={`font-bold text-2xl ${selectedPlan === "PRO" ? "text-amber-400" : "text-cyan-400"}`}>
                                {selectedPlan}
                            </span>
                        </div>
                        <p className="text-gray-400">
                            {DURATION_OPTIONS.find(d => d.months === selectedMonths)?.label}
                        </p>
                    </div>

                    <div className="space-y-3 mb-6">
                        {basePricing.savings > 0 && (
                            <div className="flex justify-between text-gray-400">
                                <span>Valor original:</span>
                                <span className="line-through">{formatPrice(basePricing.originalPrice)}</span>
                            </div>
                        )}
                        {hasProDiscount && (
                            <div className="flex justify-between text-amber-400">
                                <span>Desconto PRO (-15%):</span>
                                <span>-{formatPrice(pricing.proDiscountAmount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-white text-xl font-bold">
                            <span>Total:</span>
                            <span>{formatPrice(pricing.finalPrice)}</span>
                        </div>
                        {(basePricing.savings > 0 || pricing.proDiscountAmount > 0) && (
                            <div className="flex items-center justify-center gap-2 py-2 px-4 bg-green-500/20 rounded-xl">
                                <Sparkles className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 font-bold">
                                    Você economiza {formatPrice(basePricing.savings + pricing.proDiscountAmount)}!
                                </span>
                            </div>
                        )}
                    </div>

                    {/* PIX Payment Button */}
                    <button
                        onClick={handlePayClick}
                        className={`
                            w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300
                            flex items-center justify-center gap-3
                            ${selectedPlan === "PRO"
                                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]"
                                : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-[0_0_30px_rgba(103,254,253,0.5)]"
                            }
                        `}
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9.5 4.5L4.5 9.5L7 12L4.5 14.5L9.5 19.5L12 17L14.5 19.5L19.5 14.5L17 12L19.5 9.5L14.5 4.5L12 7L9.5 4.5Z" />
                        </svg>
                        PAGAR COM PIX
                    </button>

                    <p className="text-center text-gray-500 text-sm mt-4">
                        Pagamento seguro e instantâneo
                    </p>
                </div>
            </div>

            {/* PIX Payment Modal */}
            {showPixModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div
                        className="relative w-full max-w-md p-6 rounded-3xl bg-black/90 border border-white/20"
                        style={{ boxShadow: `0 0 60px ${planConfig.glowColor}` }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowPixModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9.5 4.5L4.5 9.5L7 12L4.5 14.5L9.5 19.5L12 17L14.5 19.5L19.5 14.5L17 12L19.5 9.5L14.5 4.5L12 7L9.5 4.5Z" />
                                </svg>
                                <h2 className="text-2xl font-bold text-white">Pagamento PIX</h2>
                            </div>
                            <p className="text-gray-400">
                                {selectedPlan} • {DURATION_OPTIONS.find(d => d.months === selectedMonths)?.label}
                            </p>
                        </div>

                        {/* Amount */}
                        <div className="text-center mb-6 py-4 px-6 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-gray-400 text-sm mb-1">Valor a pagar:</p>
                            <p className="text-3xl font-bold text-white">{formatPrice(pricing.finalPrice)}</p>
                            {hasProDiscount && (
                                <p className="text-amber-400 text-sm mt-1 flex items-center justify-center gap-1">
                                    <Crown className="w-3 h-3" /> Desconto PRO aplicado!
                                </p>
                            )}
                        </div>

                        {/* QR Code */}
                        {qrCodeUrl && (
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-white rounded-2xl">
                                    <Image
                                        src={qrCodeUrl}
                                        alt="PIX QR Code"
                                        width={200}
                                        height={200}
                                        className="rounded-lg"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Copy Code */}
                        <div className="mb-6">
                            <p className="text-gray-400 text-sm mb-2 text-center">Ou copie o código PIX:</p>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-gray-300 text-xs break-all max-h-20 overflow-y-auto mb-3">
                                {pixCode}
                            </div>
                            <div className="flex justify-center" style={{ marginTop: '15px' }}>
                                <button
                                    onClick={handleCopyCode}
                                    className={`
                                        rounded-xl text-sm font-bold transition-all
                                        ${copied
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
                                        }
                                    `}
                                    style={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '8px', paddingBottom: '8px' }}
                                >
                                    {copied ? (
                                        <span className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" /> Copiado!
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Copy className="w-4 h-4" /> Copiar Código
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="text-center text-gray-400 text-sm space-y-2">
                            <p>1. Abra o app do seu banco</p>
                            <p>2. Escaneie o QR Code ou cole o código</p>
                            <p>3. Confirme o pagamento</p>
                            <p className="text-cyan-400 font-medium mt-4">
                                Após o pagamento, envie o comprovante para ativarmos seu plano!
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
