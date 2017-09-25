import moment = require('moment');
import _ = require('lodash');
var chroma = require ('chroma-js');
var d3 = require('d3');
var fs = require('fs');
var jsdom = require("jsdom");

import logg = require('../logging/logger');
var logger = logg.Logger.getInstance('logging/loggerSettings.json');

const YAXIS_WIDTH = 40;
const HEADER_HEIGHT = 32;
const XAXIS_HEIGHT = 24;
const XAXIS_TICKCOUNT = 7;
const MARGIN = 0;

let parseDate = d3.time.format('%d-%m-%Y %H:%M').parse;
let parseLongDate = d3.time.format('%d-%m-%Y %H:%M:%S').parse;

export class ChartsAux {

    public static generateChartTest(journals, endDate, callback) {

        if (!journals || (journals.length === 0)) {
            callback(null);
        } else {
            let sortedJournals = _.sortBy(journals, [(element) => {
                let time = element.sessionDate;
                return moment(time, 'DD-MM-YYYY HH:mm').valueOf();
            }]);

            let scales = function () {
                let today = moment(endDate, 'DD-MM-YYYY');
                let width = 673;
                let height = 87;

                let endDateObject = moment(endDate, 'DD-MM-YYYY');

                let startDate = today.subtract(6, 'days');

                endDateObject.hour(23);
                endDateObject.minute(59);
                startDate.hour(0);
                startDate.minute(0);

                logger.info(endDateObject.toDate().toString());
                logger.info(startDate.toDate().toString());
                let x = d3.time.scale().domain([startDate.toDate(), endDateObject.toDate()]).range([0, width]);
                let y = d3.scale.linear().domain([0, 100]).range([height, 0]);
                return { x, y };
            };

            let scale = scales();

            let lineConstructor = d3.svg.line()
                .x(function (d) {
                    let parsed = parseDate(d.sessionDate);
                    if (!parsed) {
                        parsed = parseLongDate(d.sessionDate);
                    }
                    return scale.x(parsed);
                })
                .y(function (d) { return scale.y(d.mood) })
                .interpolate("cardinal")
                .tension(0.9);

            let flatLineConstructor = d3.svg.line()
                .x(function (d) {
                    let parsed = parseDate(d.sessionDate);
                    if (!parsed) {
                        parsed = parseLongDate(d.sessionDate);
                    }
                    let valueX = scale.x(parsed);
                    return valueX;
                })
                .y(function (d) {
                    let valueY = scale.y(d.mood);
                    return valueY;
                })
                .interpolate("linear");

            try {
                jsdom.env({
                    html: '<body> </body>',
                    features: { QuerySelector: true }, //you need query selector for D3 to work
                    done: function (errors, window) {
                        window.d3 = d3.select(window.document); //get d3 into the dom
                        let svg = window.d3.select('body')
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
                            .attr('class', 'line-graph')
                        // .attr('height', (parseInt(props.dimensions.height,10))- HEADER_HEIGHT - XAXIS_HEIGHT )

                        window.d3.select('g')
                            .selectAll('.feeling').data(sortedJournals)
                            .enter()
                            .append('path')
                            .attr('class', 'feeling')
                            .attr('d', flatLineConstructor(sortedJournals)) // set starting position
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

                        let x = window.d3.select('.container').html();

                        callback(window.d3.select('.container').html());

                    }
                });

            } catch (e) {
                logger.error(e);
                return null;
            }
        }        
    }

    public static generateMoodTest(value) {

        let colorScale = chroma.scale(['#e86e6b', '#fcd56b', '#92D381']);
        let color = colorScale(value).css()

        return `
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
            <rect x="0" y="0" width="160" rx="3" ry="3" height="9" stroke="transparent" fill="#d9d9d9"
                   stroke-width="8" fill-opacity="1" stroke-opacity="0"/>
            <rect x="0" y="0" width="${value * 1.2}" height="9" rx="3" ry="3" stroke="transparent" fill="${color}"
                   fill-opacity="1" stroke-opacity="0"/>
        </svg>`;
    }

    public static generateHistogramTest(activities, callback) {

        let width = 673
        let height = 87;
        if (!activities) {
            callback(null)
        } else {
            try {
                jsdom.env({
                    html: '<body> </body>',
                    features: { QuerySelector: true }, //you need query selector for D3 to work
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
                                width,
                                height,
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

                        let x = window.d3.select('.container').html();
                        callback(window.d3.select('.container').html());
                    }
                });
            } catch (e) {
                logger.error(e);
                return null;
            }
        } 
    }

    public static hourHistogram(activityByHour, callback) {
        let width = 264
        let height = 95;
        if (!activityByHour) {
            callback(null)
        } else {
            try {
                jsdom.env({
                    html: '<body> </body>',
                    features: { QuerySelector: true }, //you need query selector for D3 to work
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
                                width,
                                height,
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
                                return "translate(" + ((i * binSize) + i )+ "," + (height - y(d.length / 7)) + ")";
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

                        let x = window.d3.select('.container').html();
                        callback(window.d3.select('.container').html());
                    }
                });
            } catch (e) {
                logger.error(e);
                return null;
            }
        }   
    }

}