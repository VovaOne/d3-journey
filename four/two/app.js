document.addEventListener("DOMContentLoaded", function () {

  var xScale;
  var yScale;
  var yAxis;
  var xAxis;

  init();

  function init() {
    intAxis();
    d3.csv("boxplots.csv", scatterplot);
  }

  function intAxis() {

    xScale = d3.scaleLinear().domain([1, 8]).range([20, 470]);
    yScale = d3.scaleLinear().domain([0, 100]).range([480, 20]);

    yAxis = d3.axisRight().scale(yScale)
      .tickSize(-470)
      .ticks(8);

    d3.select("svg")
      .append("g")
      .attr("transform", "translate(470,0)")
      .attr("id", "yAxisG")
      .call(yAxis);

    xAxis = d3.axisBottom().scale(xScale)
      .tickSize(-470)
      .tickValues([1, 2, 3, 4, 5, 6, 7]);

    d3.select("svg")
      .append("g")
      .attr("transform", "translate(0,480)")
      .attr("id", "xAxisG")
      .call(xAxis);
    d3.select("#xAxisG > path.domain").style("display", "none");
  }


  function scatterplot(data) {

    d3.select("svg")
      .selectAll("g.box")
      .data(data).enter()
      .append("g")
      .attr("class", "box")
      .attr("transform", function (d) {
        return "translate(" + xScale(d.day) + "," + yScale(d.median) + ")";
      })
      .each(function (d, i) {

        d3.select(this)
          .append("line")
          .attr("class", "range")
          .attr("x1", 0)
          .attr("x2", 0)
          .attr("y1", yScale(d.max) - yScale(d.median))
          .attr("y2", yScale(d.min) - yScale(d.median))
          .style("stroke", "black")
          .style("stroke-width", "4px");

        //The top bar of the min-max line
        d3.select(this)
          .append("line")
          .attr("class", "max")
          .attr("x1", -10)
          .attr("x2", 10)
          .attr("y1", yScale(d.max) - yScale(d.median))
          .attr("y2", yScale(d.max) - yScale(d.median))
          .style("stroke", "black")
          .style("stroke-width", "4px");

        //The bottom bar of the min-max line
        d3.select(this)
          .append("line")
          .attr("class", "min")
          .attr("x1", -10)
          .attr("x2", 10)
          .attr("y1", yScale(d.min) - yScale(d.median))
          .attr("y2", yScale(d.min) - yScale(d.median))
          .style("stroke", "black")
          .style("stroke-width", "4px");

        d3.select(this)
          .append("rect")
          .attr("class", "range")
          .attr("width", 20)
          .attr("x", -10)
          //The offset so that the rectangle is centered on the median value
          .attr("y", yScale(d.q3) - yScale(d.median))
          .attr("height", yScale(d.q1) - yScale(d.q3))
          .style("fill", "white")
          .style("stroke", "black")
          .style("stroke-width", "2px");

        //Median line doesn’t need to be moved, because the parent <g> is centered on the median value
        d3.select(this)
          .append("line")
          .attr("x1", -10)
          .attr("x2", 10)
          .attr("y1", 0)
          .attr("y2", 0)
          .style("stroke", "darkgray")
          .style("stroke-width", "4px");

      });

  }


});

