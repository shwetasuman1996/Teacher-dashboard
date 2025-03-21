import React, { useState } from 'react';

const StudentProfile = ({ selectedStudent }) => {
  const [hover, setHover] = useState(false);

  if (!selectedStudent) return <p className="p-4">Select a student to view profile.</p>;

  return (
    <div
      className="p-4 bg-gray-100 rounded-lg shadow-md relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <p className="text-lg font-semibold">{selectedStudent.name}</p>
      {hover && (
        <div className="absolute top-12 left-0 bg-white p-4 border rounded shadow-lg z-10">
          <p><strong>Role Number:</strong> {selectedStudent.role_number}</p>
          <p><strong>Name:</strong> {selectedStudent.name}</p>
          <p><strong>Mobile:</strong> {selectedStudent.mobile_number}</p>
          <p><strong>Registration:</strong> {selectedStudent.registration_number}</p>
          <p><strong>Email:</strong> {selectedStudent.email}</p>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;