import { FaExclamationTriangle } from "react-icons/fa";

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-error/20 p-3 text-sm text-error">
      <FaExclamationTriangle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
