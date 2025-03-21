import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SunburstChart = ({ selectedStudent }) => {
  const svgRef = useRef();
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!selectedStudent) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Define a color palette
    const colorScale = d3.scaleOrdinal()
      .domain(['English', 'Maths', 'Physics', 'Chemistry', 'Attendance', 'Skills', 'Academic Performance'])
      .range(['#ff6f61', '#ffd700', '#6b7280', '#34d399', '#60a5fa', '#facc15', '#a78bfa']);

    // Prepare data
    const subjects = selectedStudent.subjects || {};
    const hierarchy = {
      name: 'root',
      children: [
        ...Object.entries(subjects).map(([subject, marks]) => ({
          name: subject,
          children: [
            { name: 'Year 1', value: marks.year_1 || 0 },
            { name: 'Year 2', value: marks.year_2 || 0 },
            { name: 'Year 3', value: marks.year_3 || 0 },
            { name: 'Year 4', value: marks.year_4 || 0 },
          ].filter(child => child.value > 0),
        })),
        { name: 'Attendance', children: [
            { name: 'Year 1', value: selectedStudent.attendance?.year_1 || 0 },
            { name: 'Year 2', value: selectedStudent.attendance?.year_2 || 0 },
            { name: 'Year 3', value: selectedStudent.attendance?.year_3 || 0 },
            { name: 'Year 4', value: selectedStudent.attendance?.year_4 || 0 },
          ].filter(child => child.value > 0),
        },
        { name: 'Skills', children: (selectedStudent.extra_skills || []).map(skill => ({
          name: skill,
          value: 20, // Arbitrary value for skills
        }))},
        { name: 'Academic Performance', children: [
            { name: 'Year 1', value: subjects.English?.year_1 + subjects.Maths?.year_1 + subjects.Physics?.year_1 + subjects.Chemistry?.year_1 || 0 },
            { name: 'Year 2', value: subjects.English?.year_2 + subjects.Maths?.year_2 + subjects.Physics?.year_2 + subjects.Chemistry?.year_2 || 0 },
            { name: 'Year 3', value: subjects.English?.year_3 + subjects.Maths?.year_3 + subjects.Physics?.year_3 + subjects.Chemistry?.year_3 || 0 },
            { name: 'Year 4', value: subjects.English?.year_4 + subjects.Maths?.year_4 + subjects.Physics?.year_4 + subjects.Chemistry?.year_4 || 0 },
          ].filter(child => child.value > 0),
        },
      ],
    };

    const root = d3.hierarchy(hierarchy).sum(d => d.value);
    const partition = d3.partition().size([2 * Math.PI, radius]);
    partition(root);

    const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);

    const g = svg
      .attr('width', width)
      .attr('height', height + 60) 
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Draw arcs
    g.selectAll('path')
      .data(root.descendants().slice(1))
      .join('path')
      .attr('d', arc)
      .attr('fill', d => colorScale(d.depth === 1 ? d.data.name : d.parent.data.name))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);

    // Handle text labels
    const textSelection = g.selectAll('text')
      .data(root.descendants().filter(d => d.depth === 1))
      .join('text')
      .attr('font-size', 12)
      .attr('fill', '#333')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em');

    textSelection.each(function (d) {
      const text = d3.select(this);
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      let y = (d.y0 + d.y1) / 2 + 30; // Move text outward

      text.attr('transform', `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`);

      // Check for long text
      const words = d.data.name.split(' ');
      if (words.length > 1) {
        text.selectAll('tspan')
          .data(words)
          .join('tspan')
          .attr('x', 0)
          .attr('dy', (d, i) => i * 12) // Line spacing
          .text(d => d);
      } else {
        text.text(d.data.name);
      }
    });

  }, [selectedStudent]);

  return (
    <>
      <svg ref={svgRef} />
      <div ref={tooltipRef} className="hidden" />
    </>
  );
};

export default SunburstChart;
