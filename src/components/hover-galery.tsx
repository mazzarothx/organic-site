"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const items = [
  {
    color: "bg-red-500",
    image: "https://via.placeholder.com/150", // URL da imagem
    title: "Jornada Orgânica",
    link: "https://jornadaorganica.com.br",
  },
  {
    color: "bg-blue-500",
    image: "https://via.placeholder.com/150",
    title: "Outro Projeto",
    link: "https://exemplo.com",
  },
  {
    color: "bg-green-500",
    image: "https://via.placeholder.com/150",
    title: "Mais um Projeto",
    link: "https://outroexemplo.com",
  },
  {
    color: "bg-red-500",
    image: "https://via.placeholder.com/150", // URL da imagem
    title: "Jornada Orgânica",
    link: "https://jornadaorganica.com.br",
  },
  {
    color: "bg-blue-500",
    image: "https://via.placeholder.com/150",
    title: "Outro Projeto",
    link: "https://exemplo.com",
  },
  {
    color: "bg-green-500",
    image: "https://via.placeholder.com/150",
    title: "Mais um Projeto",
    link: "https://outroexemplo.com",
  },
  {
    color: "bg-red-500",
    image: "https://via.placeholder.com/150", // URL da imagem
    title: "Jornada Orgânica",
    link: "https://jornadaorganica.com.br",
  },
  {
    color: "bg-blue-500",
    image: "https://via.placeholder.com/150",
    title: "Outro Projeto",
    link: "https://exemplo.com",
  },
  {
    color: "bg-green-500",
    image: "https://via.placeholder.com/150",
    title: "Mais um Projeto",
    link: "https://outroexemplo.com",
  },
  {
    color: "bg-red-500",
    image: "https://via.placeholder.com/150", // URL da imagem
    title: "Jornada Orgânica",
    link: "https://jornadaorganica.com.br",
  },
  {
    color: "bg-blue-500",
    image: "https://via.placeholder.com/150",
    title: "Outro Projeto",
    link: "https://exemplo.com",
  },
  {
    color: "bg-green-500",
    image: "https://via.placeholder.com/150",
    title: "Mais um Projeto",
    link: "https://outroexemplo.com",
  },
  {
    color: "bg-red-500",
    image: "https://via.placeholder.com/150", // URL da imagem
    title: "Jornada Orgânica",
    link: "https://jornadaorganica.com.br",
  },
  {
    color: "bg-blue-500",
    image: "https://via.placeholder.com/150",
    title: "Outro Projeto",
    link: "https://exemplo.com",
  },
  {
    color: "bg-green-500",
    // image: "https://via.placeholder.com/150",
    title: "Mais um Projeto 2",
    link: "https://outroexemplo.com",
  },
  // Adicione mais itens conforme necessário
];

export default function HoverGallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex h-[70vh] w-full gap-2 px-5">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`relative h-full rounded-lg ${item.color}`}
          initial={{ flex: 1 }}
          animate={{
            flex: hoveredIndex !== null && hoveredIndex !== index ? 0.5 : 1, // Ajusta os tamanhos ao passar o mouse
          }}
          whileHover={{ flex: 4 }} // Expande o item ao passar o mouse
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onMouseEnter={() => setHoveredIndex(index)} // Define o índice do item hovered
          onMouseLeave={() => setHoveredIndex(null)} // Remove o hover ao sair
        >
          {/* Imagem */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>

          {/* Título (exibido apenas quando expandido) */}
          {hoveredIndex === index && (
            <div className="bg-opacity-50 absolute right-0 bottom-0 left-0 rounded-b-lg p-4 text-center text-white">
              <h2 className="text-lg font-bold">{item.title}</h2>
            </div>
          )}

          {/* Link (redireciona ao clicar no item) */}
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0"
          />
        </motion.div>
      ))}
    </div>
  );
}
