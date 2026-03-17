import type { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

export const InputField = ({ label, type = "text", placeholder, error, registration }: Props) => (
  <div className="w-full mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-md outline-none transition-colors ${
        error ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
      }`}
      {...registration}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);