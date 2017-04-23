"use strict";
var moment = require("moment");
var _ = require("lodash");
var StatisticsAux = (function () {
    function StatisticsAux() {
    }
    StatisticsAux.journalStatistics = function (journals) {
        var weekdaysMorning = [];
        var weekdaysAfternoon = [];
        var weekdaysEvening = [];
        var weekendsMorning = [];
        var weekendsAfternoon = [];
        var weekendsEvening = [];
        journals.forEach(function (journal) {
            var sessionDate = moment(journal.sessionDate, 'DD-MM-YYYY HH:mm');
            if (sessionDate.day() > 4) {
                // weekend
                var hour = sessionDate.hour();
                if (hour < 6) {
                }
                else if (hour < 12) {
                    weekendsMorning.push(journal);
                }
                else if (hour < 18) {
                    weekendsAfternoon.push(journal);
                }
                else {
                    weekendsEvening.push(journal);
                }
            }
            else {
                // weekday 
                var hour = sessionDate.hour();
                if (hour < 6) {
                }
                else if (hour < 12) {
                    weekdaysMorning.push(journal);
                }
                else if (hour < 18) {
                    weekdaysAfternoon.push(journal);
                }
                else {
                    weekdaysEvening.push(journal);
                }
            }
        });
        return {
            lowerJournal: _.minBy(journals, 'mood'),
            higherJournal: _.maxBy(journals, 'mood'),
            morningWeekday: {
                totalJournals: weekdaysMorning.length,
                averageMood: _.meanBy(weekdaysMorning, 'mood'),
            },
            afternoonWeekday: {
                totalJournals: weekdaysAfternoon.length,
                averageMood: _.meanBy(weekdaysAfternoon, 'mood'),
            },
            eveningWeekday: {
                totalJournals: weekdaysEvening.length,
                averageMood: _.meanBy(weekdaysEvening, 'mood'),
            },
            morningWeekend: {
                totalJournals: weekendsMorning.length,
                averageMood: _.meanBy(weekendsMorning, 'mood'),
            },
            afternoonWeekend: {
                totalJournals: weekendsAfternoon.length,
                averageMood: _.meanBy(weekendsAfternoon, 'mood'),
            },
            eveningWeekend: {
                totalJournals: weekendsEvening.length,
                averageMood: _.meanBy(weekendsEvening, 'mood'),
            },
        };
    };
    StatisticsAux.activityStatistics = function (activities) {
        var grouped = _.groupBy(activities, 'activityId');
        var ordered = _.orderBy(grouped, function (element) {
            return element.length;
        }, 'desc');
        var popular1;
        var popular2;
        var popular3;
        var popular4;
        if (ordered.length > 0) {
            popular1 = {
                amount: ordered[0].length,
                activity: ordered[0][0],
            };
        }
        if (ordered.length > 1) {
            popular2 = {
                amount: ordered[1].length,
                activity: ordered[1][0],
            };
        }
        if (ordered.length > 2) {
            popular3 = {
                amount: ordered[2].length,
                activity: ordered[2][0],
            };
        }
        if (ordered.length > 3) {
            popular4 = {
                amount: ordered[3].length,
                activity: ordered[3][0],
            };
        }
        var weekendByHour = [];
        var weekdayByHour = [];
        weekdayByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day <= 4 && hour < 3);
        }));
        weekdayByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day <= 4 && hour < 6 && hour >= 3);
        }));
        weekdayByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day <= 4 && hour < 9 && hour >= 6);
        }));
        weekdayByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day <= 4 && hour < 12 && hour >= 9);
        }));
        weekdayByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day <= 4 && hour < 15 && hour >= 12);
        }));
        weekdayByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day <= 4 && hour < 18 && hour >= 15);
        }));
        weekdayByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day <= 4 && hour < 21 && hour >= 18);
        }));
        weekdayByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day <= 4 && hour >= 21);
        }));
        weekendByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day > 5 && hour < 3);
        }));
        weekendByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day > 4 && hour < 6 && hour >= 3);
        }));
        weekendByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day > 4 && hour < 9 && hour >= 6);
        }));
        weekendByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day > 4 && hour < 12 && hour >= 9);
        }));
        weekendByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day > 4 && hour < 15 && hour >= 12);
        }));
        weekendByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day > 4 && hour < 18 && hour >= 15);
        }));
        weekendByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day > 4 && hour < 21 && hour >= 18);
        }));
        weekendByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day > 4 && hour >= 21);
        }));
        var weekOverView = [];
        for (var i = 0; i < 56; i++) {
            weekOverView.push([]);
        }
        activities.forEach(function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var module = Math.floor(sessionDate.hour() / 3);
            var endDate = moment();
            var startDate = moment(sessionDate);
            endDate.hour(0);
            endDate.minute(0);
            startDate.hour(0);
            startDate.minute(0);
            var diffDays = endDate.diff(startDate, 'days');
            var position = 48;
            var startPosition = 48 - (diffDays * 8);
            if (startPosition >= 0) {
                startPosition += module;
                weekOverView[startPosition].push(activity);
            }
        });
        return {
            popular1: popular1,
            popular2: popular2,
            popular3: popular3,
            popular4: popular4,
            weekdayByHour: weekdayByHour,
            weekendByHour: weekendByHour,
            weekOverView: weekOverView,
        };
    };
    return StatisticsAux;
}());
exports.StatisticsAux = StatisticsAux;
//# sourceMappingURL=statisticsAux.js.map