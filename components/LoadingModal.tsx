import React from "react";

interface LoadingProps {
  size?: number; // Yükleme spinner'ının boyutunu belirtmek için bir prop
  className?: string; // Ekstra stil sınıfları ekleyebilmek için
}

const LoadingModal: React.FC<LoadingProps> = ({ size = 24, className }) => {
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <svg
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={size}
        height={size}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
    </div>
  );
};

export default LoadingModal;
