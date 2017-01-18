document.addEventListener("DOMContentLoaded", function () {


  init();

  function init() {
    d3.json("tweets.json", viz)
  }


  function adjacency() {

    queue()
      .defer(d3.csv, "nodelist.csv")
      .defer(d3.csv, "edgelist.csv")
      .await(function (error, file1, file2) {
        createAdjacencyMatrix(file1, file2);
      });
    function createAdjacencyMatrix(nodes, edges) {
      var edgeHash = {};
      for (x in edges) {
        var id = edges[x].source + "-" + edges[x].target;
        edgeHash[id] = edges[x];
      }

      matrix = [];
      for (a in nodes) {
        for (b in nodes) {
          var grid =
          {
            id: nodes[a].id + "-" + nodes[b].id,
            x: b, y: a, weight: 0
          };
          if (edgeHash[grid.id]) {
            grid.weight = edgeHash[grid.id].weight;
          }
          matrix.push(grid);
        }
      }

      d3.select("svg")
        .append("g")
        .attr("transform", "translate(50,50)")
        .attr("id", "adjacencyG")
        .selectAll("rect")
        .data(matrix)
        .enter()
        .append("rect")
        .attr("class", "grid")
        .attr("width", 25)
        .attr("height", 25)
        .attr("x", function (d) {return d.x * 25})
        .attr("y", function (d) {return d.y * 25})
        .style("fill-opacity", function (d) {return d.weight * .2;})


      var scaleSize = nodes.length * 25;
      var nameScale = d3.scale.ordinal()
        .domain(nodes.map(function (el) {return el.id}))
        .rangePoints([0,scaleSize],1);
      var xAxis = d3.svg.axis()
        .scale(nameScale).orient("top").tickSize(4);
      var yAxis = d3.svg.axis()
        .scale(nameScale).orient("left").tickSize(4);
      d3.select("#adjacencyG").append("g").call(yAxis);
      d3.select("#adjacencyG").append("g").call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "translate(-10,-10) rotate(90)");

    }


  }

});

