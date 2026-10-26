import logoColor from "@/assets/logos/vdm-lockup-color.png";
import logoWhite from "@/assets/logos/vdm-lockup-white.png";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "color" | "white";
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
};

const sources = {
  color: logoColor,
  white: logoWhite,
};

export function Logo({
  variant = "color",
  width = 99,
  height = 40,
  className,
  alt = "VDM Consultores",
}: LogoProps) {
  return (
    <img
      src={sources[variant]}
      alt={alt}
      width={width}
      height={height}
      className={cn("block h-10 w-auto select-none", className)}
      draggable={false}
    />
  );
}
