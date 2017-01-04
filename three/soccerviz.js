function createSoccerViz() {
  d3.csv("worldcup.csv", function (data) {
    overallTeamViz(data);
  });


  function overallTeamViz(incomingData) {
    var dataKeys = d3.keys(incomingData[0]).filter(function (el) {
      return el != "team" && el != "region";
    });

    d3.select("#controls").selectAll("button.teams")
      .data(dataKeys).enter()
      .append("button")
      .on("click", buttonClick)
      .html(function (d) {
        return d;
      });

    function buttonClick(datapoint) {
      var maxValue = d3.max(incomingData, function (el) {
        return parseFloat(el[datapoint]);
      });

      var colorQuantize = d3.scaleQuantize()
        .domain([0, maxValue]).range(colorbrewer.YlGnBu[3]);

      var ybRamp = d3.scaleLinear()
        .interpolate(d3.interpolateHsl)
        .domain([0,maxValue]).range(["yellow", "blue"]);

      var radiusScale = d3.scaleLinear()
        .domain([0, maxValue]).range([2, 25]);

      // d3.selectAll("g.overallG")
      //   .select("circle")
      //   .transition()
      //   .duration(1000)
      //   .attr("r", function (p) {
      //     return radiusScale(p[datapoint] * 1.1);
      //   });

      d3.selectAll("g.overallG").each(function (d) {
        d3.select(this).selectAll("path").datum(d)
      });

      d3.selectAll("path")
        .transition()
        .duration(1000)
        .style("fill", function (p) {
          if (!p) return;
          return colorQuantize(p[datapoint])
        })
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .attr("transform", function (p) {
          if (!p) return;
          var scale = p[datapoint] / 10;
          if (scale > 0.5) scale = 0.5;
          return "scale(" + scale + ") translate(-50,-50)"
        });
    }

    d3.select("svg")
      .append("g")
      .attr("id", "teamsG")
      .attr("transform", "translate(50,300)")
      .selectAll("g")
      .data(incomingData)
      .enter()
      .append("g")
      .attr("class", "overallG")
      .attr("transform", function (d, i) {
          return "translate(" + (i * 55) + ", 0)"
        }
      );
    var teamG = d3.selectAll("g.overallG");

    // teamG
    //   .append("circle").attr("r", 0)
    //   .transition()
    //   .delay(function (d, i) {
    //     return i * 100
    //   })
    //   .duration(500)
    //   .attr("r", 40)
    //   .transition()
    //   .duration(500)
    //   .attr("r", 20);

    teamG
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", 35)
      .style("font-size", "10px")
      .text(function (d) {
        return d.team;
      });

    teamG
      .insert("image", "text")
      .attr("xlink:href", function (d) {
        return "images/" + d.team + ".png";
      })
      .attr("width", "35px").attr("height", "10px")
      .attr("x", "-18").attr("y", "-50");


    teamG.on("mouseover", highlightRegion2);
    function highlightRegion(d) {
      d3.selectAll("g.overallG").select("circle")
        .style("fill", function (p) {
          return p.region == d.region ? "red" : "gray";
        });
    }

    function highlightRegion2(d, i) {
      var teamColor = d3.rgb("white");

      d3.selectAll("g.overallG").each(function (d) {
        d3.select(this).selectAll("path").datum(d)
      });


      d3.selectAll("path")
        .transition()
        .duration(300)
        .style("fill", function (p) {
          if (!p) return;
          if (!p.region) return;
          return p.region == d.region ? teamColor.darker(.5) : teamColor.brighter(.5)
        });

      this.parentElement.appendChild(this);
    }

    teamG.on("mouseout", unHighlight);
    function unHighlight() {
      var teamColor = d3.rgb("black");
      d3.selectAll("path")
        .style("fill", function (p) {
          return teamColor;
        });
    }

    d3.text("modal.html", function (data) {
      d3.select("body").append("div").attr("id", "modal").html(data).attr("x", 20);
    });

    teamG.on("click", teamClick);

    function teamClick(d) {
      d3.selectAll("td.data").data(d3.values(d))
        .html(function (p) {
          return p
        });
    }

    d3.html("images/ball.svg", loadSVG);
    function loadSVG(svgData) {
      d3.selectAll("g.overallG").each(function () {
        var gParent = this;
        d3.select(svgData).selectAll("path")
          .attr("transform", "scale(0.3) translate(-50,-50)")
          .each(function (path, i) {
            gParent
              .appendChild(this.cloneNode(true))
          });
      });
    }
  }
}
