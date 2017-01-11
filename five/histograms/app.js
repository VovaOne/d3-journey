document.addEventListener("DOMContentLoaded", function () {

  var xScale;
  var yScale;
  var yAxis;
  var xAxis;

  init();

  function init() {
    intAxis();

    d3.json("tweets.json", function (error, data) {
      histogram(data.tweets)
    });
  }

  function intAxis() {
    xScale = d3.scaleLinear().domain([0, 5]).range([0, 500]);
    yScale = d3.scaleLinear().domain([0, 10]).range([400, 0]);
    xAxis = d3.axisBottom().scale(xScale).ticks(5);

    d3.select("svg").append("g").attr("class", "x axis")
      .attr("transform", "translate(0,400)").call(xAxis);
    d3.select("g.axis").selectAll("text").attr("dx", 50);
  }


  function histogram(tweetsData) {

    var histoChart = d3.histogram();

    histoChart
      .domain([0, 5])
      .thresholds([0, 1, 2, 3, 4, 5])
      .value(function (d) {
        return d.favorites.length
      });

    histoData = histoChart(tweetsData);

    d3.select("svg")
      .selectAll("rect")
      .data(histoData).enter()
      .append("rect")
      .attr("x", function (d) {
        return xScale(d.x0)
      })
      .attr("y", function (d) {
        return yScale(d.length)
      })
      .attr("width", function (d) {
        return xScale(d.x1 - d.x0) - 2
      })
      .attr("height", function (d) {
        return 400 - yScale(d.length)
      })
      .style("fill", "#FCD88B");


  }
});

