import { FaCaretRight } from "react-icons/fa";

type HeaderLinks = Array<{
  icon: React.ReactNode;
  href: string;
  text: string;
}>;

export const HEADER_LINKS: HeaderLinks = [
  {
    icon: <FaCaretRight className="size-3.5" />,
    href: "/",
    text: "Home",
  },

  {
    icon: <FaCaretRight className="size-3.5" />,
    href: "/shop",
    text: "Shop",
  },

  {
    icon: <FaCaretRight className="size-3.5" />,
    href: "/blog",
    text: "Blog",
  },
];
