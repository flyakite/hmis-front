var nodes = { nodes: [{
id: "1",
head: "2",
form: "St Patrick Center",
cpostag: "large",
weight: 8,
outgoingMedicalReferrals: 340,
incomingMedicalReferrals: 5460,
outgoingShelterReferrals: 2300,
incomingShelterReferrals: 4789,
description: ""
},
{id: "2",
head: "3",
form: "US Vets",
cpostag: "small",
weight: 5,
outgoingMedicalReferrals: 100,
incomingMedicalReferrals: 60,
outgoingShelterReferrals: 170,
incomingShelterReferrals: 289,
description: ""
},
{id: "3",
head: "1",
form: "YWCA",
cpostag: "med",
weight: 6,
outgoingMedicalReferrals: 0,
incomingMedicalReferrals: 60,
outgoingShelterReferrals: 400,
incomingShelterReferrals: 1400,
description: ""},
{id: "4",
head: "1",
form: "Salvation Army",
cpostag: "med",
weight: 8,
outgoingMedicalReferrals: 434,
incomingMedicalReferrals: 964,
outgoingShelterReferrals: 320,
incomingShelterReferrals: 3256,
description: ""
},
{id: "5",
head: "2",
form: "MISI",
cpostag: "small",
weight: 8,
outgoingMedicalReferrals: 30,
incomingMedicalReferrals: 95,
outgoingShelterReferrals: 140,
incomingShelterReferrals: 289,
description: ""
},
{id: "6",
head: "1",
form: "Our Lady's Inn",
cpostag: "med",
weight: 3,
outgoingMedicalReferrals: 0,
incomingMedicalReferrals: 0,
outgoingShelterReferrals: 4200,
incomingShelterReferrals: 8932,
description: ""
},
{id: "7",
head: "3",
form: "Places for People",
cpostag: "small",
weight: 3,
outgoingMedicalReferrals: 320,
incomingMedicalReferrals: 0,
outgoingShelterReferrals: 469,
incomingShelterReferrals: 232,
description: ""
}
]};

var POS_TO_NAME = {
  "large": {"id":1, "weight":8},
  "med": {"id":2, "weight":6},
  "small": {"id":3, "weight":4},
};

function viz(graph) {
  var svg = d3.select("#d3-graph").append("svg:svg"),
      width = 700,
      height = 500;
  svg
    .style("width", width)
    .style("height", height)

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.form; }).distance(120))
      .force("charge", d3.forceManyBody(-20))
      .force("collide", d3.forceCollide(100).iterations(1))
      .force("center", d3.forceCenter(width / 3, height / 2));

    var verticies = [];
    for (var i in graph) {
      for (var j in graph) {
        if (graph[j].id == graph[i].head) {
          verticies.push(
            {
              "source": graph[i].form, 
              "target": graph[j].form,
              "weight": POS_TO_NAME[graph[i].cpostag].weight
            });
          break;
        }
      }
    }

    // build the arrow.
  svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
    .enter().append("svg:marker")    // This section adds in the arrows
      .attr("id", String)
      .style("fill", "#999")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 30)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
    .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(verticies)
      .enter().append("line")
      .attr("id", "wavy")
      .attr("marker-end", "url(#end)")
      .attr("stroke-width", function(d) {return d.weight; });


    var node = svg.selectAll("g.node")
      .data(graph)
      .enter().append("svg:g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  var tooltipDiv = d3.select("#d3-graph").append("div") 
    .attr("class", "tooltip")
    .style("opacity", 0);

    node.append("svg:circle")
      .attr("class", "node")
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("r", function(d) { 
       if (d.cpostag === "large") {
        return 40;
       } else if (d.cpostag === "med") {
        return 30;
       } else {
        return 20; 
       }
     })
      .style("stroke-width", 4)
      .style("stroke", "white")
      .attr("fill", function(d) { return color(POS_TO_NAME[d.cpostag].id); })
      .on("mouseover", function(d) {
        tooltipDiv.transition().duration(100).style("opacity", 1);
            tooltipDiv.html("Outgoing Shelter Referrals: " +d.outgoingShelterReferrals
             + "<br/>" + "Incoming Shelter Referrals: " +d.incomingShelterReferrals
             + "<hr>" + "Outgoing Medical Referrals: " +d.outgoingMedicalReferrals
             + "<br/>" + "Incoming Medical Referrals: " +d.incomingMedicalReferrals
             )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");

            d3.select(this).style("stroke", "#c7c7c7");
      })
      .on("mouseout", function(d) {   
            tooltipDiv.transition().duration(500).style("opacity", 0); 
            d3.select(this).style("stroke", "white");
        }); 

    node.append("svg:text")
      .attr("font-size","18px")
      .attr("class", "nodetext")
      .attr("dx", "2.5em")
      .attr("text-anchor", "right")
      .attr("dy", "0")
      .text(function(d) { return d.form });

    simulation
        .nodes(graph)
        .on("tick", ticked);

    simulation.force("link")
        .links(verticies);

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}