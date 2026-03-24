import React from 'react'

export default function MobileHeader({ title }) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 pt-7 px-5 pb-2 rounded-b-[26px]">
      <div className="text-xl font-extrabold text-white tracking-tight">
        {title}
      </div>
    </div>
  );
}