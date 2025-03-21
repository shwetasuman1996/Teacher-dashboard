import React from 'react';
import Select from 'react-select';

const Dropdown = ({ students, onSelect }) => {
  const options = students.map(student => ({
    value: student.role_number,
    label: student.name,
  }));

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Select Student</h3>
      <Select
        options={options}
        onChange={option => onSelect(option.value)}
        placeholder="Select a student..."
        className="basic-single"
        classNamePrefix="select"
      />
    </div>
  );
};

export default Dropdown;