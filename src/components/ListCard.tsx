import { useEffect, useState } from "react";
import { Appointment, Category } from "../services/AppointmentService";
import { TiLocationOutline } from "react-icons/ti";
import { CiClock2 } from "react-icons/ci";
import { MdOutlineSpeakerNotes } from "react-icons/md";

type ListCardProps = {
  appointment: Appointment;
  categories: Category[];
  inWeeklyCalendar?: boolean; // Optional prop for WeeklyCalendar
};

const ListCard: React.FC<ListCardProps> = ({
  appointment,
  categories,
  inWeeklyCalendar = false,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
  };

  const formatTime = (utcString: string) => {
    const date = new Date(utcString);
    return new Intl.DateTimeFormat("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Berlin",
    }).format(date);
  };

  useEffect(() => {
    const foundCategory = categories.find(
      (cat) => cat.id === appointment.category
    );
    setCategory(foundCategory || null);
  }, [appointment.category, categories]);

  // Compose background color
  const backgroundColor = inWeeklyCalendar
    ? `${category?.color ?? "#808080"}4D`
    : "white";

  return (
    <div
      className="text-black w-full rounded p-5 relative"
      style={{ backgroundColor }}
    >
      <label htmlFor="checkbox" className="sr-only">
        Appointment checkbox
      </label>

      <input
        id="checkbox"
        name="checkbox"
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="h-5 w-5 absolute top-3 right-3"
      />

      <div className="mb-3 flex items-center gap-2">
        {!inWeeklyCalendar && (
          <div
            className="w-3 h-3"
            style={{ backgroundColor: category?.color || "#000000" }}
          />
        )}

        <h3 className={isChecked ? "line-through" : ""}>{appointment.title}</h3>
      </div>

      <p className="flex items-center gap-2 ">
        <CiClock2 />
        {formatTime(appointment.start)} Uhr bis {formatTime(appointment.end)}{" "}
        Uhr
      </p>
      <p className="flex items-center gap-2">
        <TiLocationOutline />
        {appointment.location}
      </p>
      <p className="flex items-center gap-2">
        <MdOutlineSpeakerNotes /> {appointment.notes}
      </p>
    </div>
  );
};

export default ListCard;
