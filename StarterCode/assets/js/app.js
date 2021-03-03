// @TODO: YOUR CODE HERE!

// create svg area
var svgHeight = 600;
var svgWidth = 800;

// set margins
var margin = {
    top: 50,
    bottom: 100,
    left: 100,
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


// import data
d3.csv("assets/data/data.csv").then(healthData => {

    console.log(healthData);

    // parse data / cast as numbers
    healthData.forEach(data => {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    })

    // create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.poverty * 0.8), d3.max(healthData, d => d.poverty * 1.2)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare * 1.2)])
        .range([height, 0]);

    // create axis functions
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // append to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    // create circles for scatter plot
    var circles = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "teal")
        .attr("opacity", "0.8");

    // create labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height/1.5))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width/2.5}, ${height + margin.top})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
}).catch(function(error) {
    console.log(error);
});