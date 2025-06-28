"use client";
import { useEffect, useState } from "react";
import ListCard from "./ListCard";
import AppointmentService, {
  Appointment,
  Category,
} from "../services/AppointmentService";

type ListComponentProps = {
  appointments: Appointment[];
  categories: Category[];
};

// Helper function to format date as Day, Date. Month (e.g., Monday, 28. June)
const formatDate = (date: string) => {
  const d = new Date(date);
  // Format the date using Intl.DateTimeFormat
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long", // Full weekday name (e.g., "Monday")
    day: "2-digit", // Day of the month (e.g., "28")
    month: "long", // Full month name (e.g., "June")
  }).format(d);
};

// Helper function to group appointments by date
const groupByDate = (appointments: Appointment[]) => {
  const grouped: { [key: string]: Appointment[] } = {};

  appointments.forEach((appointment) => {
    const dateKey = formatDate(appointment.start); // Group by the start date (You could use end date or any other criteria)

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push(appointment);
  });

  return grouped;
};

const ListComponent: React.FC<ListComponentProps> = ({
  appointments,
  categories,
}) => {
  // Group appointments by date
  const groupedAppointments = groupByDate(appointments);

  return (
    <div className="w-1/2 p-5 justify-center items-center">
      <div className="flex flex-col gap-4">
        {/* Iterate through grouped appointments */}
        {Object.entries(groupedAppointments).map(([date, appointments]) => (
          <div key={date}>
            <h2 className="text-xl font-semibold mb-2 text-black">{date}</h2>{" "}
            {/* Display the date header */}
            {appointments.map((appointment) => (
              <ListCard
                key={appointment.id}
                appointment={appointment}
                categories={categories}
              />
            ))}
          </div>
        ))}
        <p className="text-center text-gray-500">
          Keine weiteren Termine gefunden
        </p>
      </div>
    </div>
  );
};

export default ListComponent;
