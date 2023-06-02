import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import '../css/Calendar.css'; 
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [medicalCenterId, setMedicalCenterId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    fetch(`http://localhost:8080/api/user/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.medicalCenterId) {
          setMedicalCenterId(data.medicalCenterId);
        } else if (data.medicalCenter && data.medicalCenter.id) {
          setMedicalCenterId(data.medicalCenter.id);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/medical/terms/${medicalCenterId}`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const formattedEvents = data.map((term) => {
            const startDate = new Date(term.dateOfTerm);
            const endDate = new Date(startDate.getTime() + term.duration * 60 * 1000); 
            startDate.setHours(startDate.getHours() - 2); 
            endDate.setHours(endDate.getHours() - 2); 
            return {
              title: "Free Term",
              start: startDate,
              end: endDate,
            };
          });
          setEvents(formattedEvents);
        } else {
          console.error("Error fetching events:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [medicalCenterId]);

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      eventPropGetter={(event) => {
        if (event.title === 'Free Term') {
          return {
            className: 'rbc-event--free',
          };
        }
        return {};
      }}
    />
  );
}

export default MyCalendar;
