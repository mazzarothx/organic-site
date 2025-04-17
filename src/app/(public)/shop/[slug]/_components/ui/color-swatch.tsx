"use client";

interface ColorSwatchProps {
  color: string;
  size?: "sm" | "md" | "lg";
}

export function ColorSwatch({ color, size = "md" }: ColorSwatchProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full`}
      style={{ backgroundColor: color }}
    />
  );
}
