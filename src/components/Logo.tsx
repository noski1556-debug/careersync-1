import { TrendingUp } from "lucide-react";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
}

export function Logo({ 
  className = "", 
  iconClassName = "h-5 w-5",
  showText = true 
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground shadow-sm">
        <TrendingUp className={iconClassName} />
      </div>
      {showText && (
        <span className="font-bold text-xl tracking-tight">
          Evoluskill
        </span>
      )}
    </div>
  );
}