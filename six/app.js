document.addEventListener("DOMContentLoaded", function () {


  init();

  function init() {
    var loadCsv = function (d) {
      return new Promise(function (resolve) {
        return d3.csv(d, function (p) {
          return resolve(p)
        })
      });
    };

    Promise
      .all([
        loadCsv("nodelist.csv"),
        loadCsv("edgelist.csv")
      ])
      .then(function (resolve) {
        return createAdjacencyMatrix(resolve[0], resolve[1])
      });


    function createAdjacencyMatrix(nodes, edges) {

      var edgeHash = {};
      edges.forEach(function (edge) {
        var id = edge.source + "-" + edge.target;
        edgeHash[id] = edge
      });

      var matrix = [];
      nodes.forEach(function (source, a) {
        nodes.forEach(function (target, b) {
          var grid = {
            id: source.id + "-" + target.id,
            x: b,
            y: a,
            weight: 0
          };
          if (edgeHash[grid.id]) {
            grid.weight = edgeHash[grid.id].weight;
          }
          matrix.push(grid);
        })
      });

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
        .attr("x", function (d) {
          return d.x * 25
        })
        .attr("y", function (d) {
          return d.y * 25
        })
        .style("fill-opacity", function (d) {
          return d.weight * .2;
        });

      d3.select("svg")
        .append("g")
        .attr("transform", "translate(50,45)")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("x", function (d, i) {
          return i * 25 + 12.5
        })
        .text(function (d) {
          return d.id
        })
        .style("text-anchor", "middle")

      d3.select("svg")
        .append("g")
        .attr("transform", "translate(45,50)")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("y", function (d, i) {
          return i * 25 + 12.5
        })
        .text(function (d) {
          return d.id
        })
        .style("text-anchor", "end")
    }
  }


});

