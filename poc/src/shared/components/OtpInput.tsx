import type { UseFormRegisterReturn } from "react-hook-form";

export const OtpInput = ({ error, registration }: { error?: string, registration: UseFormRegisterReturn }) => (
  <div className="flex flex-col items-center">
    <input
      {...registration}
      className="w-48 text-center text-2xl tracking-[0.5em] font-bold border-b-2 border-gray-400 focus:border-blue-600 outline-none pb-1"
      placeholder="0000"
      maxLength={4}
    />
    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
  </div>
);