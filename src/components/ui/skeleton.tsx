/**
 * shadcn/ui `skeleton` primitive — reusable, theme-aware UI building block. Styled via tokens in src/styles.css.
 */
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-primary/10", className)} {...props} />;
}

export { Skeleton };
