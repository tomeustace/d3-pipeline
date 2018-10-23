	
import * as d3 from 'd3';
import { addOperation } from './processor';
import { initGears } from './gears';
	
let w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    totalHeight = w.innerHeight || e.clientHeight || g.clientHeight,
    xTranslate = 200,
    yTranslate = 200;

let margin = {top: 30, right: 30, bottom: 30, left: 30};
let width = Math.min(500, (totalHeight - 20), margin.left - margin.right);
let	height = width;
let processorCenterCircleColor = '#ffffff';

export function loadPipeline() {
	
    let svg = createContainer();

    let successGroup = svg.append('g')
       .attr('transform', 'translate(400, 0), scale(0.7)')
       .attr('class','success-group');

    successGroup.append('ellipse')
        .attr('class','success-marker')
        .style('fill', 'white')
        .style('stroke', 'white');

    let errorGroup = svg.append('g')
       .attr('transform', 'translate(400, 200), scale(0.7)')
       .attr('class','error-group');

    errorGroup.append('ellipse')
        .attr('class','error-marker')
        .style('fill', 'white')
        .style('stroke', 'white');

	svg.append("circle")
        .attr("class", "centerCircle")
        .attr("cx", 300)
        .attr("cy", 0)
        .attr("r", 18)
        .style("fill", processorCenterCircleColor);
}	
	
export function processing(nodeCount) {
    initGears();

    var circle = d3.selectAll(".scheduled");
    var dur = 1000 - nodeCount,
        del = 100;
        
        circle
            .transition("in").duration(dur).delay(function(d,i) { 
                return 1*del + i*del; 
            })
            .attr("cx", function() {
                return d3.select('.centerCircle').attr('cx');
            })
            .attr("cy", function() {
                return d3.select('.centerCircle').attr('cy');
            })
            .on('end', enteredReactor)
}

function enteredReactor() {
    d3.select(this).style('fill','white');
    addOperation(this);
}


function createContainer() {
	return d3.select("#svg-container").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr('id','vis-container')
        .attr("transform", "translate(" + xTranslate + "," + yTranslate + ")");
}
