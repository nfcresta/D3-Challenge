// @TODO: YOUR CODE HERE!

// create svg area
var svgHeight = 700;
var svgWidth = 900;

// set margins
var margin = {
    top: 20,
    bottom: 80,
    left: 100,
    right: 40
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom; 


var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// append an svg group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// functions to upate scale vars upon click on axis label
function xScale(healhtData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healhtData, d => d[chosenXAxis]) * 0.9,
            d3.max(healhtData, d => d[chosenXAxis]) * 1.1
        ])
        .range([0, width]);

    return xLinearScale;
}

function yScale(healhtData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healhtData, d => d[chosenYAxis]) * 0.9,
            d3.max(healhtData, d => d[chosenYAxis]) * 1.1
        ])
        .range([height, 0]);

    return yLinearScale;
}

// function used to update axes var upon click on axis label
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function to update circles group with transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// function to update circles text
function renderCirclesText(textGroup, xScale, chosenXAxis, yScale, chosenYAxis) {
    
    textGroup.transition()
        .duration(1000)
        .attr("x", d => xScale(d[chosenXAxis]))
        .attr("y", d => yScale(d[chosenYAxis]));
    
        return textGroup;
}

// function to update circles w new toolTip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xLabel;
    var yLabel;

    if (chosenXAxis === "poverty") {
        xLabel = "Poverty (%)";
    }
    else if (chosenXAxis === "age") {
        xLabel = "Age (Median)";
    }
    else {
        xLabel = "Income (Median)"
    }

    if (chosenYAxis === "healthcare") {
        yLabel = "Lacks Healthcare (%)";
    }
    else if (chosenYAxis === "obesity") {
        yLabel = "Obesity (%)";
    }
    else {
        yLabel = "Smokes (%)";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${xLabel}: ${d[chosenXAxis]}<br>${yLabel}: ${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

// load data from csv file
d3.csv("assets/data/data.csv").then(function(healthData, err) {
    if (err) throw err;
    console.log(healthData)

    // parse and convert data
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    })

    // create scale functions
    var xLinearScale = xScale(healthData, chosenXAxis);
    var yLinearScale = yScale(healthData, chosenYAxis);

    // create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x and y axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // create and append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("opacity", "0.6")
        .classed("stateCircle", true);

    // insert text into circles
    var textGroup = chartGroup.selectAll("text")
        .exit()
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("fontsize", 6)
        .attr("text-anchor", "middle")
        .classed("stateText", true)

    // create axis labels groups and labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event lister
        .classed("active", true)
        .text("Poverty (%)")

    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)")

    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Income (Median)")

    
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(-20, ${height / 2})`);

    var healthCareLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", 0)
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .classed("axis-text", true)
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    var obesityLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", 0)
        .attr("dy", "1em")
        .attr("value", "obesity")
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Obesity (%)");

    var smokesLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -70)
        .attr("x", 0)
        .attr("dy", "1em")
        .attr("value", "smokes")
        .classed("axis-text", true)
        .classed("inactive", true)
        .text("Smokes (%)");

    // updateToolTip function
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event lister
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                chosenXAxis = value;
                xLinearScale = xScale(healthData, chosenXAxis);
                xAxis = renderXAxis(xLinearScale, xAxis);
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                textGroup = renderCirclesText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

                // change classes to change bold text
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

        yLabelsGroup.selectAll("text")
            .on("click", function() {
                var value = d3.select(this).attr("value");

                if (value !== chosenYAxis) {
                    chosenYAxis = value;
                    yLinearScale = yScale(healthData, chosenYAxis);
                    yAxis = renderYAxis(yLinearScale, yAxis);
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                    textGroup = renderCirclesText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

                    if (chosenYAxis === "healthcare") {
                        healthCareLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        obesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenYAxis === "obesity") {
                        healthCareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obesityLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        smokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else {
                        healthCareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokesLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }
            })
}).catch(function(error) {
    console.log(error);
});


