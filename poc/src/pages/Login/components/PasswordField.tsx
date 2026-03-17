import { useState } from "react";
import type{ UseFormRegisterReturn } from "react-hook-form";
// Optional: If you use Lucide icons (common in Tailwind projects)
// import { Eye, EyeOff } from "lucide-react"; 

interface Props {
  label?: string;
  placeholder?: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

const PasswordField = ({ 
  label = "Password", 
  placeholder = "••••••••", 
  error, 
  registration 
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md outline-none transition-all pr-10 ${
            error 
              ? "border-red-500 bg-red-50 focus:ring-1 focus:ring-red-200" 
              : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          }`}
          {...registration}
        />
        
        {/* Toggle Button */}
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
             <span className="text-xs font-bold uppercase">Hide</span>
          ) : (
             <span className="text-xs font-bold uppercase">Show</span>
          )}
          {/* If using icons, replace the spans with:
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} 
          */}
        </button>
      </div>
      
      {error && (
        <p className="text-red-500 text-xs mt-1 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordField;