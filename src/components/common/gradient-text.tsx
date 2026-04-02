import { cn } from "@/lib/utils";

export function GradientText({
  children,
  className,
  as: Component = "span",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Component className={cn("gradient-text", className)}>
      {children}
    </Component>
  );
}
