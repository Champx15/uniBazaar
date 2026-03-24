import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";

export default function FilterModal({ isOpen, onClose, onApply, triggerRef, onReset }) {
  const [priceMin, setPriceMin] = useState(200);
  const [priceMax, setPriceMax] = useState(10000);
  const [condition, setCondition] = useState([]);
  const [department, setDepartment] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const departments = ["Medical", "CS", "Business", "Engineering"];
  

  const handlePriceMinChange = (e) => {
    const value = parseInt(e.target.value);
    if (value <= priceMax) {
      setPriceMin(value);
    }
  };

  const handlePriceMaxChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= priceMin) {
      setPriceMax(value);
    }
  };

const handleConditionChange = (cond) => {
  setCondition((prev) =>
    prev.includes(cond)
      ? prev.filter((c) => c !== cond) // remove if already selected
      : [...prev, cond] // add if not selected
  );
};

  const handleApply = () => {
    const filters = {
      minPrice: priceMin, maxPrice: priceMax,
      condition,
      department,
    };
    onApply(filters);
    onClose();
  };



  const handleReset = () => {
    setPriceMin(200);
    setPriceMax(10000);
    setCondition("");
    setDepartment("");
    onReset();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        style={{ background: "transparent" }}
      />

      {/* Modal positioned relative to trigger */}
      <div
        className="fixed z-50 w-[350px] max-h-[80vh] bg-white rounded-xl shadow-2xl overflow-y-auto"
        style={{
          top: triggerRef?.current
            ? triggerRef.current.getBoundingClientRect().top +
              triggerRef.current.getBoundingClientRect().height +
              23
            : 0,
          left: triggerRef?.current
            ? triggerRef.current.getBoundingClientRect().left-319
            : 0,
        }}
      >
        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            border: 3px solid #1a6bff;
            box-shadow: 0 2px 8px rgba(26, 107, 255, 0.3);
            pointer-events: auto;
          }

          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            border: 3px solid #1a6bff;
            box-shadow: 0 2px 8px rgba(26, 107, 255, 0.3);
            pointer-events: auto;
          }

          input[type="range"]::-webkit-slider-thumb:hover {
            background: #f0f7ff;
            box-shadow: 0 4px 12px rgba(26, 107, 255, 0.4);
          }

          input[type="range"]::-moz-range-thumb:hover {
            background: #f0f7ff;
            box-shadow: 0 4px 12px rgba(26, 107, 255, 0.4);
          }
        `}</style>

        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="md:text-xl text-lg font-semibold bg-gradient-to-br from-[#1a6bff] to-[#0038BB] bg-clip-text text-transparent">
              Refine your search
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          {/* Price Range Section */}
          <div className="md:mb-3 mb-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-black">
                Price range
              </label>
              <div className="flex md:gap-2 gap-1 items-center">
                <span className="text-xs font-medium text-[#1a6bff]">
                  ₹{priceMin.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">–</span>
                <span className="text-xs font-medium text-[#1a6bff]">
                  ₹{priceMax.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="relative h-10 mt-2 flex items-center">
              <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-[#e6f1fb] via-[#1a6bff] to-[#0038BB] rounded-full" />

              <input
                type="range"
                min="0"
                max="10000"
                value={priceMin}
                onChange={handlePriceMinChange}
                step="100"
                className="absolute w-full h-10 appearance-none bg-transparent cursor-pointer pointer-events-none z-5"
              />
              <input
                type="range"
                min="0"
                max="10000"
                value={priceMax}
                onChange={handlePriceMaxChange}
                step="100"
                className="absolute w-full h-10 appearance-none bg-transparent cursor-pointer pointer-events-none z-3"
              />
            </div>

            <div className="flex justify-between md:text-xs text-sm text-gray-500 mt-2">
              <span>₹0</span>
              <span>₹10,000</span>
            </div>
          </div>

          {/* Condition Section */}
          <div className="md:mb-5 mb-2">
            <label className="text-sm font-semibold text-black block mb-2">
              Condition
            </label>
            <div className="flex flex-col gap-2.5">
              {["Like new", "Fair condition", "Needs repair"].map((cond) => (
                <label
                  key={cond}
                  className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-lg border transition-all ${
                    condition === cond
                      ? "bg-gray-50 border-[#1a6bff]"
                      : "border-gray-200 bg-transparent hover:border-[#1a6bff] hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="condition"
                    checked={condition.includes(cond)}
                    onChange={() => handleConditionChange(cond)}
                    className="w-4 h-4 cursor-pointer accent-[#1a6bff]"
                  />
                  <span className="text-sm text-black">{cond}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Department Section - Dropdown */}
          <div className="mb-3">
            <label className="text-sm font-semibold text-black block mb-2">
              Department
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full px-3 py-3 text-sm rounded-lg border transition-all flex justify-between items-center ${
                  isDropdownOpen
                    ? "border-[#1a6bff] bg-white"
                    : "border-gray-200 bg-white hover:border-[#1a6bff]"
                }`}
              >
                <span className={department ? "text-black" : "text-gray-500"}>
                  {department || "Select department"}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-20 overflow-y-auto bg-white border border-gray-200 rounded-lg z-10 shadow-lg">
                  {departments.map((dept) => (
                    <div
                      key={dept}
                      onClick={() => {
                        setDepartment(dept);
                        setIsDropdownOpen(false);
                      }}
                      className={`px-3 py-3 text-sm cursor-pointer transition-all border-b border-gray-100 last:border-b-0 ${
                        department === dept
                          ? "bg-gray-50 text-[#1a6bff] font-semibold"
                          : "text-black hover:bg-gray-50"
                      }`}
                    >
                      {dept}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-3 text-sm font-semibold text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-br from-[#1a6bff] to-[#0038BB] rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// import React, { useState, useEffect } from "react";
// import { X, ChevronDown } from "lucide-react";

// export default function FilterModal({ isOpen, onClose, onApply, triggerRef }) {
//   const [priceMin, setPriceMin] = useState(500);
//   const [priceMax, setPriceMax] = useState(10000);
//   const [condition, setCondition] = useState("");
//   const [department, setDepartment] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const departments = ["Medical", "CS", "Business", "Engineering"];

//   // Close modal when page scrolls
//   useEffect(() => {
//     if (isOpen) {
//       const handleScroll = () => {
//         onClose();
//       };

//       // Use capture phase to catch all scroll events
//       window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
//       return () => window.removeEventListener("scroll", handleScroll, { capture: true });
//     }
//   }, [isOpen, onClose]);

//   const handlePriceMinChange = (e) => {
//     const value = parseInt(e.target.value);
//     if (value <= priceMax) {
//       setPriceMin(value);
//     }
//   };

//   const handlePriceMaxChange = (e) => {
//     const value = parseInt(e.target.value);
//     if (value >= priceMin) {
//       setPriceMax(value);
//     }
//   };

//   const handleConditionChange = (cond) => {
//     setCondition(cond);
//   };

//   const handleApply = () => {
//     const filters = {
//       priceRange: { min: priceMin, max: priceMax },
//       condition,
//       department,
//     };
//     onApply(filters);
//     onClose();
//   };

//   const handleReset = () => {
//     setPriceMin(500);
//     setPriceMax(10000);
//     setCondition("");
//     setDepartment("");
//   };

//   if (!isOpen) return null;

//   return (
//     // No backdrop, just modal - allows background scroll
//     <div
//       className="fixed z-50 w-[350px] max-h-[80vh] bg-white rounded-xl shadow-2xl overflow-y-auto"
//       style={{
//         top: triggerRef?.current
//           ? triggerRef.current.getBoundingClientRect().top +
//             triggerRef.current.getBoundingClientRect().height +
//             23
//           : 0,
//         left: triggerRef?.current
//           ? triggerRef.current.getBoundingClientRect().left - 319
//           : 0,
//       }}
//     >
//       <style>{`
//         input[type="range"]::-webkit-slider-thumb {
//           -webkit-appearance: none;
//           appearance: none;
//           width: 20px;
//           height: 20px;
//           border-radius: 50%;
//           background: white;
//           cursor: pointer;
//           border: 3px solid #1a6bff;
//           box-shadow: 0 2px 8px rgba(26, 107, 255, 0.3);
//           pointer-events: auto;
//         }

//         input[type="range"]::-moz-range-thumb {
//           width: 20px;
//           height: 20px;
//           border-radius: 50%;
//           background: white;
//           cursor: pointer;
//           border: 3px solid #1a6bff;
//           box-shadow: 0 2px 8px rgba(26, 107, 255, 0.3);
//           pointer-events: auto;
//         }

//         input[type="range"]::-webkit-slider-thumb:hover {
//           background: #f0f7ff;
//           box-shadow: 0 4px 12px rgba(26, 107, 255, 0.4);
//         }

//         input[type="range"]::-moz-range-thumb:hover {
//           background: #f0f7ff;
//           box-shadow: 0 4px 12px rgba(26, 107, 255, 0.4);
//         }
//       `}</style>

//       <div className="p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold bg-gradient-to-br from-[#1a6bff] to-[#0038BB] bg-clip-text text-transparent">
//             Refine your search
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 transition"
//             aria-label="Close"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {/* Price Range Section */}
//         <div className="mb-3">
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-semibold text-black">
//               Price range
//             </label>
//             <div className="flex gap-2 items-center">
//               <span className="text-xs font-medium text-[#1a6bff]">
//                 ₹{priceMin.toLocaleString()}
//               </span>
//               <span className="text-xs text-gray-500">–</span>
//               <span className="text-xs font-medium text-[#1a6bff]">
//                 ₹{priceMax.toLocaleString()}
//               </span>
//             </div>
//           </div>

//           <div className="relative h-10 mt-2 flex items-center">
//             <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-[#e6f1fb] via-[#1a6bff] to-[#0038BB] rounded-full" />

//             <input
//               type="range"
//               min="0"
//               max="10000"
//               value={priceMin}
//               onChange={handlePriceMinChange}
//               step="100"
//               className="absolute w-full h-10 appearance-none bg-transparent cursor-pointer pointer-events-none z-5"
//             />
//             <input
//               type="range"
//               min="0"
//               max="10000"
//               value={priceMax}
//               onChange={handlePriceMaxChange}
//               step="100"
//               className="absolute w-full h-10 appearance-none bg-transparent cursor-pointer pointer-events-none z-3"
//             />
//           </div>

//           <div className="flex justify-between text-xs text-gray-500 mt-2">
//             <span>₹0</span>
//             <span>₹10,000</span>
//           </div>
//         </div>

//         {/* Condition Section */}
//         <div className="mb-5">
//           <label className="text-sm font-semibold text-black block mb-2">
//             Condition
//           </label>
//           <div className="flex flex-col gap-2.5">
//             {["Like new", "Fair condition", "Needs repair"].map((cond) => (
//               <label
//                 key={cond}
//                 className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-lg border transition-all ${
//                   condition === cond
//                     ? "bg-gray-50 border-[#1a6bff]"
//                     : "border-gray-200 bg-transparent hover:border-[#1a6bff] hover:bg-gray-50"
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name="condition"
//                   checked={condition === cond}
//                   onChange={() => handleConditionChange(cond)}
//                   className="w-4 h-4 cursor-pointer accent-[#1a6bff]"
//                 />
//                 <span className="text-sm text-black">{cond}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Department Section - Dropdown */}
//         <div className="mb-3">
//           <label className="text-sm font-semibold text-black block mb-2">
//             Department
//           </label>
//           <div className="relative">
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className={`w-full px-3 py-3 text-sm rounded-lg border transition-all flex justify-between items-center ${
//                 isDropdownOpen
//                   ? "border-[#1a6bff] bg-white"
//                   : "border-gray-200 bg-white hover:border-[#1a6bff]"
//               }`}
//             >
//               <span className={department ? "text-black" : "text-gray-500"}>
//                 {department || "Select department"}
//               </span>
//               <ChevronDown
//                 size={16}
//                 className={`transition-transform ${
//                   isDropdownOpen ? "rotate-180" : "rotate-0"
//                 }`}
//               />
//             </button>

//             {isDropdownOpen && (
//               <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg z-10 shadow-lg">
//                 {departments.map((dept) => (
//                   <div
//                     key={dept}
//                     onClick={() => {
//                       setDepartment(dept);
//                       setIsDropdownOpen(false);
//                     }}
//                     className={`px-3 py-3 text-sm cursor-pointer transition-all border-b border-gray-100 last:border-b-0 ${
//                       department === dept
//                         ? "bg-gray-50 text-[#1a6bff] font-semibold"
//                         : "text-black hover:bg-gray-50"
//                     }`}
//                   >
//                     {dept}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-3 pt-4 border-t border-gray-200">
//           <button
//             onClick={handleReset}
//             className="flex-1 px-4 py-3 text-sm font-semibold text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Reset
//           </button>
//           <button
//             onClick={handleApply}
//             className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-br from-[#1a6bff] to-[#0038BB] rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
//           >
//             Apply filters
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }