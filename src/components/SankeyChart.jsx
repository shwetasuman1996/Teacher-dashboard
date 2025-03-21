import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

const SankeyChart = ({ selectedStudent }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!selectedStudent) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 700;
    const height = 450;

    const subjects = selectedStudent.subjects || {};
    const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4'];
    const subjectNames = Object.keys(subjects);

    const nodes = [
      ...years.map(year => ({ name: year })),
      ...subjectNames.map(subject => ({ name: subject })),
    ];

    const links = [];
    years.forEach((year, yIdx) => {
      subjectNames.forEach((subject, sIdx) => {
        const yearKey = `year_${year.split(' ')[1].toLowerCase()}`;
        const value = subjects[subject]?.[yearKey] ?? 0;
        if (value > 0) {
          links.push({
            source: yIdx,
            target: years.length + sIdx,
            value: value,
          });
        }
      });
    });

    const sankeyGenerator = sankey()
      .nodeWidth(20)
      .nodePadding(30)
      .extent([[20, 20], [width - 20, height - 20]]);

    const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator({
      nodes: nodes.map(d => ({ ...d })),
      links: links.map(d => ({ ...d })),
    });

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    svg.attr('viewBox', `0 0 ${width} ${height}`)
       .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g');

    g.append('g')
      .selectAll('path')
      .data(sankeyLinks)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke', d => colorScale(d.target.name))
      .attr('stroke-width', d => Math.max(2, d.value))
      .attr('opacity', 0.6)
      .transition()
      .duration(1000)
      .attr('opacity', 0.9);

    g.append('g')
      .selectAll('rect')
      .data(sankeyNodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => Math.max(10, d.y1 - d.y0))
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => colorScale(d.name))
      .attr('stroke', '#fff')
      .attr('rx', 5);

    g.append('g')
      .selectAll('text')
      .data(sankeyNodes)
      .join('text')
      .attr('x', d => d.x0 - 10)
      .attr('y', d => (d.y0 + d.y1) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .text(d => d.name)
      .attr('fill', '#333')
      .attr('font-size', 14)
      .attr('font-weight', 'bold');

  }, [selectedStudent]);

  return <svg ref={svgRef} className="bg-white shadow-lg rounded-lg" />;
};

export default SankeyChart;