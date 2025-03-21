import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ selectedStudent }) => {
  if (!selectedStudent) return <p className="p-4">Select a student to view data.</p>;

  const averageMarks = selectedStudent.subjects
    ? Object.values(selectedStudent.subjects)
        .map(subject =>
          Object.values(subject).reduce((sum, mark) => sum + mark, 0) / 4
        )
        .reduce((sum, avg) => sum + avg, 0) / Object.keys(selectedStudent.subjects).length
    : 0;

  const averageAttendance = selectedStudent.attendance
    ? Object.values(selectedStudent.attendance).reduce((sum, att) => sum + att, 0) / 4
    : 0;

  const extraSkillsCount = selectedStudent.extra_skills?.length || 0;

  const data = {
    labels: ['Average Marks', 'Average Attendance', 'Extra Skills'],
    datasets: [
      {
        data: [averageMarks, averageAttendance, extraSkillsCount * 10],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;

            // Default label format for all sections
            let labelText = `${label}: ${value.toFixed(2)}`;

            // Append % for Average Marks and Average Attendance
            if (label === 'Average Marks' || label === 'Average Attendance') {
              labelText += '%';
            }

            // Customize for "Extra Skills" section
            if (label === 'Extra Skills' && selectedStudent.extra_skills?.length) {
              const skillsList = selectedStudent.extra_skills.join(', ');
              labelText += `\nSkills: ${skillsList}`;
            }

            return labelText;
          },
        },
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 14,
          weight: 'bold',
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
      <div style={{ width: '80%', height: '80%' }}>
        <h3 className="text-lg font-semibold mb-2 text-center">Performance Overview</h3>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;