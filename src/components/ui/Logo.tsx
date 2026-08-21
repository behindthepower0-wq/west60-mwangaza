import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "white";
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { width: 100, height: 48 },
  md: { width: 140, height: 64 },
  lg: { width: 180, height: 80 },
};

export function Logo({ className, variant = "default", size = "md" }: LogoProps) {
  const { width, height } = sizes[size];
  
  return (
    <Link 
      href="/" 
      className={cn("flex items-center flex-shrink-0 transition-all duration-300", className)}
    >
      <Image
        src="/images/logo.png"
        alt="West 60 Mwangaza Properties"
        width={width}
        height={height}
        className={cn("object-contain transition-all duration-300", variant === "white" && "brightness-[1.3]")}
        priority
      />
    </Link>
  );
}
