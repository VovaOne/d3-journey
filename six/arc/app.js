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

  }


  function createAdjacencyMatrix(nodes, edges) {

    var nodeHash = {};
    for (x in nodes) {
      nodeHash[nodes[x].id] = nodes[x];
      nodes[x].x = parseInt(x) * 40;
    }

    for (x in edges) {
      edges[x].weight = parseInt(edges[x].weight);
      edges[x].source = nodeHash[edges[x].source];
      edges[x].target = nodeHash[edges[x].target];
    }

    var linkScale = d3.scaleLinear()
      .domain(d3.extent(edges, function (d) {
        return d.weight
      }))
      .range([5, 10]);

    var arcG = d3.select("svg").append("g").attr("id", "arcG")
      .attr("transform", "translate(50,250)");

    arcG.selectAll("path")
      .data(edges)
      .enter()
      .append("path")
      .attr("class", "arc")
      .style("stroke-width", function (d) {
        return d.weight * 2;
      })
      .style("opacity", .25)
      .attr("d", arc);

    arcG.selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .attr("cx", function (d) {
        return d.x;
      });

    function arc(d, i) {
      var draw = d3.line().curve(d3.curveBasis);
      var midX = (d.source.x + d.target.x) / 2;
      var midY = (d.source.x - d.target.x) * 2;
      return draw([[d.source.x, 0], [midX, midY], [d.target.x, 0]])
    }

    d3.selectAll("circle").on("mouseover", nodeOver);
    d3.selectAll("path").on("mouseover", edgeOver);

    function nodeOver(d, i) {
      d3.selectAll("circle").classed("active", function (p) {
        return p == d ? true : false;
      });
      d3.selectAll("path").classed("active", function (p) {
        return p.source == d || p.target == d ? true : false;
      });
    }

    function edgeOver(d) {
      d3.selectAll("path").classed("active", function (p) {
        return p == d ? true : false;
      });
      d3.selectAll("circle").style("fill", function (p) {
        return p == d.source ? "blue" : p == d.target ? "green" : "lightgray";
      });
    }

  }


});

