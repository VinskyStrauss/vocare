"use client";

import { useEffect, useState } from "react";
import ListComponent from "../components/ListComponent";
import NavBar from "../components/NavBar";
import WeeklyCalendar from "../components/WeeklyCalendar";
import AppointmentService, {
  Appointment,
  Category,
} from "../services/AppointmentService";

export default function Home() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [view, setView] = useState<"list" | "week" | "month">("list");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());

  // Helper function to get the current date in YYYY-MM-DD format
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Fetch appointments from service
  const fetchAppointments = async () => {
    try {
      const response = await AppointmentService.getAllAppointments();
      if (!response) {
        console.error("No appointments found");
        return;
      }
      setAppointments(response);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Fetch categories from service
  const fetchCategories = async () => {
    try {
      const response = await AppointmentService.getAllCategories();
      if (!response) {
        console.error("No categories found");
        return;
      }
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchCategories();
  }, []);

  // Filter appointments based on category and selected date
  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = appointment.start.split("T")[0];
    return (
      (selectedCategoryId
        ? appointment.category === selectedCategoryId
        : true) && appointmentDate === selectedDate
    );
  });

  // Handle date change
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
  };

  return (
    <div className="items-center justify-items-center p-8 pb-20 gap-16">
      <NavBar
        view={view}
        onViewChange={setView}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={setSelectedCategoryId}
        selectedDate={selectedDate} // Pass selectedDate to NavBar
        onDateChange={handleDateChange} // Pass the handleDateChange function to NavBar
      />

      <main className="flex flex-col bg-gray-200 w-full rounded justify-center items-center">
        {view === "list" && (
          <ListComponent
            appointments={filteredAppointments}
            categories={categories}
          />
        )}

        {view === "week" && (
          <WeeklyCalendar
            appointments={filteredAppointments}
            categories={categories}
          />
        )}

        {view === "month" && (
          <div className="text-center p-8 text-gray-500">
            Monatsansicht ist in Arbeit...
          </div>
        )}
      </main>
    </div>
  );
}
