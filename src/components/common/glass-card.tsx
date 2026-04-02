import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  hover = false,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        hover ? "glass-card-hover" : "glass-card",
        "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
