"use client";

import { useEffect, useRef, memo } from "react";

interface LiveBackgroundsProps {
    type: string;
    enabled: boolean;
    themeColors: {
        primary: string;
        accent: string;
        background: string;
        textSecondary?: string;
    };
    warpSpeedBoost?: boolean; // Trigger for hyperspace effect
    className?: string; // Allow overriding fixed positioning
    starCount?: number; // Optional override for particle count
    disableMouseInteraction?: boolean; // Optional disable for side movement
    speedMultiplier?: number; // Optional speed multiplier for warped speed
}

export const LiveBackgrounds = memo(function LiveBackgrounds({ type, enabled, themeColors, warpSpeedBoost, className, starCount, disableMouseInteraction, speedMultiplier }: LiveBackgroundsProps) {
    if (!enabled || type === "none") return null;

    return (
        <div className={className || "fixed inset-0 z-0 pointer-events-none overflow-hidden"}>
            {type === "particles" && <ParticlesBackground colors={themeColors} />}
            {type === "wave" && <WaveBackground colors={themeColors} />}
            {type === "gradient" && <GradientBackground colors={themeColors} />}
            {type === "matrix" && <MatrixBackground colors={themeColors} />}

            {/* New Niche Backgrounds */}
            {type === "hyperliquid" && <HyperliquidBackground colors={themeColors} />}
            {type === "cryptobubbles" && <AuroraBackground themeColors={themeColors} />}
            {type === "galaxy" && <GalaxyBackground themeColors={themeColors} />}
            {type === "blockchain" && <ImageFloatBackground colors={themeColors} images={["/images/crypto/btc.svg", "/images/crypto/eth.svg", "/images/crypto/sol.svg", "/images/crypto/hype.svg"]} />}
            {type === "glamour" && <SparklesBackground colors={themeColors} />}
            {type === "lashes" && <NeonEyeBackground colors={themeColors} />}
            {type === "sobrancelhas" && <IconFloatBackground colors={themeColors} icons={["〰️", "✏️"]} isText />}
            {type === "cabelos" && <IconFloatBackground colors={themeColors} icons={["✂️", "💈", "💇"]} isText />}
            {type === "petshop" && <IconFloatBackground colors={themeColors} icons={["🐾", "🐾", "🐕", "🐈"]} isText />}
            {/* New Technological Background */}
            {type === "tech-grid" && <TechGridBackground colors={themeColors} />}
            {type === "flow-field" && <FlowFieldBackground themeColors={themeColors} />}
            {type === "warp-speed" && <WarpSpeedBackground themeColors={themeColors} boost={warpSpeedBoost} starCount={starCount} disableMouseInteraction={disableMouseInteraction} speedMultiplier={speedMultiplier} />}
        </div>
    );
});

// --- Warp Speed Background (Hyperdrive) ---
function WarpSpeedBackground({ themeColors, boost, starCount: customStarCount, disableMouseInteraction, speedMultiplier = 1 }: { themeColors: LiveBackgroundsProps["themeColors"]; boost?: boolean; starCount?: number; disableMouseInteraction?: boolean; speedMultiplier?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const boostRef = useRef(boost);

    // Refs for Smooth Color Transition
    const currentColorsRef = useRef({ primary: themeColors.primary, accent: themeColors.accent });
    const targetColorsRef = useRef({ primary: themeColors.primary, accent: themeColors.accent });

    // Ref for Smooth Speed Transition
    const currentSpeedMultiplierRef = useRef(speedMultiplier);
    const targetSpeedMultiplierRef = useRef(speedMultiplier);

    // Helper: Parse RGB string "255 255 255" to [255, 255, 255]
    const parseRGB = (rgb: string) => rgb.split(' ').map(Number);
    // Helper: Lerp between two values
    const lerp = (start: number, end: number, t: number) => start + (end - start) * t;
    // Helper: Lerp RGB arrays and return string
    const lerpColor = (current: string, target: string, t: number) => {
        const c = parseRGB(current);
        const tg = parseRGB(target);
        if (c.length !== 3 || tg.length !== 3) return target;
        const r = Math.round(lerp(c[0], tg[0], t));
        const g = Math.round(lerp(c[1], tg[1], t));
        const b = Math.round(lerp(c[2], tg[2], t));
        return `${r} ${g} ${b}`;
    };

    // Update ref without triggering re-render of effect
    useEffect(() => {
        boostRef.current = boost;
    }, [boost]);

    // Update target colors when prop changes
    useEffect(() => {
        targetColorsRef.current = { primary: themeColors.primary, accent: themeColors.accent };
    }, [themeColors]);

    // Update target speed when prop changes
    useEffect(() => {
        targetSpeedMultiplierRef.current = speedMultiplier;
    }, [speedMultiplier]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = canvas.parentElement?.clientWidth || window.innerWidth;
        let height = canvas.parentElement?.clientHeight || window.innerHeight;
        let stars: Star[] = [];

        // Configuration
        const isSmallScreen = width < 768;
        // Logic: Use customStarCount if provided, otherwise default to 750 (desktop) / 400 (mobile)
        const starCount = customStarCount !== undefined ? customStarCount : (isSmallScreen ? 400 : 750);

        // Speed Contants
        const BASE_SPEED = 40;
        const BOOST_SPEED = 120; // 3x speed for boost
        let currentSimSpeed = BASE_SPEED; // Mutable speed

        const depth = 15000; // Deep Universe

        // Smooth Mouse Movement Variables
        let targetMouseX = 0;
        let targetMouseY = 0;
        let currentMouseX = 0;
        let currentMouseY = 0;

        const handleResize = () => {
            width = canvas.parentElement?.clientWidth || window.innerWidth;
            height = canvas.parentElement?.clientHeight || window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            // Center absolute 0,0 is now middle of screen for easier math
            ctx.translate(width / 2, height / 2);
        };

        class Star {
            x: number;
            y: number;
            z: number;
            pz: number; // Previous Z (for trails)

            constructor() {
                this.x = (Math.random() - 0.5) * width * 6;
                this.y = (Math.random() - 0.5) * height * 6;
                this.z = Math.random() * depth;
                this.pz = this.z;
            }

            update() {
                this.pz = this.z; // Store z before moving
                this.z -= currentSimSpeed;

                // If star passes camera (or is too close), reset directly to back
                if (this.z < 1) {
                    this.z = depth;
                    this.pz = depth;
                    this.x = (Math.random() - 0.5) * width * 6;
                    this.y = (Math.random() - 0.5) * height * 6;
                }
            }

            draw() {
                if (!ctx) return;

                // Perspective Projection
                // sx = screen x, sy = screen y
                const sx = (this.x / this.z) * 1000; // 1000 is FOV scalar
                const sy = (this.y / this.z) * 1000;

                // Previous position (for trail tail)
                const px = (this.x / this.pz) * 1000;
                const py = (this.y / this.pz) * 1000;

                // Don't draw if out of bounds (optimization)
                // Note: we translated context to center, so bounds are +/- width/2
                if (Math.abs(sx) > width || Math.abs(sy) > height) return;

                // Visuals
                // Custom Opacity Curve (15k Depth):

                let opacity = 0;
                if (this.z > 12000) {
                    opacity = 0.5 * (1 - (this.z - 12000) / 3000);
                } else if (this.z > 11000) {
                    opacity = 1.0 - 0.5 * ((this.z - 11000) / 1000);
                } else {
                    opacity = 1.0;
                }

                // Re-calculate r for size/width logic (0 to 1)
                const r = (1 - this.z / depth);

                // --- EXTENDED TRAIL (Dark Teal - Behind) ---
                // Calculate position even further back for the trail
                // Dynamic Trail Length: Far = 2x speed, Close = up to 6x speed
                const trailLengthFactor = 2 + (r * 4);
                const trailZ = this.z + (currentSimSpeed * trailLengthFactor);
                const tx = (this.x / trailZ) * 1000;
                const ty = (this.y / trailZ) * 1000;

                ctx.beginPath();
                ctx.moveTo(tx, ty); // Start from far back
                ctx.lineTo(sx, sy); // Go to current head

                // Style: Use interpolated Primary color for trails
                const primaryRGB = currentColorsRef.current.primary;
                ctx.lineWidth = 2.4 + (r * 3.6);
                ctx.lineCap = "round";
                // Trail uses Primary Color
                ctx.strokeStyle = `rgba(${primaryRGB}, ${opacity * 0.6})`;
                ctx.stroke();

                // --- MAIN PARTICLE (Cyan - Front) ---
                ctx.beginPath();
                ctx.moveTo(px, py); // From standard previous (short trail)
                ctx.lineTo(sx, sy); // To current head

                // Style: Use interpolated Accent color
                const accentRGB = currentColorsRef.current.accent;
                ctx.lineWidth = 2.4 + (r * 3.6);
                ctx.lineCap = "round";
                ctx.strokeStyle = `rgb(${accentRGB} / ${opacity})`;

                // No ShadowBlur (Performance)
                ctx.shadowBlur = 0;

                ctx.stroke();
            }
        }

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            stars = [];
            for (let i = 0; i < starCount; i++) {
                stars.push(new Star());
            }

            // Mouse Interaction
            if (!disableMouseInteraction) {
                window.addEventListener("mousemove", (e) => {
                    // Calculate offset from center (e.g. -0.5 to 0.5)
                    const nx = (e.clientX / window.innerWidth) - 0.5;
                    const ny = (e.clientY / window.innerHeight) - 0.5;

                    // Set TARGET position based on device
                    // Desktop (>768px): 1000px X, 600px Y
                    // Mobile: Keep smaller to avoid disorientation (if event fires)
                    const isDesktop = window.innerWidth > 768;
                    const limitX = isDesktop ? 1000 : 300;
                    const limitY = isDesktop ? 600 : 200;

                    targetMouseX = nx * limitX;
                    targetMouseY = ny * limitY;
                });
            }
        };

        const animate = () => {
            // Smoothly interpolate colors (approx 5% per frame)
            const lerpSpeed = 0.05;
            currentColorsRef.current.primary = lerpColor(currentColorsRef.current.primary, targetColorsRef.current.primary, lerpSpeed);
            currentColorsRef.current.accent = lerpColor(currentColorsRef.current.accent, targetColorsRef.current.accent, lerpSpeed);

            // Smoothly interpolate speed multiplier
            // Using a slightly slower lerp (2%) for that "bezier" feel or just smooth ramp
            const speedLerp = 0.02;
            currentSpeedMultiplierRef.current = lerp(currentSpeedMultiplierRef.current, targetSpeedMultiplierRef.current, speedLerp);

            // Update Speed based on boost state and multiplier
            const targetBaseSpeed = boostRef.current ? BOOST_SPEED : BASE_SPEED;
            const finalTargetSpeed = targetBaseSpeed * currentSpeedMultiplierRef.current;

            // Smooth acceleration towards final target speed
            currentSimSpeed += (finalTargetSpeed - currentSimSpeed) * 0.05; // 5% approach to target

            // Note: Since we use ctx.translate in handleResize, we must reset or account for it in clearRect
            // Easier way: Save/Restore context or just fillRect huge area
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform for clearing

            // Black background
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(0, 0, width, height);

            ctx.restore(); // Restore center translation logic if we moved it?

            // SMOOTH INTERPOLATION (Lerp)
            // Move current position 5% towards target every frame
            currentMouseX += (targetMouseX - currentMouseX) * 0.05;
            currentMouseY += (targetMouseY - currentMouseY) * 0.05;

            // Wait, handleResize is called once, but animate loops.
            // We need to ensure 0,0 is center every frame? 
            // Better: Translate every frame.
            ctx.save();
            // SHIFT CENTER BASED ON SMOOTH MOUSE
            ctx.translate((width / 2) - currentMouseX, (height / 2) - currentMouseY);

            // Additive Blending for Glow
            ctx.globalCompositeOperation = "lighter";

            stars.forEach(star => {
                star.update();
                star.draw();
            });

            ctx.restore();

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        window.addEventListener("resize", handleResize);
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [customStarCount, disableMouseInteraction]); // Removed themeColors and speedMultiplier from dependency to avoid full reset

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}



// --- Flow Field Background (High Complexity) ---
function FlowFieldBackground({ themeColors }: { themeColors: LiveBackgroundsProps["themeColors"] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let particles: Particle[] = [];
        let flowField: number[] = [];
        const scale = 20; // Grid cell size
        let cols = Math.floor(width / scale);
        let rows = Math.floor(height / scale);
        let zOff = 0; // Time dimension for noise

        // Pseudo-Perlin Noise (Simplex-ish)
        // A simple hash function effectively for noise
        const noise = (x: number, y: number, z: number) => {
            const p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
            const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
            const lerp = (t: number, a: number, b: number) => a + t * (b - a);
            const grad = (hash: number, x: number, y: number, z: number) => {
                const h = hash & 15;
                const u = h < 8 ? x : y;
                const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
                return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
            };
            const X = Math.floor(x) & 255;
            const Y = Math.floor(y) & 255;
            const Z = Math.floor(z) & 255;
            x -= Math.floor(x);
            y -= Math.floor(y);
            z -= Math.floor(z);
            const u = fade(x);
            const v = fade(y);
            const w = fade(z);
            const A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z;
            const B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;
            return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)), lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z))), lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)), lerp(u, grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1))));
        }

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            color: string;
            maxSpeed: number;
            prevX: number;
            prevY: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = 0;
                this.vy = 0;
                this.prevX = this.x;
                this.prevY = this.y;
                this.maxSpeed = 2 + Math.random() * 2;

                // Color Distribution
                const rand = Math.random();
                if (rand > 0.6) this.color = `rgba(${themeColors.primary}, 0.5)`;
                else if (rand > 0.3) this.color = `rgba(${themeColors.accent}, 0.5)`;
                else this.color = "rgba(255, 255, 255, 0.3)";
            }

            update(flowField: number[]) {
                this.prevX = this.x;
                this.prevY = this.y;

                // Find grid position
                const x = Math.floor(this.x / scale);
                const y = Math.floor(this.y / scale);
                const index = x + y * cols;

                if (flowField[index]) {
                    const angle = flowField[index];
                    this.vx += Math.cos(angle) * 0.5; // Steering force
                    this.vy += Math.sin(angle) * 0.5;
                }

                // Limit speed
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > this.maxSpeed) {
                    this.vx = (this.vx / speed) * this.maxSpeed;
                    this.vy = (this.vy / speed) * this.maxSpeed;
                }

                this.x += this.vx;
                this.y += this.vy;

                // Wrap around with resetting trail
                if (this.x > width) { this.x = 0; this.prevX = 0; }
                if (this.x < 0) { this.x = width; this.prevX = width; }
                if (this.y > height) { this.y = 0; this.prevY = 0; }
                if (this.y < 0) { this.y = height; this.prevY = height; }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath();
                ctx.moveTo(this.prevX, this.prevY);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            cols = Math.floor(width / scale);
            rows = Math.floor(height / scale);
            flowField = new Array(cols * rows);

            particles = [];
            const particleCount = 800; // Optimized for 60FPS
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }

            // Initial Black Fill
            ctx.fillStyle = `rgb(${themeColors.background})`;
            ctx.fillRect(0, 0, width, height);
        };

        const animate = () => {
            // Trail Effect: Fade out previous frames slowly
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = `rgba(0, 0, 0, 0.08)`; // Slightly faster fade for cleaner look
            ctx.fillRect(0, 0, width, height);

            // Enable High Performance Glow (Additive Blending only)
            // Removed shadowBlur as it causes severe lag on many devices
            ctx.globalCompositeOperation = "lighter";

            // Calculate Flow Field
            let yoff = 0;
            for (let y = 0; y < rows; y++) {
                let xoff = 0;
                for (let x = 0; x < cols; x++) {
                    const index = x + y * cols;
                    // Noise Angle: 0 to 4PI (Two full rotations for swirlyness)
                    const angle = noise(xoff, yoff, zOff) * Math.PI * 4;
                    flowField[index] = angle;
                    xoff += 0.1;
                }
                yoff += 0.1;
            }
            zOff += 0.003; // Time step

            particles.forEach(p => {
                p.update(flowField);
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        window.addEventListener("resize", init);
        animate();

        return () => {
            window.removeEventListener("resize", init);
            cancelAnimationFrame(animationFrameId);
        };
    }, [themeColors]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// --- Hyperliquid Background ---
export function HyperliquidBackground({ colors }: { colors: LiveBackgroundsProps["themeColors"] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let time = 0;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const drawBackgroundText = () => {
            const text = "HYPERLIQUID";
            const fontSize = 45;
            const spacing = 50;
            ctx.font = `900 ${fontSize}px sans-serif`;
            ctx.textAlign = "center";
            ctx.lineWidth = 2;

            // Use fixed width for uniform spacing
            const charWidth = ctx.measureText("H").width;

            // Use the Hyperliquid Green or Theme Primary for outlines
            const strokeColor = colors.primary;

            const rows = Math.ceil(height / spacing) + 2;

            const drawTextLayer = (lineWidth: number, opacity: number, blur: boolean = false) => {
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = `rgb(${strokeColor} / ${opacity})`;
                ctx.shadowBlur = blur ? 0 : 0; // Explicitly disable blur
                ctx.shadowColor = "transparent";

                for (let i = -1; i < rows; i++) {
                    const y = i * spacing;
                    const lineYOffset = Math.sin(time * 2 + i * 0.4) * 45 + Math.sin(time * 3.5 + i * 0.2) * 25;
                    const lineXOffset = Math.cos(time * 1.8 + i * 0.3) * 70 + Math.sin(time * 2.5 + i * 0.5) * 35;

                    const drawWavyLine = (startX: number, startY: number) => {
                        let currentX = startX;
                        for (let charIndex = 0; charIndex < text.length; charIndex++) {
                            const char = text[charIndex];
                            const charYOffset =
                                Math.sin(time * 5 + charIndex * 0.6) * 22 +
                                Math.sin(time * 3 + charIndex * 0.4) * 12;

                            ctx.strokeText(char, currentX, startY + charYOffset);
                            currentX += charWidth;
                        }
                    };

                    const totalWidth = text.length * charWidth;
                    const gap = 0;
                    const repeatDistance = totalWidth + gap;
                    const baseOffset = (width / 2 + lineXOffset) % repeatDistance;
                    const instances = Math.ceil(width / repeatDistance) + 4;

                    for (let k = -3; k < instances; k++) {
                        drawWavyLine(baseOffset + k * repeatDistance - totalWidth / 2, y + lineYOffset);
                    }
                }
            };

            // Multipass rendering for Fake Glow (High Performance)

            // Pass 1: Wide Glow (Low Opacity) - Replaces shadowBlur 50
            drawTextLayer(15, 0.15);

            // Pass 2: Medium Glow
            drawTextLayer(6, 0.3);

            // Pass 3: Core Brightness
            drawTextLayer(2, 1.0);
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            time += 0.005; // Even slower liquid movement

            drawBackgroundText();
            // Logo removed

            animationFrameId = requestAnimationFrame(animate);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [colors]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// --- Image Float Background ---
function ImageFloatBackground({ colors, images }: { colors: LiveBackgroundsProps["themeColors"], images: string[] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const items: FloatItem[] = [];
        const itemCount = 15;
        const loadedImages: HTMLImageElement[] = [];

        // Preload images
        images.forEach(src => {
            const img = new Image();
            img.src = src;
            loadedImages.push(img);
        });

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initItems();
        };

        class FloatItem {
            x: number; y: number; vy: number; size: number; img: HTMLImageElement; opacity: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vy = -0.3 - Math.random() * 0.8;
                this.size = 30 + Math.random() * 40;
                this.img = loadedImages[Math.floor(Math.random() * loadedImages.length)];
                this.opacity = 0.4 + Math.random() * 0.6;
            }

            update() {
                this.y += this.vy;
                if (this.y < -50) {
                    this.y = height + 50;
                    this.x = Math.random() * width;
                }
            }

            draw() {
                if (!ctx || !this.img.complete) return;
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
                ctx.restore();
            }
        }

        const initItems = () => {
            items.length = 0;
            for (let i = 0; i < itemCount; i++) {
                items.push(new FloatItem());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            items.forEach(item => {
                item.update();
                item.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        // Wait for images to load before starting strict animation loop if needed, 
        // but checking img.complete in draw() is sufficient for immediate start.
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [colors, images]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// --- Generic Icon Float Background ---
function IconFloatBackground({ colors, icons, isText = true }: { colors: LiveBackgroundsProps["themeColors"], icons: string[], isText?: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Configuration
        const itemCount = 20;
        const items: FloatItem[] = [];

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initItems();
        };

        class FloatItem {
            x: number; y: number; vy: number; size: number; icon: string; opacity: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vy = -0.5 - Math.random() * 1; // Float upwards
                this.size = 20 + Math.random() * 30;
                this.icon = icons[Math.floor(Math.random() * icons.length)];
                this.opacity = 0.1 + Math.random() * 0.3;
            }

            update() {
                this.y += this.vy;
                // Reset to bottom if goes off top
                if (this.y < -50) {
                    this.y = height + 50;
                    this.x = Math.random() * width;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = `rgb(${colors.primary})`;
                ctx.font = `${this.size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(this.icon, this.x, this.y);
                ctx.restore();
            }
        }

        const initItems = () => {
            items.length = 0;
            for (let i = 0; i < itemCount; i++) {
                items.push(new FloatItem());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            items.forEach(item => {
                item.update();
                item.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [colors, icons]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// --- Particles Background ---
function ParticlesBackground({ colors }: { colors: LiveBackgroundsProps["themeColors"] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let width = window.innerWidth;
        let height = window.innerHeight;

        const particleCount = 100; // Increased from 50 to 100 for denser effect
        const connectionDistance = 150;
        const mouseDistance = 200;
        let mouseX = 0;
        let mouseY = 0;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        class Particle {
            x: number; y: number; vx: number; vy: number; size: number; color: string;
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                const isPrimary = Math.random() > 0.5;
                const rgb = isPrimary ? colors.primary : colors.accent;
                this.color = `rgb(${rgb} / ${Math.random() * 0.5 + 0.1})`;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouseDistance) {
                    const force = (mouseDistance - distance) / mouseDistance;
                    const angle = Math.atan2(dy, dx);
                    this.vx += Math.cos(angle) * force * 0.02;
                    this.vy += Math.sin(angle) * force * 0.02;
                }
                const maxSpeed = 1;
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > maxSpeed) {
                    this.vx = (this.vx / speed) * maxSpeed;
                    this.vy = (this.vy / speed) * maxSpeed;
                }
            }
            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);
            particles.forEach((particle, i) => {
                particle.update();
                particle.draw();
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = particle.x - p2.x;
                    const dy = particle.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgb(${colors.primary} / ${0.1 * (1 - distance / connectionDistance)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        canvas.width = width;
        canvas.height = height;
        initParticles();
        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [colors]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// --- Wave Background ---
function WaveBackground({ colors }: { colors: LiveBackgroundsProps["themeColors"] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Refs for color transition
    const colorRefs = useRef({
        currentPrimary: colors.primary.split(" ").map(Number),
        targetPrimary: colors.primary.split(" ").map(Number),
        currentAccent: colors.accent.split(" ").map(Number),
        targetAccent: colors.accent.split(" ").map(Number),
    });

    // Update targets when props change
    useEffect(() => {
        colorRefs.current.targetPrimary = colors.primary.split(" ").map(Number);
        colorRefs.current.targetAccent = colors.accent.split(" ").map(Number);
    }, [colors]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let time = 0;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            time += 0.005;

            // Interpolate Colors
            const { currentPrimary, targetPrimary, currentAccent, targetAccent } = colorRefs.current;

            // Smooth lerp factor (0.05)
            for (let i = 0; i < 3; i++) {
                currentPrimary[i] = lerp(currentPrimary[i], targetPrimary[i], 0.05);
                currentAccent[i] = lerp(currentAccent[i], targetAccent[i], 0.05);
            }

            const primaryStr = `${Math.round(currentPrimary[0])} ${Math.round(currentPrimary[1])} ${Math.round(currentPrimary[2])}`;
            const accentStr = `${Math.round(currentAccent[0])} ${Math.round(currentAccent[1])} ${Math.round(currentAccent[2])}`;


            // Draw multiple waves
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                const color = i % 2 === 0 ? primaryStr : accentStr;
                const alpha = 0.3 - (i * 0.05); // More vibrant opacity (0.3 down to 0.2)
                ctx.fillStyle = `rgb(${color} / ${alpha})`;

                // Start point
                ctx.moveTo(0, height);
                ctx.lineTo(0, height * 0.5);

                // Wave curve
                for (let x = 0; x < width; x += 10) {
                    const y = Math.sin(x * 0.003 + time + i) * 50 +
                        Math.sin(x * 0.01 + time * 2 + i) * 20 +
                        height * (0.5 + i * 0.1);
                    ctx.lineTo(x, y);
                }

                // Close path
                ctx.lineTo(width, height);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []); // Run ONCE, color updates handled by refs

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// --- Gradient Background ---
function GradientBackground({ colors }: { colors: LiveBackgroundsProps["themeColors"] }) {
    // Using CSS animation for smoother performance on gradients
    return (
        <div
            className="absolute inset-0 w-full h-full animate-gradient"
            style={{
                background: `linear-gradient(-45deg, 
                    rgb(${colors.background}), 
                    rgb(${colors.primary} / 0.2), 
                    rgb(${colors.accent} / 0.2), 
                    rgb(${colors.background}))`,
                backgroundSize: "400% 400%",
            }}
        />
    );
}

// --- Matrix Background ---
function MatrixBackground({ colors }: { colors: LiveBackgroundsProps["themeColors"] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const fontSize = 14;
        const columns = Math.floor(width / fontSize);
        const drops: number[] = new Array(columns).fill(1);
        const chars = "XYZ0123456789";

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const draw = () => {
            // Translucent black background to create trail effect
            ctx.fillStyle = `rgb(${colors.background} / 0.1)`;
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = `rgb(${colors.primary})`;
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const animate = () => {
            draw();
            animationFrameId = requestAnimationFrame(animate);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [colors]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// --- Sparkles Background (New Glamour) ---
function SparklesBackground({ colors }: { colors: LiveBackgroundsProps["themeColors"] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const sparkles: Sparkle[] = [];
        const sparkleCount = 50;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initSparkles();
        };

        class Sparkle {
            x: number;
            y: number;
            size: number;
            opacity: number;
            baseOpacity: number;
            twinkleSpeed: number;
            twinkleOffset: number;
            color: string;
            rotation: number;
            rotationSpeed: number;
            // Depth properties
            depthLayer: 0 | 1 | 2; // 0=Front, 1=Mid, 2=Back
            blur: number;
            speedY: number;

            constructor() {
                this.depthLayer = Math.random() > 0.7 ? 0 : (Math.random() > 0.4 ? 1 : 2);

                // Set properties based on depth
                if (this.depthLayer === 0) {
                    // Front: Fast, Clean, Big
                    this.blur = 0;
                    this.speedY = 0.4 + Math.random() * 0.3;
                    this.size = Math.random() * 8 + 8; // 8-16px  (Bigger stars)
                    this.baseOpacity = 0.8;
                } else if (this.depthLayer === 1) {
                    // Mid: Medium speed, Slight blur
                    this.blur = 1;
                    this.speedY = 0.2 + Math.random() * 0.2;
                    this.size = Math.random() * 6 + 4; // 4-10px
                    this.baseOpacity = 0.5;
                } else {
                    // Back: Slow, Blurry, Small
                    this.blur = 2;
                    this.speedY = 0.1 + Math.random() * 0.1;
                    this.size = Math.random() * 4 + 2; // 2-6px
                    this.baseOpacity = 0.3;
                }

                this.x = Math.random() * width;
                this.y = Math.random() * height;

                // Strict Theme Colors (Primary & Accent)
                // User Request: Restore dual colors (e.g. Purple & Green for Streamer)
                // This ensures the effect adapts to all themes using their defined 2 colors.
                const isPrimary = Math.random() > 0.5;
                this.color = isPrimary ? `rgb(${colors.primary})` : `rgb(${colors.accent})`;

                this.twinkleSpeed = Math.random() * 0.05 + 0.02;
                this.twinkleOffset = Math.random() * Math.PI * 2;
                this.opacity = this.baseOpacity;

                this.rotation = Math.random() * Math.PI * 2;
                // Constant rotation
                this.rotationSpeed = (Math.random() - 0.5) * 0.03;
            }

            update() {
                // Continuous Twinkle (Sine wave)
                // Opacity oscillates around baseOpacity +/- 0.2
                const time = Date.now() * 0.002;
                this.opacity = this.baseOpacity + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.2;
                if (this.opacity < 0) this.opacity = 0;
                if (this.opacity > 1) this.opacity = 1;

                // Upward floating
                this.y -= this.speedY;

                // Constant Rotation
                this.rotation += this.rotationSpeed;

                // Wrap vertically (Infinite Scroll logic)
                if (this.y < -50) {
                    this.y = height + 50;
                    this.x = Math.random() * width; // Randomize X on wrap
                }
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);

                // Apply Depth Blur
                if (this.blur > 0) {
                    ctx.filter = `blur(${this.blur}px)`;
                }

                // Apply Strong Glow
                ctx.shadowBlur = 25;
                ctx.shadowColor = this.color;

                ctx.fillStyle = this.color;
                // No stroke needed, fill only

                // Draw Star
                ctx.beginPath();
                const spikes = 4;
                const innerRadius = this.size * 0.25;
                const outerRadius = this.size;

                for (let i = 0; i < spikes * 2; i++) {
                    const r = (i % 2 === 0) ? outerRadius : innerRadius;
                    const a = (Math.PI * i) / spikes;
                    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
                }
                ctx.closePath();
                ctx.fill();

                ctx.restore();
            }
        }

        const initSparkles = () => {
            sparkles.length = 0;
            for (let i = 0; i < sparkleCount; i++) {
                sparkles.push(new Sparkle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Sort by depth for correct compositing
            sparkles.sort((a, b) => b.depthLayer - a.depthLayer);

            sparkles.forEach(sparkle => {
                sparkle.update();
                sparkle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [colors]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// --- Neon Eye Background (Glitter Wave Animation) ---
function NeonEyeBackground({ colors }: { colors: LiveBackgroundsProps["themeColors"] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let time = 0;

        // Load the glitter eye image
        const img = new Image();
        img.src = "/images/lashes-glitter.png";

        // Particle System
        const particles: GlitterParticle[] = [];
        const maxParticles = 120; // Increased count for better flow visibility

        class GlitterParticle {
            x: number;
            y: number;
            startX: number;
            startY: number;
            speed: number;
            size: number;
            alpha: number;
            life: number;
            maxLife: number;
            flowOffset: number;
            direction: number; // 1 for Right, -1 for Left

            constructor(emitRect: { x: number, y: number, w: number, h: number }, direction: number = 1) {
                this.direction = direction;
                // Emit from the "pink eyelid" area
                this.startX = emitRect.x + Math.random() * emitRect.w;
                this.startY = emitRect.y + Math.random() * emitRect.h;
                this.x = this.startX;
                this.y = this.startY;

                // Speed variations
                this.speed = 2 + Math.random() * 2;

                this.size = Math.random() * 2.5 + 0.5; // Finer glitter
                this.alpha = 0; // Fade in start
                this.maxLife = 150 + Math.random() * 100;
                this.life = this.maxLife;

                // Variation in the curve
                this.flowOffset = (Math.random() - 0.5) * 50;
            }

            update() {
                // Flow Physics based on Reference (Dip then Sweep Up)
                // Use absolute distance traveled to calculate the curve height
                const traveled = Math.abs(this.x - this.startX);

                // X movement
                this.x += this.speed * this.direction;

                // Y movement follows a curve based on X travel (Symmetrical U-ish sweep)
                // Logic: Drop slightly then sweep up powerfully

                let vy = 0;
                if (traveled < 60) {
                    vy = 0.5; // Short drop
                } else {
                    // Steeper acceleration upwards
                    vy = -0.025 * (traveled - 60);
                }

                // Add waviness noise
                vy += Math.sin(time * 0.05 + this.startX * 0.1) * 0.5;

                this.y += vy;

                // Fade In / Out
                const progress = 1 - (this.life / this.maxLife);
                if (progress < 0.2) this.alpha = progress * 5; // Fade in
                else if (progress > 0.8) this.alpha = (1 - progress) * 5; // Fade out
                else this.alpha = 1;

                this.life--;
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = colors.primary;
                ctx.shadowBlur = this.size * 2;
                ctx.shadowColor = colors.primary;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const drawEye = (x: number, y: number, w: number, h: number, mirror: boolean) => {
            ctx.save();

            // Apply Alive Animation (Scale/Float) - Same for both to look like a face
            const pulse = 1 + Math.sin(time * 0.03) * 0.015;
            const floatY = Math.sin(time * 0.02) * 10;

            // Translucency Oscillation
            const alphaOscillation = 0.9 + Math.sin(time * 0.025) * 0.1;

            // Apply transformation center
            const centerX = x + w / 2;
            const centerY = y + h / 2 + floatY; // Apply float here

            ctx.translate(centerX, centerY);
            ctx.scale(mirror ? -1 : 1, 1); // Mirror if needed
            ctx.scale(pulse, pulse); // Apply pulse

            // Draw Image centered at (0,0) in transformed space
            ctx.globalAlpha = alphaOscillation;
            ctx.shadowColor = colors.primary;
            ctx.shadowBlur = 20 + Math.sin(time * 0.05) * 10;

            ctx.drawImage(img, -w / 2, -h / 2, w, h);

            // Glassmorph (Source Atop)
            ctx.globalCompositeOperation = "source-atop";
            ctx.globalAlpha = 0.6;

            // Gradient needs to be in local space? Or screen space?
            // Simplest: Local space diagonal
            const gradient = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
            const shinePos = (Math.sin(time * 0.01) + 1) / 2;
            gradient.addColorStop(Math.max(0, shinePos - 0.2), "rgba(255, 255, 255, 0)");
            gradient.addColorStop(shinePos, "rgba(255, 255, 255, 0.9)");
            gradient.addColorStop(Math.min(1, shinePos + 0.2), "rgba(255, 255, 255, 0)");

            ctx.fillStyle = gradient;
            ctx.fillRect(-w / 2, -h / 2, w, h);

            ctx.restore();

            // Return the calculated screen coordinates of the emitter area for particles
            // We need to un-transform the emitter rectangle logic
            // Emitter is standard relative to unmirrored image:
            // x: 0.45w, y: 0.45h, w: 0.3w, h: 0.15h (relative to top-left)

            // If mirrored, the "right" side of the image (eyelid) becomes the "left" side in screen space?
            // Original Image: Right Eye. Eyelid/Glitter is on the right side.
            // Mirrored (Left Eye): Eyelid/Glitter should be on the LEFT side.

            // Let's calculate screen pos:
            // TopLeft of image in screen space:
            // Right Eye: x, y+floatY
            // Left Eye: x, y+floatY (but mirrored content)

            // Emitter relative to TopLeft of drawn image:
            const emRelX = w * 0.45;
            const emRelY = h * 0.45;
            const emRelW = w * 0.30;
            const emRelH = h * 0.15;

            let finalEmitX, finalEmitY;

            if (mirror) {
                // If mirrored, X is flipped relative to center.
                // Unmirrored Emitter Center X relative to image center: (emRelX + emRelW/2) - w/2
                // Mirrored Emitter Center X relative to image center = -1 * (Unmirrored...)
                // Screen X = Image Screen Center X + Mirrored Relative X - emRelW/2

                const relCenterX = (emRelX + emRelW / 2) - w / 2; // Distance from center to emitter center (positive)
                const mirroredRelCenterX = -relCenterX; // Now negative (left of center)

                finalEmitX = centerX + mirroredRelCenterX - emRelW / 2;
            } else {
                finalEmitX = x + emRelX;
            }

            finalEmitY = y + floatY + emRelY; // Y is not mirrored (vertically)

            return {
                x: finalEmitX,
                y: finalEmitY,
                w: emRelW,
                h: emRelH
            };
        }

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            if (!img.complete || img.naturalWidth === 0) return;

            const sourceW = img.naturalWidth;
            const sourceH = img.naturalHeight;

            // Check Layout Mode
            const isDesktop = width > 768; // Widescreen threshold

            if (isDesktop) {
                // --- Desktop: Dual Mirrored Eyes ---
                // Scale to fit approx half width per eye? Or cover?
                // Let's ensure they form a face in the center. overlap slightly?
                // Scale driven by height primarily to ensure coverage?
                // Let's try to fit 2 eyes in width comfortably.

                // Target: Each eye takes ~50% width?
                /* const scale = Math.min(
                    (width / 2) * 1.0 / sourceW, // Fit half width
                    height * 0.8 / sourceH // Height constraint
                ); */

                // User wants "Widescreen" vibe. Cover mode.
                // Let's make them large.
                const scale = Math.max((width / 2) / sourceW, height * 0.8 / sourceH);

                const eyeW = sourceW * scale;
                const eyeH = sourceH * scale;

                // Position: Center - Gap, Center + Gap
                const centerX = width / 2;
                const gap = eyeW * 0.05; // Small overlap or gap?
                // Face structure: Eyes are separated.
                // Right Eye (Original) goes to the Right (centerX + ...)
                // Left Eye (Mirrored) goes to the Left (centerX - ... - width)

                // Let's center the "Face".
                // Right Eye X: centerX
                // Left Eye X: centerX - eyeW
                // This puts them touching in the exact center.

                // Adjust for "Face" feel. Usually nose bridge gap.
                const bridge = eyeW * 0.1;
                const rightEyeX = centerX + bridge / 2;
                const leftEyeX = centerX - eyeW - bridge / 2;

                const commonY = (height - eyeH) / 2;

                // Draw Left Eye (Mirrored, flowing Left)
                const emitLeft = drawEye(leftEyeX, commonY, eyeW, eyeH, true);
                // Draw Right Eye (Normal, flowing Right)
                const emitRight = drawEye(rightEyeX, commonY, eyeW, eyeH, false);

                // Spawn Particles
                if (particles.length < maxParticles) {
                    // Left
                    particles.push(new GlitterParticle(emitLeft, -1));
                    // Right
                    particles.push(new GlitterParticle(emitRight, 1));
                }

            } else {
                // --- Mobile: Single Centered Eye (Existing Logic) ---
                const scale = Math.min(width * 0.9 / sourceW, height * 0.6 / sourceH);

                const drawW = sourceW * scale;
                const drawH = sourceH * scale;
                const offsetX = (width - drawW) / 2;
                const offsetY = (height - drawH) / 2;

                const emitRect = drawEye(offsetX, offsetY, drawW, drawH, false);

                if (particles.length < maxParticles) {
                    particles.push(new GlitterParticle(emitRect, 1));
                }
            }

            // Update and Draw Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw();
                if (p.life <= 0) {
                    particles.splice(i, 1);
                }
            }
        };

        const animate = () => {
            time++;
            draw();
            animationFrameId = requestAnimationFrame(animate);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [colors]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ==========================================
// CRYPTO BUBBLES BACKGROUND (Physics-based)
// ==========================================

class PhysicsBubble {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    mass: number;
    originalRadius: number;

    constructor(canvasWidth: number, canvasHeight: number, themeColors: any) {
        this.radius = Math.random() * 30 + 15; // Random radius 15-45
        this.originalRadius = this.radius;
        this.x = Math.random() * (canvasWidth - this.radius * 2) + this.radius;
        this.y = Math.random() * (canvasHeight - this.radius * 2) + this.radius;
        this.vx = (Math.random() - 0.5) * 1.5; // Slow random velocity
        this.vy = (Math.random() - 0.5) * 1.5;
        this.mass = this.radius; // Mass proportional to radius

        // Randomly assign Primary or Accent color with transparency
        const isPrimary = Math.random() > 0.5;
        this.color = isPrimary
            ? `rgb(${themeColors.primary} / 0.6)`
            : `rgb(${themeColors.accent} / 0.6)`;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Inner glass reflection (top-left)
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fill();

        // Rim glow
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    update(canvasWidth: number, canvasHeight: number, bubbles: PhysicsBubble[], mouse: { x: number, y: number }) {
        // Wall collision
        if (this.x - this.radius < 0 || this.x + this.radius > canvasWidth) {
            this.vx = -this.vx;
            this.x = Math.max(this.radius, Math.min(this.x, canvasWidth - this.radius));
        }
        if (this.y - this.radius < 0 || this.y + this.radius > canvasHeight) {
            this.vy = -this.vy;
            this.y = Math.max(this.radius, Math.min(this.y, canvasHeight - this.radius));
        }

        // Mouse Repulsion
        const dxMouse = this.x - mouse.x;
        const dyMouse = this.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        const repelRadius = 150;

        if (distMouse < repelRadius) {
            const force = (repelRadius - distMouse) / repelRadius; // 0 to 1
            const angle = Math.atan2(dyMouse, dxMouse);
            this.vx += Math.cos(angle) * force * 0.5;
            this.vy += Math.sin(angle) * force * 0.5;
        }

        // Friction/Damping
        this.vx *= 0.995;
        this.vy *= 0.995;

        // Keep a minimum movement
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed < 0.5) {
            this.vx += (Math.random() - 0.5) * 0.1;
            this.vy += (Math.random() - 0.5) * 0.1;
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Circle-Circle Collision (Simple Elastic)
        for (let other of bubbles) {
            if (other === this) continue;

            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = this.radius + other.radius;

            if (distance < minDistance) {
                // Resolve overlap
                const overlap = minDistance - distance;
                const angle = Math.atan2(dy, dx);
                const moveX = Math.cos(angle) * overlap * 0.5;
                const moveY = Math.sin(angle) * overlap * 0.5;

                this.x -= moveX;
                this.y -= moveY;
                other.x += moveX;
                other.y += moveY;

                // Elastic Collision Response
                const normalX = dx / distance;
                const normalY = dy / distance;

                // Relative velocity
                const relativeVelocityX = this.vx - other.vx;
                const relativeVelocityY = this.vy - other.vy;

                // Velocity along normal
                const velocityAlongNormal = relativeVelocityX * normalX + relativeVelocityY * normalY;

                // Do not resolve if velocities are separating
                if (velocityAlongNormal > 0) return;

                // Impulse scalar
                let j = -(1 + 0.8) * velocityAlongNormal; // 0.8 restitution (bounciness)
                j /= (1 / this.mass + 1 / other.mass);

                const impulseX = j * normalX;
                const impulseY = j * normalY;

                this.vx -= impulseX / this.mass;
                this.vy -= impulseY / this.mass;
                other.vx += impulseX / other.mass;
                other.vy += impulseY / other.mass;
            }
        }
    }
}

function CryptoBubblesBackground({ themeColors }: { themeColors: any }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bubblesRef = useRef<PhysicsBubble[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = canvas.width;
        let height = canvas.height;

        const initParticles = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            const area = width * height;
            // Density
            const count = Math.floor(area / 15000);

            bubblesRef.current = [];
            for (let i = 0; i < count; i++) {
                const bubble = new PhysicsBubble(width, height, themeColors);
                // Attempt non-overlapping spawn
                let safe = false;
                let attempts = 0;
                while (!safe && attempts < 10) {
                    safe = true;
                    for (let other of bubblesRef.current) {
                        const dx = bubble.x - other.x;
                        const dy = bubble.y - other.y;
                        if (Math.sqrt(dx * dx + dy * dy) < bubble.radius + other.radius) {
                            bubble.x = Math.random() * (width - bubble.radius * 2) + bubble.radius;
                            bubble.y = Math.random() * (height - bubble.radius * 2) + bubble.radius;
                            safe = false;
                            break;
                        }
                    }
                    attempts++;
                }
                bubblesRef.current.push(bubble);
            }
        };

        initParticles();

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            bubblesRef.current.forEach(bubble => {
                bubble.update(width, height, bubblesRef.current, mouseRef.current);
                bubble.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            initParticles();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            // Prevent default? Maybe not, it's a background
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove, { passive: true });

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [themeColors]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
            style={{ opacity: 0.8 }}
        />
    );
}

// ==========================================
// AURORA ETHEREAL BACKGROUND (Mesh Gradient)
// ==========================================

class AuroraOrb {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    angle: number;
    speed: number;

    constructor(canvasWidth: number, canvasHeight: number, color: string) {
        this.radius = Math.min(canvasWidth, canvasHeight) * (0.4 + Math.random() * 0.3); // Large radius (40-70% of screen)
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.color = color;

        // Organic wandering movement
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 1.0 + Math.random() * 1.5; // Drastically faster (was 0.2 + 0.3)
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
    }

    update(width: number, height: number) {
        // Change direction slowly (Perlin-like randomness)
        this.angle += (Math.random() - 0.5) * 0.05;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen for continuous flow
        if (this.x < -this.radius) this.x = width + this.radius;
        if (this.x > width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = height + this.radius;
        if (this.y > height + this.radius) this.y = -this.radius;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.globalCompositeOperation = "screen"; // Blend mode for light mixing
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over"; // Reset
    }
}

function AuroraBackground({ themeColors }: { themeColors: any }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const orbsRef = useRef<AuroraOrb[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const initOrbs = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // Create 3 orbs with different colors
            orbsRef.current = [
                new AuroraOrb(width, height, `rgb(${themeColors.primary})`), // Primary
                new AuroraOrb(width, height, `rgb(${themeColors.accent})`),  // Accent
                new AuroraOrb(width, height, `rgb(${themeColors.primary} / 0.5)`), // Secondary (Primary dilute)
            ];
        };

        initOrbs();

        const render = () => {
            // Clear with dark background to make screen blend mode work better
            ctx.fillStyle = `rgb(${themeColors.background})`;
            ctx.fillRect(0, 0, width, height);

            orbsRef.current.forEach(orb => {
                orb.update(width, height);
                orb.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            initOrbs();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, [themeColors]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
            style={{ filter: 'blur(60px)', opacity: 0.8 }} // Heavy global blur for mesh effect
        />
    );
}

// ==========================================
// GALAXY BACKGROUND (3D Diagonal Perspective)
// ==========================================

function GalaxyBackground({ themeColors }: { themeColors: any }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let stars: { angle: number; distance: number; speed: number; radius: number; color: string }[] = [];

        // Load Galaxy Spiral Image
        const galaxyImg = new Image();
        galaxyImg.src = "/images/galaxy-spiral.png";
        let time = 0;

        const initGalaxy = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            stars = [];
            const starCount = 750; // Optimized density
            const maxDist = Math.max(width, height) * 0.8;

            for (let i = 0; i < starCount; i++) {
                // Distributed mostly near center (exponential falloff)
                const distance = (Math.random() ** 1.5) * maxDist;
                const angle = Math.random() * Math.PI * 2;

                // Color mixing: mostly primary/accent, some white
                let color;
                const rand = Math.random();
                if (rand > 0.7) color = `rgb(${themeColors.primary})`;
                else if (rand > 0.4) color = `rgb(${themeColors.accent})`;
                else color = "white";

                stars.push({
                    angle,
                    distance,
                    speed: 0.0005, // FIXED: Sync with image rotation speed (was variable)
                    radius: Math.random() * 1.5 + 0.5,
                    color
                });
            }
        };

        const render = () => {
            time += 0.0005; // Very slow rotation

            // Fill background with specific galaxy color to match image edges
            ctx.fillStyle = "#0C1416";
            ctx.fillRect(0, 0, width, height);

            // Center of screen
            const cx = width / 2;
            const cy = height / 2;

            ctx.save();
            ctx.translate(cx, cy);

            // 1. DIAGONAL PERSPECTIVE: Rotate the entire canvas context
            // 30 degrees tilt to make it looked "diagonal"
            ctx.rotate(-30 * Math.PI / 180);

            // 2. 3D PERSPECTIVE: Scale Y to flatten the disk
            ctx.scale(1, 0.4);

            // --- DRAW GALAXY SPIRAL IMAGE ---
            // Rotate the image slowly to match the galaxy spin feel
            ctx.save();
            ctx.rotate(time); // Rotate the texture itself
            ctx.globalAlpha = 0.5; // 50% opacity as requested
            ctx.globalCompositeOperation = "screen"; // Blend mode to hide black background
            // Draw centered, size roughly matching the spread
            const imgSize = Math.max(width, height) * 1.2;
            if (galaxyImg.complete) {
                ctx.drawImage(galaxyImg, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
            }
            ctx.restore();
            // --------------------------------

            stars.forEach(star => {
                // Update
                star.angle += star.speed;

                // Draw
                const x = Math.cos(star.angle) * star.distance;
                const y = Math.sin(star.angle) * star.distance;

                // Draw Star
                ctx.beginPath();
                ctx.arc(x, y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = star.color;
                // REMOVED: shadowBlur for performance
                ctx.fill();
            });

            // Central Core
            const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 120); // Larger cinematic glow
            coreGradient.addColorStop(0, `rgb(${themeColors.primary})`);
            coreGradient.addColorStop(0.4, `rgb(${themeColors.accent} / 0.5)`);
            coreGradient.addColorStop(1, "transparent");

            ctx.fillStyle = coreGradient;
            ctx.globalCompositeOperation = "lighter";
            ctx.beginPath();
            ctx.arc(0, 0, 120, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            // CINEMATIC VIGNETTE (Overlay)
            const vignette = ctx.createRadialGradient(cx, cy, width * 0.4, cx, cy, width * 0.9);
            vignette.addColorStop(0, "transparent");
            vignette.addColorStop(1, "#0C1416"); // Fade to galaxy background color

            ctx.fillStyle = vignette;
            ctx.globalCompositeOperation = "source-over"; // Overlay on top of everything
            ctx.fillRect(0, 0, width, height);

            animationFrameId = requestAnimationFrame(render);
        };

        initGalaxy();
        render();

        const handleResize = () => {
            initGalaxy();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, [themeColors]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
        />
    );
}

// --- Tech Grid Background (Cyber Perspective) ---
export function TechGridBackground({ colors }: { colors: LiveBackgroundsProps["themeColors"] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let time = 0;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const animate = () => {
            // Clear with dark fade for trail effect? No, clean abstract look.
            ctx.fillStyle = "#000000"; // Solid black base
            ctx.fillRect(0, 0, width, height);

            time += 2; // Speed of movement

            // Perspective Parameters
            const horizonY = height * 0.2; // Horizon line position (High horizon = looking down at floor)
            // Let's create a "Data Highway"

            ctx.lineWidth = 1;
            ctx.strokeStyle = `rgb(103 254 253 / 0.3)`; // #67FEFD converted to RGB for opacity
            ctx.shadowBlur = 5;
            ctx.shadowColor = `rgb(103 254 253 / 0.5)`;

            // 1. VERTICAL LINES (Converging rays)
            // Vanishing point is at (width/2, horizonY)
            const vpX = width / 2;
            const vpY = horizonY; // Horizon

            // Draw rays from vanishing point upwards/downwards
            const raysCount = 20;
            ctx.beginPath();
            for (let i = -raysCount; i <= raysCount; i++) {
                const bottomX = width / 2 + (i * 150);
                ctx.moveTo(vpX, vpY);
                ctx.lineTo(bottomX, height);
            }
            ctx.stroke();

            // 2. HORIZONTAL LINES (Moving towards viewer)
            const numLines = 30;
            const phase = (time % 100) / 100; // 0 to 1

            ctx.beginPath();
            for (let i = 0; i < numLines; i++) {
                // Exponential spacing for perspective
                let z = (i / numLines) + phase / numLines;
                if (z > 1) z -= 1;

                // y position
                const y = horizonY + (Math.pow(z, 2)) * (height - horizonY);

                if (y > height) continue;

                const alpha = z * 0.8;
                ctx.strokeStyle = `rgb(103 254 253 / ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Vignette
            const grad = ctx.createLinearGradient(0, 0, 0, height);
            grad.addColorStop(0, "black");
            grad.addColorStop(0.2, "transparent");
            grad.addColorStop(0.8, "transparent");
            grad.addColorStop(1, "black");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            animationFrameId = requestAnimationFrame(animate);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [colors]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />;
}
