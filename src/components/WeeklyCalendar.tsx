"use client";

import React, { useState } from "react";
import { Appointment, Category } from "../services/AppointmentService";
import { CiClock2 } from "react-icons/ci";
import ListCard from "../components/ListCard"; // Update path as needed

type WeeklyCalendarProps = {
  appointments: Appointment[];
  categories: Category[];
};

const getStartOfWeek = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay(); // 0 = Sunday
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(d);
};

const getWeekDates = (startOfWeek: Date) => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
};

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  appointments,
  categories,
}) => {
  const [selectedDate] = useState(new Date());
  const startOfWeek = getStartOfWeek(selectedDate);
  const weekDates = getWeekDates(startOfWeek);
  const timeSlots = Array.from({ length: 9 }, (_, i) => `${6 + i}:00`);

  const appointmentsByDate = weekDates.reduce((acc, date) => {
    const key = date.toDateString();
    acc[key] = appointments.filter(
      (a) => new Date(a.start).toDateString() === key
    );
    return acc;
  }, {} as Record<string, Appointment[]>);

  const getCategoryColor = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    return cat?.color || "#808080"; // Fallback gray
  };

  const today = new Date();
  const currentTime = today.getHours();

  return (
    <div className="p-5 text-black">
      {/* Week Header */}
      <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] mb-2 font-bold text-center">
        <div></div>
        {weekDates.map((date, idx) => (
          <div
            key={idx}
            className={`py-2 ${
              date.toDateString() === today.toDateString()
                ? "bg-green-100 border border-green-400"
                : ""
            }`}
          >
            {formatDate(date.toISOString())}
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] text-black">
        {timeSlots.map((slot, i) => (
          <React.Fragment key={i}>
            {/* Time Label */}
            <div className="text-sm text-right pr-2 py-4">{slot}</div>

            {/* Daily Columns */}
            {weekDates.map((date, dIdx) => {
              const dayKey = date.toDateString();
              const slotHour = Number(slot.split(":")[0]);

              const slotAppointments = (
                appointmentsByDate[dayKey] || []
              ).filter((a) => {
                const start = new Date(a.start).getHours();
                const end = new Date(a.end).getHours();
                return start <= slotHour && end > slotHour;
              });

              const isToday = date.toDateString() === today.toDateString();
              const isCurrentHour = slotHour === currentTime && isToday;

              return (
                <div
                  key={dIdx}
                  className="relative border border-gray-200 bg-gray-50 min-h-[60px] px-1 text-black"
                >
                  {isCurrentHour && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500 z-10" />
                  )}

                  {slotAppointments.map((a) => (
                    <div
                      key={a.id}
                      className="mb-1 rounded"
                      style={{
                        backgroundColor: `${getCategoryColor(
                          a.category ?? ""
                        )}4D`,
                      }}
                    >
                      <ListCard
                        appointment={a}
                        categories={categories}
                        inWeeklyCalendar={true}
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
