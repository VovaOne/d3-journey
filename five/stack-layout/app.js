document.addEventListener("DOMContentLoaded", function () {


  init();

  function init() {
    d3.json("tweets.json", viz)
  }


  function viz(data) {

    var depthScale = d3.scaleOrdinal()
      .range(["#5EAFC6", "#FE9922", "#93c464", "#75739F"]);

    var nestedTweets = d3.nest()
      .key(function (d) {
        return d.user
      })
      .entries(data.tweets);
    var packableTweets = {id: "All Tweets", values: nestedTweets};

    var root = d3.hierarchy(packableTweets, function (d) {
      return d.values
    });

    var treeChart = d3.tree();
    treeChart.size([200, 200]);

    var treeData = treeChart(root).descendants();

    d3.select("svg")
      .append("g")
      .attr("id", "treeG")
      .attr("transform", "translate(250,250)")
      .selectAll("g")
      .data(treeData)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + project(d.x , d.y) + ")"
      });

    d3.selectAll("g.node")
      .append("circle")
      .attr("r", 10)
      .style("fill", function (d) {
        return depthScale(d.depth)
      })
      .style("stroke", "white")
      .style("stroke-width", "2px");

    d3.selectAll("g.node")
      .append("text")
      .style("text-anchor", "middle")
      .style("fill", "#4f442b")
      .text(function(d){ return d.data.id || d.data.key /*|| d.data.content*/});

    d3.select("#treeG").selectAll("line")
      .data(treeData.filter(function (d) {
        return d.parent
      }))
      .enter().insert("line", "g")
      .attr("x1", function (d) {
        return project(d.parent.x, d.parent.y)[0]
      })
      .attr("y1", function (d) {
        return project(d.parent.x, d.parent.y)[1]
      })
      .attr("x2", function (d) {
        return project(d.x, d.y)[0]
      })
      .attr("y2", function (d) {
        return project(d.x, d.y)[1]
      })
      .style("stroke", "black")

    function project(x, y) {
      var angle = x / 90 * Math.PI;
      var radius = y;
      return [radius * Math.cos(angle), radius * Math.sin(angle)];
    }


  }


});

