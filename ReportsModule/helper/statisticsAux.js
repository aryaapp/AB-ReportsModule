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
        var bodyStatistics = [];
        var allBodyParts = [];
        journals.forEach(function (journal) {
            var bodyAnswer = _.find(journal.questions, { type: 'BS' });
            if (bodyAnswer) {
                var bodySymptons = JSON.parse(bodyAnswer.answer);
                _.forEach(bodySymptons, function (value, key) {
                    var partExists = _.find(allBodyParts, key);
                    if (!partExists && value.length > 0) {
                        allBodyParts.push(key);
                    }
                    _.forEach(value, function (symptom) {
                        var bodySymptomPack = _.find(bodyStatistics, { bodyPart: key, symptom: symptom });
                        if (bodySymptomPack) {
                            var bodySymptomPackIndex = _.indexOf(bodyStatistics, bodySymptomPack);
                            bodySymptomPack.amount += 1;
                            bodyStatistics.splice(bodySymptomPackIndex, 1, bodySymptomPack);
                        }
                        else {
                            bodyStatistics.push({
                                bodyPart: key,
                                symptom: symptom,
                                amount: 1,
                            });
                        }
                    });
                });
            }
            var sessionDate = moment(journal.sessionDate, 'DD-MM-YYYY HH:mm');
            if (sessionDate.day() === 0 || sessionDate.day() === 6) {
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
        var testMean = _.meanBy(weekdaysAfternoon, function (journal) {
            return JSON.parse(journal.mood);
        });
        bodyStatistics.sort(function (elementA, elementB) {
            return elementB.amount - elementA.amount;
        });
        var groupedBodySymptoms = [];
        var totalOthers = 0;
        bodyStatistics.forEach(function (bodySymptom, i) {
            if (i < 6) {
                groupedBodySymptoms.push(bodySymptom);
            }
            else {
                totalOthers += bodySymptom.amount;
            }
        });
        if (totalOthers > 0) {
            groupedBodySymptoms.push({
                symptom: 'other',
                bodyPart: '-',
                amount: totalOthers,
            });
        }
        return {
            groupedBodySymptoms: groupedBodySymptoms,
            allBodyParts: allBodyParts,
            lowerJournal: _.minBy(journals, function (journal) {
                return JSON.parse(journal.mood);
            }),
            higherJournal: _.maxBy(journals, function (journal) {
                return JSON.parse(journal.mood);
            }),
            morningWeekday: {
                totalJournals: weekdaysMorning.length,
                averageMood: (weekdaysMorning.length) ? _.meanBy(weekdaysMorning, function (journal) {
                    return JSON.parse(journal.mood);
                }) : 0,
            },
            afternoonWeekday: {
                totalJournals: weekdaysAfternoon.length,
                averageMood: (weekdaysAfternoon.length) ? _.meanBy(weekdaysAfternoon, function (journal) {
                    return JSON.parse(journal.mood);
                }) : 0,
            },
            eveningWeekday: {
                totalJournals: weekdaysEvening.length,
                averageMood: (weekdaysEvening.length) ? _.meanBy(weekdaysEvening, function (journal) {
                    return JSON.parse(journal.mood);
                }) : 0,
            },
            morningWeekend: {
                totalJournals: weekendsMorning.length,
                averageMood: (weekendsMorning.length) ? _.meanBy(weekendsMorning, function (journal) {
                    return JSON.parse(journal.mood);
                }) : 0,
            },
            afternoonWeekend: {
                totalJournals: weekendsAfternoon.length,
                averageMood: (weekendsAfternoon.length) ? _.meanBy(weekendsAfternoon, function (journal) {
                    return JSON.parse(journal.mood);
                }) : 0,
            },
            eveningWeekend: {
                totalJournals: weekendsEvening.length,
                averageMood: (weekendsEvening.length) ? _.meanBy(weekendsEvening, function (journal) {
                    return JSON.parse(journal.mood);
                }) : 0,
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
        var activitiesOrdered = [];
        var sumOthers = 0;
        ordered.forEach(function (activityGroup, i) {
            if (i < 9) {
                activitiesOrdered.push({
                    amount: activityGroup.length,
                    activity: activityGroup[0],
                });
            }
            else {
                sumOthers += activityGroup.length;
            }
        });
        if (sumOthers > 0) {
            activitiesOrdered.push({
                amount: sumOthers,
                activity: {
                    activityName: 'Other',
                },
            });
        }
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
            return (day !== 0 && day !== 6 && hour < 3);
        }));
        weekdayByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day !== 0 && day !== 6 && hour < 6 && hour >= 3);
        }));
        weekdayByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day !== 0 && day !== 6 && hour < 9 && hour >= 6);
        }));
        weekdayByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day !== 0 && day !== 6 && hour < 12 && hour >= 9);
        }));
        weekdayByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day !== 0 && day !== 6 && hour < 15 && hour >= 12);
        }));
        weekdayByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day !== 0 && day !== 6 && hour < 18 && hour >= 15);
        }));
        weekdayByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day !== 0 && day !== 6 && hour < 21 && hour >= 18);
        }));
        weekdayByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return (day !== 0 && day !== 6 && hour >= 21);
        }));
        weekendByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return ((day === 0 || day === 6) && hour < 3);
        }));
        weekendByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return ((day === 0 || day === 6) && hour < 6 && hour >= 3);
        }));
        weekendByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return ((day === 0 || day === 6) && hour < 9 && hour >= 6);
        }));
        weekendByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return ((day === 0 || day === 6) && hour < 12 && hour >= 9);
        }));
        weekendByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return ((day === 0 || day === 6) && hour < 15 && hour >= 12);
        }));
        weekendByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return ((day === 0 || day === 6) && hour < 18 && hour >= 15);
        }));
        weekendByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return ((day === 0 || day === 6) && hour < 21 && hour >= 18);
        }));
        weekendByHour.push(_.filter(activities, function (activity) {
            var sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            var hour = sessionDate.hour();
            var day = sessionDate.day();
            return ((day === 0 || day === 6) && hour >= 21);
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
            activitiesOrdered: activitiesOrdered,
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