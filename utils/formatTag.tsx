// utils.ts veya benzeri bir dosyada
import React from 'react';

export const formatText = (text: string) => {
  if (!text) return ""; // Eğer text boş veya undefined ise, boş string döndür

  const parts = text.split(/(#\w+)/g); // # ile başlayan kelimeleri ayır
  return parts.map((part, index) => {
    if (part.startsWith('#')) {
      return <span key={index} className="text-blue-500 hover:underline hover:cursor-pointer">{part}</span>; // Mavi renkte göster
    }
    return part; // Diğer metin parçalarını olduğu gibi bırak
  });
};
