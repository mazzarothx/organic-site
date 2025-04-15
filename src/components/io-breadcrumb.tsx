import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

interface IoHeadingProps {
  title: string;
  src: string;
}

export const IoBreadcrumb: React.FC<IoHeadingProps> = ({ title, src }) => {
  // Split the src path into segments and filter out any empty segments
  const pathSegments = src.split("/").filter(Boolean);

  // Create a breadcrumb link for each segment except the last one
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const name = segment.charAt(0).toUpperCase() + segment.slice(1);

    // For all but the last segment, create a BreadcrumbLink
    if (index < pathSegments.length - 1) {
      return (
        <React.Fragment key={href}>
          <BreadcrumbItem>
            <BreadcrumbLink href={href} className="">
              {name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </React.Fragment>
      );
    }

    // For the last segment, create a BreadcrumbPage
    return (
      <BreadcrumbItem key={href}>
        <BreadcrumbPage>{name}</BreadcrumbPage>
      </BreadcrumbItem>
    );
  });

  return (
    <div className="flex flex-col gap-4">
      {/* <h4 className="text-2xl font-semibold tracking-tight">{title}</h4> */}
      <Breadcrumb>
        <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
