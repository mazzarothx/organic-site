"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface SocialIconsProps {
  description: string;
  children: React.ReactNode;
  className?: string;
}

export const CopyApi: React.FC<SocialIconsProps> = ({
  description,
  children,
  className,
}) => {
  const onCopy = (description: string) => {
    navigator.clipboard.writeText(description);
    toast.success("Copied to clipboard.");
  };

  return (
    <div>
      <Button
        className={className}
        variant="checkbox"
        onClick={() => onCopy(description)}
      >
        {children}
      </Button>
      {/* <FaDiscord
          size={20}
          className=" text-textunactive hover:text-textprimary transition-colors"
        /> */}
    </div>
  );
};

export default CopyApi;
