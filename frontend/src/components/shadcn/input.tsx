import * as React from "react";

import { cn } from "@/utils/shadcn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon, ...props }, ref) => {
        return (
            <label className="flex h-10 w-full cursor-text items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                {icon && <span className="shrink-0 text-muted-foreground">{icon}</span>}
                <input type={type} className={cn("grow", className)} ref={ref} {...props} />
            </label>
        );
    },
);
Input.displayName = "Input";

export { Input };
