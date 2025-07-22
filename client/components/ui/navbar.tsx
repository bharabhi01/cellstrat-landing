import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
    className?: string;
}

export function Navbar({ className }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const leftNavLinks = [
        { name: "About", href: "#about" },
        { name: "Services", href: "#services" },
        { name: "Products", href: "#products" },
    ];

    const rightNavLinks = [
        { name: "Learning", href: "#learning" },
        { name: "Careers", href: "#careers" },
    ];

    const allNavLinks = [...leftNavLinks, ...rightNavLinks];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white/10 backdrop-blur-md border-b border-white/20"
                    : "bg-white/5 backdrop-blur-md border-b border-white/10",
                className
            )}
        >
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20 max-w-7xl mx-auto">

                    {/* Left Navigation - Desktop */}
                    <div className="hidden lg:flex items-center space-x-10">
                        {leftNavLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200 relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                    </div>

                    {/* Logo - Center */}
                    <div className="flex-shrink-0">
                        <img
                            src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288"
                            alt="CellStrat Logo"
                            className="h-16 md:h-20 w-auto object-contain"
                        />
                    </div>

                    {/* Right Navigation + CTA - Desktop */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {rightNavLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200 relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                        <button className="bg-transparent border-2 border-blue-500/60 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300 ml-2">
                            Get In Touch
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-white p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <div
                className={cn(
                    "lg:hidden fixed inset-0 top-16 md:top-20 bg-black/95 backdrop-blur-lg transition-all duration-300 z-40",
                    isOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                )}
            >
                <div className="flex flex-col items-center justify-start pt-8 px-6 space-y-6">
                    {allNavLinks.map((link, index) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "text-white text-xl font-medium transition-all duration-300 transform",
                                isOpen
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-4 opacity-0"
                            )}
                            style={{
                                transitionDelay: isOpen ? `${index * 100}ms` : "0ms",
                            }}
                        >
                            {link.name}
                        </a>
                    ))}

                    <div className={cn(
                        "pt-4 transition-all duration-300 transform",
                        isOpen
                            ? "translate-y-0 opacity-100"
                            : "translate-y-4 opacity-0"
                    )}
                        style={{
                            transitionDelay: isOpen ? `${allNavLinks.length * 100}ms` : "0ms",
                        }}>
                        <button className="bg-transparent border-2 border-blue-500/60 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300">
                            Get In Touch
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
} 