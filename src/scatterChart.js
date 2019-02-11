import React, { Component } from 'react';
import * as d3 from 'd3';

class ScatterChart extends Component {
    componentDidMount() {
        this.drawChart();
    }

    drawChart() {
        const data = this.props.data;
        const w = this.props.width;
        const h = this.props.height;

        const svg = d3.select("body").append("svg")
            .attr("width", w)
            .attr("height", h)
            .style("margin-left", 100);

            
    }

    render() {
        return <div id={"#" + this.props.id}></div>
    }
}

export default ScatterChart;

function scatterPlot(dom, data, xVar, yVar, sizeVar, colorVar) {
    var margin = {
        top: -30,
        right: 70,
        bottom: 0,
        left: 50
    };
    var width = 920 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var numFormat = d3.format(".1f");

    var svg = d3.select("#" + dom)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr("preserveAspectRatio", 'xMidYMid meet')
        .attr("viewBox", "0 0 880 600")
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var t = d3.select("body")
        .append("div")
        .attr("class", "tooltip-custom")
        .style("opacity", 0);


    var xScale = d3.scaleLinear()
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .range([height, 0]);

    var radius = d3.scaleSqrt()
        .range([2, 25]);

    var xAxis = d3.axisBottom()
        .scale(xScale);

    var yAxis = d3.axisLeft()
        .scale(yScale);

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    d3.json('supplier.json', function (error, data) {
        var data = data.data.value;
        data.forEach(function (d) {
            d[xVar] = +d[xVar];
            d[yVar] = +d[yVar];
            d[sizeVar] = +d[sizeVar];
            d[colorVar] = d[colorVar];
        })

        xScale.domain(d3.extent(data, function (d) {
            return d[xVar];
        })).nice();

        yScale.domain(d3.extent(data, function (d) {
            return d[yVar] * 1.05;
        })).nice();

        radius.domain(d3.extent(data, function (d) {
            return d[sizeVar] * 1.05;
        })).nice();

        svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .attr('class', 'x axis')
            .call(xAxis.ticks(6).tickFormat(d3.format(",.0f")));

        svg.append('g')
            .attr('transform', 'translate(0,0)')
            .attr('class', 'y axis')
            .call(yAxis.ticks(6).tickFormat(d3.format(".0f")));


        var bubble = svg.selectAll('.bubble')
            .data(data)
            .enter().append('circle')
            .attr('class', 'bubble')
            .attr('cx', function (d) {
                return xScale(d[xVar]);
            })
            .attr('cy', function (d) {
                return yScale(d[yVar]);
            })
            .attr('r', function (d) {
                return radius(d[sizeVar]);
            })
            .style('fill', function (d) {
                return color(d[colorVar]);
            })
            .style('opacity', 0.6)
            .on("mouseover", function (d) {
                t.transition()
                    .duration(200)
                    .style("opacity", .9)
                    .style('position', 'fixed');
                var xPos = d3.event.pageX;
                var yPos = d3.event.pageY;
                t.html("<table><thead><tr><th colspan='2'>" + d[colorVar] + "</th></tr></thead><tbody><tr><td>Total Hours</td><td>" + d[sizeVar] + "</td></tr></tbody></table>")
                    .style("left", (xPos) + "px")
                    .style("top", (yPos) + "px");
            })

            .on("mouseout", function (d) {
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
            .text(yVar.replace('_', ' ').toUpperCase());


        svg.append('text')
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + 40) + ")")
            .style('fill', '#2c7bb6')
            .attr('text-anchor', 'middle')
            .attr('class', 'x-axis-label')
            .text(xVar.replace('_', ' ').toUpperCase());

    })
}