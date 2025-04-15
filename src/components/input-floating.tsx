import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import * as React from "react";
import { useState } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // Add some additional properties or methods here
  placeholder?: string;
}

type FloatingInputProps = InputProps & {
  label?: string;
  labelClassName?: string;
  variant?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      className,
      label,
      labelClassName,
      type,
      variant,
      leftIcon,
      rightIcon,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const disabled =
      props.value === "" || props.value === undefined || props.disabled;
    return (
      <>
        {(variant === undefined || variant === "default") && (
          <div className="relative w-full">
            <input
              type={type}
              placeholder={label ? " " : props.placeholder}
              className={cn(
                "peer text-textprimary placeholder:text-textunactive flex h-[56px] w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                className,
              )}
              ref={ref}
              {...props}
            />
            {label && (
              <label
                className={cn(
                  "bg-sidebar text-textunactive dark:bg-background pointer-events-none absolute start-2 top-2 origin-[0] -translate-y-4 scale-75 transform px-2 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
                  labelClassName,
                )}
              >
                {label}
              </label>
            )}
          </div>
        )}
        {variant === "password" && (
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={label ? " " : props.placeholder}
              className={cn(
                "border-io-input-border peer placeholder:text-textunactive flex h-[56px] w-full rounded-md border bg-transparent px-3 py-1 text-sm text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                className,
              )}
              ref={ref}
              {...props}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={disabled}
            >
              {showPassword && !disabled && (
                <EyeIcon className="h-4 w-4" aria-hidden="true" />
              )}
              {!showPassword && !disabled && (
                <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
            {label && (
              <label
                className={cn(
                  "bg-sidebar text-textunactive dark:bg-background pointer-events-none absolute start-2 top-2 origin-[0] -translate-y-4 scale-75 transform px-2 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
                  labelClassName,
                )}
              >
                {label}
              </label>
            )}
          </div>
        )}
        {variant === "passwordFixLabel" && (
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={props.placeholder}
              className={cn(
                "border-io-input-border placeholder:text-textunactive flex h-[56px] w-full rounded-md border bg-transparent px-3 py-1 text-sm text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                className,
              )}
              ref={ref}
              {...props}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={disabled}
            >
              {showPassword && (
                <EyeIcon className="h-4 w-4" aria-hidden="true" />
              )}
              {!showPassword && (
                <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
            {label && (
              <label
                className={cn(
                  "bg-sidebar text-textunactive dark:bg-background pointer-events-none absolute start-2 top-2 origin-[0] -translate-y-4 scale-75 transform px-2 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
                  labelClassName,
                )}
              >
                {label}
              </label>
            )}
          </div>
        )}

        {variant === "leftIcon" && (
          <div className="relative">
            {leftIcon && (
              <div className="text-io-text-secondary absolute inset-y-0 left-0 flex items-center pl-3">
                {leftIcon}
              </div>
            )}
            <input
              type={type}
              placeholder={props.placeholder}
              className={cn(
                "border-io-input-border placeholder:text-textunactive flex h-[56px] w-full rounded-md border bg-transparent px-3 py-1 pl-8 text-sm text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                className,
              )}
              ref={ref}
              {...props}
            />
            {label && (
              <label
                className={cn(
                  "bg-sidebar text-textunactive dark:bg-background pointer-events-none absolute start-2 top-2 origin-[0] -translate-y-4 scale-75 transform px-2 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
                  labelClassName,
                )}
              >
                {label}
              </label>
            )}
          </div>
        )}
        {variant === "rightIcon" && (
          <div className="relative">
            {rightIcon && (
              <div className="text-io-text-secondary absolute inset-y-0 right-0 flex items-center pr-3">
                {rightIcon}
              </div>
            )}
            <input
              type={type}
              placeholder={props.placeholder}
              className={cn(
                "border-io-input-border placeholder:text-textunactive flex h-[56px] w-full rounded-md border bg-transparent px-3 py-1 text-sm text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                className,
              )}
              ref={ref}
              {...props}
            />
            {label && (
              <label
                className={cn(
                  "bg-sidebar text-textunactive dark:bg-background pointer-events-none absolute start-2 top-2 origin-[0] -translate-y-4 scale-75 transform px-2 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
                  labelClassName,
                )}
              >
                {label}
              </label>
            )}
          </div>
        )}
        {variant === "fixLabel" && (
          <div className="relative">
            <input
              type={type}
              placeholder={props.placeholder}
              className={cn(
                "border-io-input-border placeholder:text-textunactive flex h-[56px] w-full rounded-md border bg-transparent px-3 py-1 text-sm text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                className,
              )}
              ref={ref}
              {...props}
            />
            {label && (
              <label
                className={cn(
                  "bg-sidebar text-textunactive dark:bg-background pointer-events-none absolute start-2 top-2 origin-[0] -translate-y-4 scale-75 transform px-2 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
                  labelClassName,
                )}
              >
                {label}
              </label>
            )}
          </div>
        )}
      </>
    );
  },
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
