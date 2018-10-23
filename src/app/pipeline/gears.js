import * as d3 from 'd3';

var radius = 25,
    x = Math.sin(2 * Math.PI / 3),
    y = Math.cos(2 * Math.PI / 3);

var offset = 10,
    speed = 2,
    start = Date.now();

export function initGears() {
    var svg = d3.select("#vis-container");
    let frame = svg.append('g')
        .datum({ radius: Infinity })
        .attr('id', 'processor-group')

    frame.style('opacity','0')
        .transition()
        .duration(1500)
        .style('opacity', '1');

    frame.append("g")
        .datum({ teeth: 6, radius: radius })
        .append("path")
        .attr("d", gear);

    frame.append("g")
        .attr("transform", "translate(0,-" + radius * 2 + ")")
        .datum({ teeth: 22, radius: -radius * 2.5 })
        .append("path")
        .attr("d", gear);

    frame.append("g")
        .attr("transform", "translate(" + -radius * 2 * x + "," + -radius * 3 * y + ")")
        .datum({ teeth: 22, radius: -radius * 2.5 })
        .append("path")
        .attr("d", gear);

    frame.append("g")
        .attr("transform", "translate(" + radius * 2 * x + "," + -radius * 3 * y + ")")
        .datum({ teeth: 22, radius: -radius * 2.5 })
        .append("path")
        .attr("d", gear);

    d3.timer(function () {
        var angle = (Date.now() - start) * speed,
            transform = function (d) { return "scale(.6), translate(315,0), rotate(" + angle / d.radius + ")"; };
        frame.selectAll("path").attr("transform", transform);
        frame.attr("transform", transform); // frame of reference
    });

}

function gear(d) {
    var n = d.teeth,
        r2 = Math.abs(d.radius),
        r0 = r2 - 4,
        r1 = r2 + 4,
        r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 20) : 20,
        da = Math.PI / n,
        a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0),
        i = -1,
        path = ["M", r0 * Math.cos(a0), ",", r0 * Math.sin(a0)];
    while (++i < n) path.push(
        "A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0),
        "L", r2 * Math.cos(a0), ",", r2 * Math.sin(a0),
        "L", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
        "A", r1, ",", r1, " 0 0,1 ", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
        "L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0),
        "L", r0 * Math.cos(a0), ",", r0 * Math.sin(a0));
    path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
    return path.join("");
}

