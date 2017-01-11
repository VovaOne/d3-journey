document.addEventListener("DOMContentLoaded", function () {

  var xScale;
  var yScale;
  var yAxis;
  var xAxis;

  init();

  function init() {
    // intAxis();

    d3.json("tweets.json", function (error, data) {
      pie(data.tweets)
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


  function pie(tweetsData) {
    var fillScale = d3.scaleOrdinal().range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F"]);

    var nestedTweets = d3.nest()
      .key(function (d) {
        return d.user
      })
      .entries(tweetsData);

    nestedTweets.forEach(function (d) {
      d.numTweets = d.values.length;
      d.numFavorites = d3.sum(d.values, function (p) {
        return p.favorites.length
      });
      d.numRetweets = d3.sum(d.values, function (p) {
        return p.retweets.length
      })
    });

    var pieChart = d3.pie().sort(null);
    window.pieChart = pieChart;

    var newArc = d3.arc();
    newArc.innerRadius(20).outerRadius(100);

    pieChart.value(function (d) {
      return d.numTweets
    });

    var tweetsPie = pieChart(nestedTweets);

    pieChart.value(function (d) {
      return d.numRetweets
    });

    var retweetsPie = pieChart(nestedTweets);

    nestedTweets.forEach(function (d, i) {
      d.tweetsSlice = tweetsPie[i];
      d.retweetsSlice = retweetsPie[i];
    });

    window.pieChart = pieChart;
    window.nestedTweets = nestedTweets;
    window.newArc = newArc;
    window.arcTween = arcTween;

    d3.select("svg")
      .append("g")
      .attr("transform", "translate(250,250)")
      .selectAll("path")
      .data(nestedTweets)
      .enter()
      .append("path")
      .attr("d", function (d) {
        return newArc(d.tweetsSlice);
      })
      .style("fill", function (d, i) {
        return fillScale(i)
      })
      .style("stroke", "black")
      .style("stroke-width", "2px");

  }

  function arcTween(d) {
    return function (t) {
      var interpolateStartAngle = d3.interpolate(d.tweetsSlice.startAngle, d.retweetsSlice.startAngle);

      var interpolateEndAngle = d3.interpolate(d.tweetsSlice.endAngle, d.retweetsSlice.endAngle);
      d.startAngle = interpolateStartAngle(t);
      d.endAngle = interpolateEndAngle(t);
      return newArc(d);
    }
  }

  // d3.selectAll("path")
  //   .transition()
  //   .duration(5000)
  //   .attrTween("d", arcTween)
});

