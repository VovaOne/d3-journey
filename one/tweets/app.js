document.addEventListener("DOMContentLoaded", function () {

  d3.json("tweets.json", function (error, data) {
    dataViz(data.tweets)
  });

  function dataViz(incomingData) {
    incomingData.forEach(function (el) {
      el.impact = el.favorites.length + el.retweets.length;
      el.tweetTime = new Date(el.timestamp);
    });

    var maxImpact = d3.max(incomingData, function (el) {
      return el.impact;
    });
    var startEnd = d3.extent(incomingData, function (el) {
      return el.tweetTime;
    });

    var timeRamp = d3.scaleTime().domain(startEnd).range([20, 480]);
    var yScale = d3.scaleLinear().domain([0, maxImpact]).range([0, 460]);
    var radiusScale = d3.scaleLinear()
      .domain([0, maxImpact]).range([1, 20]);

    var colorScale = d3.scaleLinear()
      .domain([0, maxImpact]).range(["white", "#990000"]);

    // d3.select("svg")
    //   .selectAll("circle")
    //   .data(incomingData)
    //   .enter()
    //   .append("circle")
    //   .attr("r", function(d) {return radiusScale(d.impact);})
    //   .attr("cx", function(d,i) {return timeRamp(d.tweetTime);})
    //   .attr("cy", function(d) {return 480 - yScale(d.impact);})
    //   .style("fill", function(d) {return colorScale(d.impact);})
    //   .style("stroke", "black")
    //   .style("stroke-width", "1px");

    var tweetG = d3.select("svg")
      .selectAll("g")
      .data(incomingData, function (d) {
        return JSON.stringify(d);
      })
      .enter()
      .append("g")
      .attr("transform", function (d) {
        return "translate(" +
          timeRamp(d.tweetTime) + "," + (480 - yScale(d.impact))
          + ")";
      });

    tweetG.append("circle")
      .attr("r", function (d) {
        return radiusScale(d.impact);
      })
      .style("fill", "#990000")
      .style("stroke", "black")
      .style("stroke-width", "1px");

    tweetG.append("text")
      .text(function (d) {
        return d.user + "-" + d.tweetTime.getHours();
      });

  }

});
