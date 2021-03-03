// @TODO: YOUR CODE HERE!

// create svg area
var svgHeight = 960;
var svgWidth = 600;

// set margins
var margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 60
};

// set area with margins
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Create svg wrapper, append svg group that will hold our chart and shift by margins
var svg = d3.select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


