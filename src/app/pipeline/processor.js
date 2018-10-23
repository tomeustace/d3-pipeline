import * as d3 from 'd3';
import { initGears } from './gears';
import { getRadius, getGridWidth } from './collision';

var ecyOffset = 0;
var ecxOffset = 0;
var cyOffset = 0;
var cxOffset = 0;

var margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 100
};
var width = 200, height = 200;

var xScale = d3.scaleLinear()
    .domain([-1.25, 1.25])
    .range([-width / 2, width / 2]);

export function loadProcessor() {
    var svg = d3.select('#vis-container')
        .append("g")
        .attr('id', 'processor')
        .attr("transform", "translate(" + (margin.left + width) + "," + (margin.top) + ")");

    var circleWrapper = svg.append("g").attr('id', 'processor-wrapper');
}

export function addOperation() {
    var data = {
        fixedAngle: 1 * (2 * Math.PI),
        randomAngle: 1 * (2 * Math.PI),
        speed: Math.random() * 7000 + 3000,
        r: 10
    }
    var circleWrapper = d3.select('#processor-wrapper');
    update(circleWrapper, data);
}

function update(circleWrapper, processingData) {
    var data = circleWrapper.selectAll(".processing").data();
    data.push(processingData);

    circleWrapper.selectAll('.processing')
        .data(data)
        .enter().append("circle")
        .attr("class", "processing")
        .style("fill", 'blue')
        .attr("cy", 0)
        .attr("cx", 0)
        .attr("r", 0)
        .transition().duration(500).delay(function (d, i) { return i * 50; })
        .attr("cy", function (d) { return xScale(Math.sin(d.fixedAngle)); })
        .attr("cx", function (d) { return xScale(Math.cos(d.fixedAngle)); })
        .attr("r", function (d) { return d.r - 3; })
        .on("end", goRound);
}

export function operationSuccess() {
    setTimeout(function () {
        d3.selectAll('.processing')
            .transition()
            .duration(500)
            .delay(500)
            .attr("cy", 0)
            .attr("cx", 0)
            .attr("r", 10)
            .style('fill', 'white')
            .on("end", success);
    }, 1000);
}

export function operationError() {
    setTimeout(function () {
        d3.selectAll('.processing')
            .transition()
            .duration(500)
            .attr("cy", 0)
            .attr("cx", 0)
            .attr("r", 10)
            .style('fill', 'white')
            .on("end", error);
    }, 1000);
}

function success() {
    var dur = 750, del = 500;
    var radius = getRadius();
    d3.select(this)
        .attr('class', 'success')
        .transition("in").duration(dur).delay(function (d, i) {
            return 1 * del + i * del;
        })
        .attr('transform', function (d, i) {
            var count = d3.selectAll('.success').nodes();
            if (count.length % (getGridWidth() * 3) !== 0) {
                cxOffset = cxOffset + radius + (radius * 1.5);
            } else {
                cxOffset = 0;
            }
            return 'translate(' + (150 + cxOffset) + ', -150)'
        })
        .style('opacity', '1')
        .style('fill', 'green')
        .attr('r', radius)
        .attr("cx", function (d, i) {
            return d3.select('.success-marker').attr('cx');
        })
        .attr('cy', function (d, i) {
            var count = d3.selectAll('.success').nodes();
            if (count.length % (getGridWidth() * 3) === 0) {
                cyOffset = cyOffset + radius + (radius * 1.5);
            }
            return d3.select('.success-marker').attr('cy') + cyOffset;
        })

        isFinished();
}

function error() {
    var dur = 750, del = 500;
    var radius = getRadius();
    d3.select(this)
            .attr('class', 'error')
            .transition("in").duration(dur).delay(function(d,i) { 
                return 1*del + i*del; 
            })
            .attr('transform', function(d,i) {
                var count = d3.selectAll('.error').nodes();
                if (count.length % (getGridWidth() * 3) !== 0) {
                    ecxOffset = ecxOffset + radius + (radius * 1.5);
                } else {
                    ecxOffset = 0;
                }
                return 'translate(' + (500 + ecxOffset) + ', -150)'
            })
            .style('opacity', '1')
            .style('fill', 'red')
            .attr('r', radius)
            .attr("cx", function(d, i) {
                return d3.select('.error-marker').attr('cx');
            })
            .attr("cy", function(d, i) {
                var count = d3.selectAll('.error').nodes();
                if (count.length % (getGridWidth() * 3) === 0) {
                    ecyOffset = ecyOffset + radius + (radius * 1.5);
                } 
                return d3.select('.error-marker').attr('cy') + ecyOffset;
            })
        isFinished();
}

function isFinished() {
    const finished = d3.selectAll('.processing').empty()
    if (finished === true) {
        const delay = 1500;
        d3.select('#processor-group')
        .transition()
        .duration(delay)
        .style('opacity', '0')
        .remove();

        d3.selectAll('.scheduled').remove()

        d3.select('#processor-wrapper')
            .transition()
            .duration(2000)
            .delay(delay)
            .attr('transform', 'translate(-150,0)');
    }
}

//Continuously moves the circles with different speeds
function goRound(d) {
    d3.select(this)
        .transition().duration(function (d) { return d.speed; })
        .ease(d3.easeLinear)
        .attrTween("transform", function () { return d3.interpolateString("rotate(0)", "rotate(360)"); })
        .on("end", goRound);
}