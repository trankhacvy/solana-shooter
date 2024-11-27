import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/utils/shadcn";
import { twMerge } from "tailwind-merge";

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
        {...props}
    />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full", className)}
        {...props}
    />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            className,
        )}
        {...props}
    />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const StyledAvatar: React.FC<
    AvatarPrimitive.AvatarProps & {
        src?: string | null;
        fallbackString?: string;
        contain?: boolean;
        classNames?: {
            avatar?: string;
            image?: string;
            fallback?: string;
        };
    }
> = (props) => {
    return (
        <Avatar {...props} className={twMerge(props.classNames?.avatar)}>
            <AvatarImage
                src={props.src || ""}
                className={twMerge(
                    props.contain ? "object-contain" : "object-cover",
                    props.classNames?.image,
                )}
            />
            <AvatarFallback className={twMerge(props.classNames?.fallback)}>
                {props.fallbackString}
            </AvatarFallback>
        </Avatar>
    );
};

export { Avatar, AvatarImage, AvatarFallback, StyledAvatar };
