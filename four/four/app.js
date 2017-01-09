document.addEventListener("DOMContentLoaded", function () {

  var xScale;
  var yScale;
  var yAxis;
  var xAxis;

  init();

  function init() {
    intAxis();
    d3.csv("movies.csv", draw);
  }

  function intAxis() {

    xScale = d3.scaleLinear().domain([1, 10]).range([20, 470]);
    yScale = d3.scaleLinear().domain([0, 55]).range([480, 20]);

    xAxis = d3.axisBottom().scale(xScale)
      .tickSize(480).tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);

    yAxis = d3.axisRight().scale(yScale)
      .tickSize(480).ticks(10);
    d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);

  }


  function draw(data) {

    var fillScale = d3.scaleOrdinal()
      .domain(["titanic", "avatar", "akira", "frozen", "deliverance", "avengers"])
      .range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F", "#5eafc6", "#41a368"]);


    var n = 0;
    for (key in data[0]) {
      if (key != "day") {

        var movieArea = d3.area()
          .x(function (d) {
            return xScale(d.day);
          })
          .y0(function (d) {
            return yScale(simpleStacking(d, key) - d[key]);
          })
          .y1(function (d) {
            return yScale(simpleStacking(d, key));
          })
          .curve(d3.curveBasis);

        d3.select("svg")
          .append("path")
          .style("id", key + "Area")
          .attr("d", movieArea(data))
          .attr("fill", fillScale(key))
          .attr("stroke", "black")
          .attr("stroke-width", 1);
        n++;
      }
    }
    function simpleStacking(lineData, lineKey) {
      var newHeight = 0;
      Object.keys(lineData).every(function (key) {
        if (key !== "day") {
          newHeight += parseInt(lineData[key]);
          if (key === lineKey) {
            return false
          }
        }
        return true
      });
      return newHeight;
    }

    // function alternatingStacking(incomingData, incomingAttribute, topBottom) {
    //   var newHeight = 0;
    //   var skip = true;
    //   for (x in incomingData) {
    //     if (x != "day") {
    //       if (x == "movie1" || skip == false) {
    //         if (x == incomingAttribute) {
    //           break;
    //         }
    //         if (skip == false) {
    //           skip = true;
    //         } else {
    //           n % 2 == 0 ? skip = false : skip = true;
    //         }
    //       } else {
    //         skip = false;
    //       }
    //     }
    //   }
    //   if (topBottom == "bottom") {
    //     newHeight = -newHeight;
    //   }
    //   if (n > 1 && n % 2 == 1 && topBottom == "bottom") {
    //     newHeight = 0;
    //   }
    //   if (n > 1 && n % 2 == 0 && topBottom == "top") {
    //     newHeight = 0;
    //   }
    //   return newHeight;
    // }
  }

});

