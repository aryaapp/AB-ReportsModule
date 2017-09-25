"use strict";
var moment = require("moment");
var _ = require("lodash");
var chroma = require('chroma-js');
var d3 = require('d3');
var fs = require('fs');
var jsdom = require("jsdom");
var logg = require("../logging/logger");
var logger = logg.Logger.getInstance('logging/loggerSettings.json');
var YAXIS_WIDTH = 40;
var HEADER_HEIGHT = 32;
var XAXIS_HEIGHT = 24;
var XAXIS_TICKCOUNT = 7;
var MARGIN = 0;
var parseDate = d3.time.format('%d-%m-%Y %H:%M').parse;
var parseLongDate = d3.time.format('%d-%m-%Y %H:%M:%S').parse;
var ChartsAux = (function () {
    function ChartsAux() {
    }
    ChartsAux.generateChartTest = function (journals, endDate, callback) {
        if (!journals || (journals.length === 0)) {
            callback(null);
        }
        else {
            var sortedJournals_1 = _.sortBy(journals, [function (element) {
                    var time = element.sessionDate;
                    return moment(time, 'DD-MM-YYYY HH:mm').valueOf();
                }]);
            var scales = function () {
                var today = moment(endDate, 'DD-MM-YYYY');
                var width = 673;
                var height = 87;
                var endDateObject = moment(endDate, 'DD-MM-YYYY');
                var startDate = today.subtract(6, 'days');
                endDateObject.hour(23);
                endDateObject.minute(59);
                startDate.hour(0);
                startDate.minute(0);
                logger.info(endDateObject.toDate().toString());
                logger.info(startDate.toDate().toString());
                var x = d3.time.scale().domain([startDate.toDate(), endDateObject.toDate()]).range([0, width]);
                var y = d3.scale.linear().domain([0, 100]).range([height, 0]);
                return { x: x, y: y };
            };
            var scale_1 = scales();
            var lineConstructor = d3.svg.line()
                .x(function (d) {
                var parsed = parseDate(d.sessionDate);
                if (!parsed) {
                    parsed = parseLongDate(d.sessionDate);
                }
                return scale_1.x(parsed);
            })
                .y(function (d) { return scale_1.y(d.mood); })
                .interpolate("cardinal")
                .tension(0.9);
            var flatLineConstructor_1 = d3.svg.line()
                .x(function (d) {
                var parsed = parseDate(d.sessionDate);
                if (!parsed) {
                    parsed = parseLongDate(d.sessionDate);
                }
                var valueX = scale_1.x(parsed);
                return valueX;
            })
                .y(function (d) {
                var valueY = scale_1.y(d.mood);
                return valueY;
            })
                .interpolate("linear");
            try {
                jsdom.env({
                    html: '<body> </body>',
                    features: { QuerySelector: true },
                    done: function (errors, window) {
                        window.d3 = d3.select(window.document); //get d3 into the dom
                        var svg = window.d3.select('body')
                            .append('div').attr('class', 'container') //make a container div to ease the saving process
                            .append('svg')
                            .attr({
                            xmlns: 'http://www.w3.org/2000/svg',
                            width: 673,
                            height: 87,
                            version: 1.1
                        });
                        window.d3.select('svg')
                            .append('g')
                            .attr('class', 'line-graph');
                        // .attr('height', (parseInt(props.dimensions.height,10))- HEADER_HEIGHT - XAXIS_HEIGHT )
                        window.d3.select('g')
                            .selectAll('.feeling').data(sortedJournals_1)
                            .enter()
                            .append('path')
                            .attr('class', 'feeling')
                            .attr('d', flatLineConstructor_1(sortedJournals_1)) // set starting position
                            .attr('stroke-width', 2)
                            .attr("stroke", "#ff0066")
                            .attr('fill', 'none');
                        /*window.d3.select('g')
                            .selectAll('.dots').data(sortedJournals)
                            .enter()
                            .append('circle')
                            .attr('class', 'dots')
                            .attr('cx', (d) => {
                                return scale.x(parseDate(d.sessionDate))
                            })
                            .attr('cy', (d) => {
                                return scale.y(d.mood)
                            })
                            .attr('r', 3)
                            .attr('stroke-width', 0)
                            .attr("stroke", "#565656")
                            .attr('fill', '#565656');*/
                        var x = window.d3.select('.container').html();
                        callback(window.d3.select('.container').html());
                    }
                });
            }
            catch (e) {
                logger.error(e);
                return null;
            }
        }
    };
    ChartsAux.generateMoodTest = function (value) {
        var colorScale = chroma.scale(['#e86e6b', '#fcd56b', '#92D381']);
        var color = colorScale(value).css();
        return "\n        <svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">\n            <rect x=\"0\" y=\"0\" width=\"160\" rx=\"3\" ry=\"3\" height=\"9\" stroke=\"transparent\" fill=\"#d9d9d9\"\n                   stroke-width=\"8\" fill-opacity=\"1\" stroke-opacity=\"0\"/>\n            <rect x=\"0\" y=\"0\" width=\"" + value * 1.2 + "\" height=\"9\" rx=\"3\" ry=\"3\" stroke=\"transparent\" fill=\"" + color + "\"\n                   fill-opacity=\"1\" stroke-opacity=\"0\"/>\n        </svg>";
    };
    ChartsAux.generateHistogramTest = function (activities, callback) {
        var width = 673;
        var height = 87;
        if (!activities) {
            callback(null);
        }
        else {
            try {
                jsdom.env({
                    html: '<body> </body>',
                    features: { QuerySelector: true },
                    done: function (errors, window) {
                        var binSize = 11;
                        var y = d3.scale.linear()
                            .domain([0, 4])
                            .range([0, height]);
                        var formatCount = d3.format(",.0f");
                        window.d3 = d3.select(window.document); //get d3 into the dom
                        window.d3.select('body')
                            .append('div').attr('class', 'container') //make a container div to ease the saving process
                            .append('svg')
                            .attr({
                            xmlns: 'http://www.w3.org/2000/svg',
                            width: width,
                            height: height,
                            version: 1.1
                        });
                        window.d3.select('svg')
                            .append('g');
                        window.d3.select('g')
                            .selectAll(".bar")
                            .data(activities)
                            .enter().append("g")
                            .attr("class", "bar")
                            .attr("transform", function (d, i) {
                            return "translate(" + ((i * binSize) + i) + "," + (height - y(d.length)) + ")";
                        })
                            .append("rect")
                            .attr("x", 1)
                            .attr("width", function (d) {
                            return binSize;
                        })
                            .attr("height", function (d) {
                            return y(d.length);
                        })
                            .attr("fill", "#92d381");
                        var x = window.d3.select('.container').html();
                        callback(window.d3.select('.container').html());
                    }
                });
            }
            catch (e) {
                logger.error(e);
                return null;
            }
        }
    };
    ChartsAux.hourHistogram = function (activityByHour, callback) {
        var width = 264;
        var height = 95;
        if (!activityByHour) {
            callback(null);
        }
        else {
            try {
                jsdom.env({
                    html: '<body> </body>',
                    features: { QuerySelector: true },
                    done: function (errors, window) {
                        var binSize = 32;
                        var y = d3.scale.linear()
                            .domain([0, 4])
                            .range([0, height]);
                        var formatCount = d3.format(",.0f");
                        window.d3 = d3.select(window.document); //get d3 into the dom
                        window.d3.select('body')
                            .append('div').attr('class', 'container') //make a container div to ease the saving process
                            .append('svg')
                            .attr({
                            xmlns: 'http://www.w3.org/2000/svg',
                            width: width,
                            height: height,
                            version: 1.1
                        });
                        window.d3.select('svg')
                            .append('g');
                        window.d3.select('g')
                            .selectAll(".bar")
                            .data(activityByHour)
                            .enter().append("g")
                            .attr("class", "bar")
                            .attr("transform", function (d, i) {
                            return "translate(" + ((i * binSize) + i) + "," + (height - y(d.length / 7)) + ")";
                        })
                            .append("rect")
                            .attr("x", 1)
                            .attr("width", function (d) {
                            return binSize;
                        })
                            .attr("height", function (d) {
                            return y(d.length / 7);
                        })
                            .attr("fill", "#92d381");
                        var x = window.d3.select('.container').html();
                        callback(window.d3.select('.container').html());
                    }
                });
            }
            catch (e) {
                logger.error(e);
                return null;
            }
        }
    };
    return ChartsAux;
}());
exports.ChartsAux = ChartsAux;
//# sourceMappingURL=chartsAux.js.map