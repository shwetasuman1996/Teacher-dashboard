import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CustomCalendar = () => {
  const [value, onChange] = React.useState(new Date());

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Calendar</h3>
      <Calendar onChange={onChange} value={value} />
    </div>
  );
};

export default CustomCalendar;