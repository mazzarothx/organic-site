"use client";

import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";
import { TbCameraPlus } from "react-icons/tb";

interface ProfileImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <CldUploadWidget onUpload={onUpload} uploadPreset="cl490s4g">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <div className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-dashed border-border">
              {value.length > 0 ? (
                <div
                  className="relative h-36 w-36 cursor-pointer overflow-hidden rounded-full"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Image
                    width={144}
                    height={144}
                    className="object-cover"
                    alt="Profile"
                    src={value[0]}
                  />
                  {hovered && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition delay-75 duration-300 hover:bg-opacity-50">
                      <Button
                        type="button"
                        // onClick={() => onRemove(value[0])}
                        onClick={onClick}
                        variant="link3"
                        className="flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-full text-white opacity-0 transition delay-75 duration-300 hover:opacity-100"
                      >
                        <TbCameraPlus className="h-9 w-9" />
                        <span className="text-sm">Upload photo</span>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-36 w-36 cursor-pointer items-center justify-center rounded-full bg-backgroundsecondary transition delay-75 duration-300 hover:bg-opacity-80">
                  <Button
                    type="button"
                    variant="link3"
                    disabled={disabled}
                    onClick={onClick}
                    className="flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-full text-textactive"
                  >
                    <TbCameraPlus className="h-9 w-9" />
                    <span className="text-sm">Upload photo</span>
                  </Button>
                </div>
              )}
            </div>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ProfileImageUpload;
