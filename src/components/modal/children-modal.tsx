"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Modal } from "./modal";

interface ChildrenModalProps {
  title?: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  children: React.ReactNode;
  className?: string;
}

export const ChildrenModal: React.FC<ChildrenModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  loading,
  children,
  className,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
      className={cn("bg-dash-background-primary border-none", className)}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        {children}
      </div>
    </Modal>
  );
};
