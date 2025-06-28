import React, { useState, useRef, useEffect } from "react";
import { Category } from "../services/AppointmentService";

type NavBarProps = {
  view: "list" | "week" | "month";
  onViewChange: (view: "list" | "week" | "month") => void;
  categories: Category[];
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
};

const NavBar: React.FC<NavBarProps> = ({
  view,
  onViewChange,
  categories,
  selectedCategoryId,
  onCategoryChange,
  selectedDate,
  onDateChange,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Handle date change
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(event.target.value); // Directly call onDateChange to update the parent component
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow rounded w-full text-black flex-wrap gap-4 relative">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Date Picker */}
        <label htmlFor="datePicker" className="sr-only">
          Datum auswählen
        </label>
        <input
          id="datePicker"
          name="datePicker"
          type="date"
          className="border rounded px-3 py-1 text-sm"
          value={selectedDate} // Use the selectedDate passed from props for display
          onChange={handleDateChange} // Call handleDateChange to update selectedDate
        />

        {/* View Switch Buttons */}
        <div className="flex items-center gap-2">
          {["list", "week", "month"].map((v) => (
            <button
              key={v}
              className={`px-3 py-1 text-sm rounded ${
                view === v
                  ? "bg-gray-300 text-black"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
              type="button"
              onClick={() => onViewChange(v as "list" | "week" | "month")}
            >
              {v === "list" ? "Liste" : v === "week" ? "Woche" : "Monat"}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 text-black relative">
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="flex items-center gap-1 px-3 py-1 text-sm border rounded hover:bg-gray-50"
            type="button"
          >
            Termine filtern
          </button>

          {showFilter && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-10">
              <button
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  selectedCategoryId === null ? "font-semibold" : ""
                }`}
                onClick={() => onCategoryChange(null)}
                type="button"
              >
                Alle Kategorien
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    selectedCategoryId === cat.id ? "font-semibold" : ""
                  }`}
                  onClick={() => onCategoryChange(cat.id)}
                  type="button"
                >
                  <div className="flex flex-row justify-start items-start gap-2">
                    <div
                      className="w-3 h-3"
                      style={{ backgroundColor: cat?.color || "#000000" }}
                    />
                    {cat.label}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="px-4 py-1 text-sm text-white bg-black rounded hover:bg-gray-800"
          type="button"
        >
          + Neuer Termin
        </button>
      </div>
    </div>
  );
};

export default NavBar;
