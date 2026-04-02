import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image
        src="/updateLogo (1).png"
        alt="Adstacker"
        width={200}
        height={200}
        className="h-8 w-8"
      />
      {!iconOnly && (
        <span className="text-lg font-bold text-foreground">
          Ad<span className="gradient-text">stacker</span>
        </span>
      )}
    </Link>
  );
}
