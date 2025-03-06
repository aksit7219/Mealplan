// import React, { useState } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css'; // Optional, only if you want default styles

// const CalendarComponent = () => {
//   const [date, setDate] = useState(new Date()); // Initializes state with today's date

//   const handleDateChange = (newDate) => {
//     setDate(newDate);
//   };

//   return (
//     <div style={{ width: '300px', margin: '0 auto' }}>
//       <Calendar onChange={handleDateChange}  />  
//     </div>
//   );
// };

// export default CalendarComponent;




import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Optional, only if you want default styles

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date()); // Initializes state with today's date

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div style={{ width: '300px', margin: '0 auto' }}>
      <Calendar
        onChange={handleDateChange}
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            // Highlight today's date
            if (date.toDateString() === new Date().toDateString()) {
              return 'highlight-today';
            }
          }
        }}
      />
      <style jsx>{`
        .highlight-today {
          background: #000000; /* Customize background color */
          border-radius: 50%; /* Circular shape */
          color: white; /* Text color */
        }
        .react-calendar__tile {
          border-radius: 0; /* Remove default border radius */
        }
        .react-calendar__navigation {
          font-weight: bold; /* Makes month navigation bold */
        }
        .react-calendar__month-view__weekdays {
          font-weight: bold; /* Makes day names bold */
        }
        .custom-day {
          font-weight: normal; /* Reset font weight for day cells */
        }
        .react-calendar__tile--active {
          background: #111111; /* Customize background color */
          border-radius: 50%; /* Circular shape */
          color: white; /* Text color */
        }
        .react-calendar__tile {
          border-radius: 50%; /* Ensure circular shape for all tiles */
        }
      `}</style>
    </div>
  );
};

export default CalendarComponent;
