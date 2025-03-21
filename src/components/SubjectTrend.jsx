import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SubjectTrend = ({ selectedStudent }) => {
  if (!selectedStudent) return <p className="p-4">Select a student to view trends.</p>;

  // Define getColor function before using it
  const getColor = (index) => {
    const colors = ['#FF6384', '#FFFF00', '#36A2EB', '#00FF00', '#0000FF']; // Red, Yellow, Blue, Green, Cyan
    return colors[index % colors.length];
  };

  const data = {
    labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4'],
    datasets: Object.entries(selectedStudent.subjects || {}).map(([subject, marks], index) => ({
      label: subject,
      data: [marks.year_1, marks.year_2, marks.year_3, marks.year_4],
      borderColor: getColor(index),
      backgroundColor: getColor(index),
      fill: false,
      tension: 0.1, // Smooth lines to match reference image
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: window.devicePixelRatio || 2, // Ensure high-DPI rendering for sharper text
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14, // Increase legend font size for clarity
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", // Use a clean font
            weight: 'bold',
          },
          padding: 15, // Add padding to legend items
        },
      },
      title: {
        display: true,
        text: 'Marks Trend Over Years',
        font: {
          size: 16, // Increase title font size
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          weight: 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 14,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14, // Increase x-axis tick font size
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          font: {
            size: 14, // Increase y-axis tick font size
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          },
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex items-center justify-center" style={{ width: '100%', height: '400px' }}>
      <div style={{ width: '90%', height: '90%' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default SubjectTrend;