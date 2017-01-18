document.addEventListener("DOMContentLoaded", function () {


  init();

  function init() {
    d3.csv("movies.csv", viz)
  }


  function viz(data) {


    var xScale = d3.scaleLinear().domain([0, 10]).range([0, 500])
    var yScale = d3.scaleLinear().domain([0, 60]).range([480, 0])
    var heightScale = d3.scaleLinear().domain([0, 60]).range([0, 480])
    var movies = ["titanic", "avatar", "akira", "frozen", "deliverance", "avengers"]

    var fillScale = d3.scaleOrdinal()
      .domain(movies)
      .range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F", "#5eafc6", "#41a368"])

    var xAxis = d3.axisBottom()
      .scale(xScale)
      .tickSize(500)
      .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
    var yAxis = d3.axisRight()
      .scale(yScale)
      .ticks(10)
      .tickSize(530);
    d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);

    stackLayout = d3.stack().keys(movies)

    d3.select("svg").selectAll("g.bar")
      .data(stackLayout(data))
      .enter()
      .append("g")
      .attr("class", "bar")
      .each(function (d) {
        d3.select(this).selectAll("rect")
          .data(d)
          .enter()
          .append("rect")
          .attr("x", function (p, q) {
            return xScale(q) + 30
          })
          .attr("y", function (p) {
            return yScale(p[1])
          })
          .attr("height", function (p) {
            return heightScale(p[1] - p[0])
          })
          .attr("width", 40)
          .style("fill", fillScale(d.key));
      });


  }


});

