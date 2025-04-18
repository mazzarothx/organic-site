import { BsFillPatchCheckFill } from "react-icons/bs";
import { FaClock as FaClockAlt } from "react-icons/fa6";
import { TbShieldCheckFilled } from "react-icons/tb";

export const ProductHighlights = () => (
  <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-24 sm:px-24">
    {[
      {
        icon: <BsFillPatchCheckFill className="text-dash-primary h-6 w-6" />,
        title: "100% original",
        description: "Produtos de qualidade garantida.",
      },
      {
        icon: <FaClockAlt className="text-dash-primary h-6 w-6" />,
        title: "10 dias para troca",
        description: "Trocas fáceis e rápidas.",
      },
      {
        icon: <TbShieldCheckFilled className="text-dash-primary h-6 w-6" />,
        title: "Garantia de 1 ano",
        description: "Garantia contra defeitos.",
      },
    ].map((item, index) => (
      <div key={index} className="flex flex-col items-center gap-4">
        {item.icon}
        <div className="flex flex-col items-center gap-1">
          <p className="font-semibold">{item.title}</p>
          <p className="text-dash-text-secondary text-center text-sm">
            {item.description}
          </p>
        </div>
      </div>
    ))}
  </div>
);
