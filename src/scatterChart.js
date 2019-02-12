import React, { Component } from 'react';
import * as d3 from 'd3';
import * as json from './data/data.json';

class ScatterChart extends Component {
  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const margin = {
      top: -30,
      right: 70,
      bottom: 0,
      left: 50
    };

    const data = json.values;
    const width = this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;


    const svg = d3.select("body")
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr("preserveAspectRatio", 'xMidYMid meet')
      .attr("viewBox", "0 0 880 600")
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const t = d3.select("body")
      .append("div")
      .attr("class", "tooltip-custom")
      .style("opacity", 0);


    const xScale = d3.scaleLinear()
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .range([height, 0]);

    const radius = d3.scaleSqrt()
      .range([2, 25]);

    const xAxis = d3.axisBottom()
      .scale(xScale);

    const yAxis = d3.axisLeft()
      .scale(yScale);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    //data.keys.shift();
    data.forEach(function(d) {
      d["Annualized Return"] = +d["Annualized Return"];
      d["Omega Ratio"] = +d["Omega Ratio"];
      d["Sharpe Ratio"] = +d["Sharpe Ratio"];
      d["Current Drought"] = +d["Current Drought"];
    })

    xScale.domain(d3.extent(data, function(d) {
      return d["Annualized Return"];
    })).nice();

    yScale.domain(d3.extent(data, function(d) {
      return d["Omega Ratio"] * 1.05;
    })).nice();

    radius.domain(d3.extent(data, function(d) {
      return d["Sharpe Ratio"] * 1.05;
    })).nice();

    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .attr('class', 'x axis')
      .call(xAxis.ticks(6).tickFormat(d3.format(",.0f")));

    svg.append('g')
      .attr('transform', 'translate(0,0)')
      .attr('class', 'y axis')
      .call(yAxis.ticks(6).tickFormat(d3.format(".0f")));


    const bubble = svg.selectAll('.bubble')
      .data(data)
      .enter().append('circle')
      .attr('class', 'bubble')
      .attr('cx', function(d) {
        return xScale(d["Annualized Return"]);
      })
      .attr('cy', function(d) {
        return yScale(d["Omega Ratio"]);
      })
      .attr('r', function(d) {
        return radius(d["Sharpe Ratio"]);
      })
      .style('fill', function(d) {
        return color(d["Current Drought"]);
      })
      .style('opacity', 0.6)
      .on("mouseover", function(d) {
        t.transition()
          .duration(200)
          .style("opacity", .9)
          .style('position', 'fixed');
        const xPos = d3.event.pageX;
        const yPos = d3.event.pageY;
        t.html("<table><thead><tr><th colspan='2'>" + d["Current Drought"] + "</th></tr></thead><tbody><tr><td>Sharpe Ratio</td><td>" + d["Sharpe Ratio"] + "</td></tr></tbody></table>")
          .style("left", (xPos) + "px")
          .style("top", (yPos) + "px");
      })

      .on("mouseout", function(d) {
        t.transition()
          .duration(500)
          .style("opacity", 0);
      });

    svg.append('text')
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style('fill', '#2c7bb6')
      .attr('class', 'y-axis-label')
      .text("Omega Ratio".replace('_', ' ').toUpperCase());


    svg.append('text')
      .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + 40) + ")")
      .style('fill', '#2c7bb6')
      .attr('text-anchor', 'middle')
      .attr('class', 'x-axis-label')
      .text("Annualized Return".replace('_', ' ').toUpperCase());

  }


  render() {
    return <div id = {"#" + this.props.id} > < /div>
  }
}
export default ScatterChart;
