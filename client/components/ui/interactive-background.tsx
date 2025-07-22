import { useState, useEffect, useRef } from 'react';

interface Dot {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
}

export function InteractiveBackground() {
    const [dots, setDots] = useState<Dot[]>([]);
    const [isFollowingCursor, setIsFollowingCursor] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const animationRef = useRef<number>();
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize dots
    useEffect(() => {
        const initializeDots = () => {
            const newDots: Dot[] = [];
            const numDots = 50; // Number of dots

            for (let i = 0; i < numDots; i++) {
                newDots.push({
                    id: i,
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    vx: (Math.random() - 0.5) * 2, // Random velocity between -1 and 1
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 3 + 1, // Size between 1 and 4
                });
            }
            setDots(newDots);
        };

        initializeDots();
        window.addEventListener('resize', initializeDots);
        return () => window.removeEventListener('resize', initializeDots);
    }, []);

    // Handle mouse movement
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Handle background click
    const handleBackgroundClick = (e: React.MouseEvent) => {
        // Only toggle if clicking on the background itself, not on content
        if (e.target === e.currentTarget) {
            setIsFollowingCursor(!isFollowingCursor);
        }
    };

    // Animation loop
    useEffect(() => {
        const animate = () => {
            setDots(prevDots =>
                prevDots.map(dot => {
                    let newX = dot.x;
                    let newY = dot.y;
                    let newVx = dot.vx;
                    let newVy = dot.vy;

                    if (isFollowingCursor) {
                        // Move towards cursor
                        const dx = mousePosition.x - dot.x;
                        const dy = mousePosition.y - dot.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance > 0) {
                            const force = Math.min(distance / 100, 2); // Limit force
                            newVx = (dx / distance) * force;
                            newVy = (dy / distance) * force;
                        }
                    } else {
                        // Random movement with boundary bouncing
                        if (dot.x <= 0 || dot.x >= window.innerWidth) {
                            newVx = -dot.vx;
                        }
                        if (dot.y <= 0 || dot.y >= window.innerHeight) {
                            newVy = -dot.vy;
                        }
                    }

                    // Update position
                    newX = dot.x + newVx;
                    newY = dot.y + newVy;

                    // Keep dots within bounds
                    newX = Math.max(0, Math.min(window.innerWidth, newX));
                    newY = Math.max(0, Math.min(window.innerHeight, newY));

                    return {
                        ...dot,
                        x: newX,
                        y: newY,
                        vx: newVx,
                        vy: newVy,
                    };
                })
            );

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isFollowingCursor, mousePosition]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-0"
            onClick={handleBackgroundClick}
            style={{ pointerEvents: 'auto' }}
        >
            {dots.map(dot => (
                <div
                    key={dot.id}
                    className="absolute bg-white rounded-full opacity-30 transition-opacity duration-300"
                    style={{
                        left: `${dot.x}px`,
                        top: `${dot.y}px`,
                        width: `${dot.size}px`,
                        height: `${dot.size}px`,
                        transform: 'translate(-50%, -50%)',
                        opacity: isFollowingCursor ? 0.6 : 0.3,
                    }}
                />
            ))}

            {/* Click indicator */}
            {isFollowingCursor && (
                <div
                    className="absolute pointer-events-none z-10"
                    style={{
                        left: `${mousePosition.x}px`,
                        top: `${mousePosition.y}px`,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <div className="w-4 h-4 border-2 border-white/50 rounded-full animate-pulse" />
                </div>
            )}
        </div>
    );
} 