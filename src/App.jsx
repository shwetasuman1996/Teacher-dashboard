import React, { useState, useEffect } from 'react';
import Dropdown from './components/Dropdown';
import Calendar from './components/Calendar';
import PieChart from './components/PieChart';
import SankeyChart from './components/SankeyChart';
import SunburstChart from './components/SunburstChart';
import StudentProfile from './components/StudentProfile';
import SubjectTrend from './components/SubjectTrend';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-600 p-4">
          <p>Error rendering chart: {this.state.error?.message || 'Unknown error'}</p>
          <p>Please check the console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedChart, setSelectedChart] = useState('None');

  useEffect(() => {
    // fetch('/src/assets/data.json')
    //   .then(res => res.json())
    //   .then(data => {
  //       setStudents(data);
  //       setSelectedStudent(data[0] || null);
  //     })
  //     .catch(err => console.error('Error fetching data:', err));
  // }, []);
  fetch("/data.json")
  .then((res) => res.json())  // Convert response to JSON
  .then((data) => {
    console.log(data);  // Log the fetched data to check if it's coming correctly

    setStudents(data);  // Update the students state
    setSelectedStudent(data[0] || null);  // Set the first student as selected
  })
  .catch((err) => console.error("Error fetching data:", err));
}, []);


  const handleSelect = (roleNumber) => {
    const student = students.find(s => s.role_number === roleNumber);
    setSelectedStudent(student);
  };

  const handleChartSelect = (chart) => {
    setSelectedChart(chart);
  };

  const closeModal = () => {
    setSelectedChart('None');
  };

  const chartOptions = [
    { value: 'None', label: 'Select Chart...' },
    { value: 'Sankey Chart', label: 'Sankey Chart' },
    { value: 'Sunburst Chart', label: 'Sunburst Chart' },
  ];

  // Define color mapping for subjects with 80% opacity
  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'English':
        return 'rgba(139, 94, 154, 0.8)'; // Darker Purple with 80% opacity
      case 'Maths':
        return 'rgba(212, 160, 23, 0.8)'; // Darker Yellow with 80% opacity
      case 'Physics':
        return 'rgba(42, 64, 102, 0.8)'; // Darker Blue with 80% opacity
      case 'Chemistry':
        return 'rgba(165, 42, 42, 0.8)'; // Darker Pink with 80% opacity
      case 'Biology':
        return 'rgba(211, 84, 0, 0.8)'; // Darker Orange with 80% opacity
      case 'Computer Science':
        return 'rgba(74, 85, 104, 0.8)'; // Darker Purple with 80% opacity
      default:
        return '#E5E7EB'; // Fallback color (gray)
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/4 p-4 bg-white shadow-md space-y-6 overflow-auto" style={{ maxHeight: '100vh' }}>
        <h2 className="text-xl font-bold">Teacher Dashboard</h2>
        <StudentProfile selectedStudent={selectedStudent} />
        <Dropdown students={students} onSelect={handleSelect} />
        <Calendar />
        <div className="space-y-4">
          <label className="text-lg font-semibold mb-2 ">Select Chart</label>
          <select
            value={selectedChart}
            onChange={(e) => handleChartSelect(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {chartOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-full md:w-3/4 p-4" style={{ pointerEvents: selectedChart === 'None' ? 'auto' : 'none', opacity: selectedChart === 'None' ? 1 : 0.5 }}>
        <h1 className="text-2xl font-bold mb-4">Hi, Welcome back 👋</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {selectedStudent?.subjects ? (
            Object.entries(selectedStudent.subjects).map(([subject, marks]) => (
              <div key={subject} style={{ backgroundColor: getSubjectColor(subject) }} className="p-4 rounded-lg shadow-md">
                <h3 className="text-lg  font-semibold">{subject}</h3>
                {/* <p>Year 1: {marks.year_1 || 'N/A'}</p>
                <p>Year 2: {marks.year_2 || 'N/A'}</p>
                <p>Year 3: {marks.year_3 || 'N/A'}</p> */}
                <p className=" text-5xl font-semibold text-grey-800">
                {/* <p className="text-black mix-blend-darken bg-green-300 text-2xl font-bold p-2"> */}
                  {marks.year_4 || 'N/A'}</p>
              </div>
            ))
          ) : (
            <p>Select a student to view subject marks.</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <PieChart selectedStudent={selectedStudent} />
          <SubjectTrend selectedStudent={selectedStudent} />
        </div>
        <button className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Upgrade to Pro 
        </button>
      </div>

      {/* Modal Overlay */}
      {selectedChart !== 'None' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <ErrorBoundary>
            <div className="bg-white p-6 rounded-lg shadow-lg relative" style={{ minWidth: '600px', minHeight: '400px' }} onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">{selectedChart}</h3>
              {selectedChart === 'Sankey Chart' && <SankeyChart selectedStudent={selectedStudent} />}
              {selectedChart === 'Sunburst Chart' && <SunburstChart selectedStudent={selectedStudent} />}
              <button
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
};

export default App;