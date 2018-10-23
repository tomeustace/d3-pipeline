
import * as d3 from 'd3';

var circle;
var maxCircleRadius = 10;
var maxClusterRadius = 6;

var nodes, clusters, rscale, radius, gridWidth;
var rScale = d3.scaleLinear().domain([1, 1000]).range([maxCircleRadius, 3])
var gridScale = d3.scaleLinear().domain([1, 1000]).range([3, maxCircleRadius])
var nodeCount;

export function getGridWidth() {
  return Math.round(gridWidth);
}

export function getRadius() {
  return Math.round(radius);
}

export function initNodes(count) {
    var m = 1; // number of distinct clusters

    nodeCount = parseInt(count) + 1;
    radius = Math.round(rScale(nodeCount));
    gridWidth = Math.round(gridScale(nodeCount));

    // The largest node for each cluster.
    clusters = new Array(m);
    nodes = d3.range(nodeCount).map(function () {
        var i = Math.floor(Math.random() * m),
            r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxClusterRadius,
            d = { cluster: i, radius: r };
        if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
        return d;
    });

    var forceCollide = d3.forceCollide()
        .radius(radius + 2)
        .iterations(1);

    var force = d3.forceSimulation()
        .nodes(nodes)
        .force("center", d3.forceCenter())
        .force("collide", forceCollide)
        .force("cluster", forceCluster)
        .force("gravity", d3.forceManyBody(30))
        .force("x", d3.forceX().strength(.7))
        .force("y", d3.forceY().strength(.7))
        .on("tick", tick);

    initCollision();
}

export function initCollision() {

    circle = d3.select('#vis-container')
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", radius) 
        .attr("class", "scheduled")
        .style("fill", "yellow");
}

function tick() {
    circle
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; });
}

function forceCluster(alpha) {
    for (var i = 0, n = nodes.length, node, cluster, k = alpha * 1; i < n; ++i) {
        node = nodes[i];
        cluster = clusters[node.cluster];
        node.vx -= (node.x - cluster.x) * k;
        node.vy -= (node.y - cluster.y) * k;
    }
}
