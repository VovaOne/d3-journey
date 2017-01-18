document.addEventListener("DOMContentLoaded", function () {


  init();

  function init() {
    d3.json("tweets.json", viz)
  }


  function viz(data) {
debugger;
    var depthScale = d3.scaleOrdinal()
      .range(["#5EAFC6", "#FE9922", "#93c464", "#75739F"]);

    var nestedTweets = d3.nest()
      .key(function (d) {
        return d.user
      })
      .entries(data.tweets);
    var packableTweets = {id: "All Tweets", values: nestedTweets};
    var packChart = d3.pack();

    packChart.size([300, 300]);
    packChart.padding(10)

    var root = d3.hierarchy(packableTweets, function (d) {
      return d.values
    })
      .sum(function (d) {
        return d.retweets ? d.retweets.length + d.favorites.length + 1 : undefined;
      });

    d3.select("svg")
      .append("g")
      .attr("transform", "translate(100,20)")
      .selectAll("circle")
      .data(packChart(root).descendants())
      .enter()
      .append("circle")
      .attr("r", function (d) {
        return d.r
      })
      .attr("cx", function (d) {
        return d.x
      })
      .attr("cy", function (d) {
        return d.y
      })
      .style("fill", function (d) {
        return depthScale(d.depth)
      })
      .style("stroke", "black")

  }


});

