document.addEventListener("DOMContentLoaded", function () {


  init();

  function init() {
    Promise
      .all([
        loadCsv("nodelist.csv"),
        loadCsv("edgelist.csv")
      ])
      .then(function (resolve) {
        return visualize(resolve[0], resolve[1])
      });

  }


  function visualize(nodes, edges) {


    var roleScale = d3.scaleOrdinal()
      .domain(["contractor", "employee", "manager"])
      .range(["#75739F", "#41A368", "#FE9922"]);

    var marker = d3.select("svg")
      .append('defs')
      .append('marker')
      .attr("id", "Triangle")
      .attr("refX", 12)
      .attr("refY", 6)
      .attr("markerUnits", 'userSpaceOnUse')
      .attr("markerWidth", 12)
      .attr("markerHeight", 18)
      .attr("orient", 'auto')
      .append('path')
      .attr("d", 'M 0 0 12 6 0 12 3 6');

    var nodeHash = {};
    nodes.forEach(function (node) {
      return nodeHash[node.id] = node;
    });

    edges.forEach(function (edge) {
      edge.weight = parseInt(edge.weight);
      edge.source = nodeHash[edge.source];
      edge.target = nodeHash[edge.target];
    });

    nodes.forEach(function (d) {
      d.degreeCentrality = edges.filter(function (p) {
        return p.source === d || p.target === d
      }).length
    });

    console.log(nodes);

    var linkForce = d3.forceLink().strength(function (d) {
      return d.weight * .1
    });

    var simulation = d3.forceSimulation()
      .force("charge", d3.forceManyBody().strength(-500))
      .force("x", d3.forceX(250))
      .force("y", d3.forceY(250))
      .force("link", linkForce)
      .nodes(nodes)
      .on("tick", forceTick);

    simulation.force("link").links(edges);

    d3.select("svg").selectAll("line.link")
      .data(edges, function (d) {
        return d.source.id + "-" + d.target.id
      })
      .enter()
      .append("line")
      .attr("class", "link")
      .style("opacity", .5)
      .style("stroke-width", function (d) {
        return d.weight
      });

    d3.selectAll("line").attr("marker-end", "url(#Triangle)");

    var nodeEnter = d3.select("svg").selectAll("g.node")
      .data(nodes, function (d) {
        return d.id
      })
      .enter()
      .append("g")
      .attr("class", "node");

    nodeEnter
      .append("circle")
      .attr("r", function (d) {
        return d.degreeCentrality * 2;
      })
      .style("fill", function (d) {
        return roleScale(d.role)
      });

    nodeEnter.append("text")
      .style("text-anchor", "middle")
      .attr("y", 15)
      .text(function (d) {
          return d.id
        }
      );

    d3.select("svg").on("click", manuallyPositionNodes);

    function manuallyPositionNodes() {
      var xExtent = d3.extent(simulation.nodes(), function (d) {
        return parseInt(d.degreeCentrality)
      });
      var yExtent = d3.extent(simulation.nodes(), function (d) {
        return parseInt(d.salary)
      });
      var xScale = d3.scaleLinear().domain(xExtent).range([50, 450]);
      var yScale = d3.scaleLinear().domain(yExtent).range([450, 50]);
      simulation.stop();
      d3.selectAll("g.node")
        .transition()
        .duration(1000)
        .attr("transform", function (d) {
          return "translate(" + xScale(d.degreeCentrality)
            + "," + yScale(d.salary) + ")"
        });
      d3.selectAll("line.link")
        .transition()
        .duration(1000)
        .attr("x1", function (d) {
          return xScale(d.source.degreeCentrality)
        })
        .attr("y1", function (d) {
          return yScale(d.source.salary)
        })
        .attr("x2", function (d) {
          return xScale(d.target.degreeCentrality)
        })
        .attr("y2", function (d) {
          return yScale(d.target.salary)
        });
      var xAxis = d3.axisBottom().scale(xScale).tickSize(4);
      var yAxis = d3.axisRight().scale(yScale).tickSize(4);
      d3.select("svg").append("g").attr("transform",
        "translate(0,460)").call(xAxis);
      d3.select("svg").append("g").attr("transform",
        "translate(460,0)").call(yAxis);
      d3.selectAll("g.node").each(function (d) {
        d.x = xScale(d.degreeCentrality);
        d.vx = 0;
        d.y = yScale(d.salary);
        d.vy = 0;
      })

    }

  }

  function forceTick() {
    d3.selectAll("line.link")
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });
    d3.selectAll("g.node")
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
  }


  function loadCsv(d) {
    return new Promise(function (resolve) {
      return d3.csv(d, function (p) {
        return resolve(p)
      })
    });
  }


});

