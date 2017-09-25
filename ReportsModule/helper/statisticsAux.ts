import moment = require('moment');
import _ = require('lodash');

export class StatisticsAux {

    public static journalStatistics(journals) {

        let weekdaysMorning = [];
        let weekdaysAfternoon = [];
        let weekdaysEvening = [];
        let weekendsMorning = [];
        let weekendsAfternoon = [];
        let weekendsEvening = [];

        let bodyStatistics = [];
        let allBodyParts = [];

        journals.forEach((journal) => {

            let bodyAnswer = _.find(journal.questions, { type: 'BS' });
            if (bodyAnswer) {
                let bodySymptons = JSON.parse(bodyAnswer.answer)
                _.forEach(bodySymptons, (value, key) => {

                    let partExists = _.find(allBodyParts, key);
                    if (!partExists && value.length > 0) {
                        allBodyParts.push(key);
                    }

                    _.forEach(value, (symptom) => {

                        let bodySymptomPack = _.find(bodyStatistics, { bodyPart: key, symptom });
                        if (bodySymptomPack) {
                            let bodySymptomPackIndex = _.indexOf(bodyStatistics, bodySymptomPack);
                            bodySymptomPack.amount += 1;
                            bodyStatistics.splice(bodySymptomPackIndex, 1, bodySymptomPack);
                        } else {
                            bodyStatistics.push({
                                bodyPart: key, 
                                symptom,
                                amount: 1,
                            });
                        }

                    });
                });
            }

            let sessionDate = moment(journal.sessionDate, 'DD-MM-YYYY HH:mm');
            if (sessionDate.day() === 0 || sessionDate.day() === 6 ) {
                // weekend
                let hour = sessionDate.hour();
                if (hour < 6) {
                } else if (hour < 12) {
                    weekendsMorning.push(journal);
                } else if (hour < 18) {
                    weekendsAfternoon.push(journal);
                } else {
                    weekendsEvening.push(journal);
                }
            } else {
                // weekday 
                let hour = sessionDate.hour();
                if (hour < 6) {
                } else if (hour < 12) {
                    weekdaysMorning.push(journal);
                } else if (hour < 18) {
                    weekdaysAfternoon.push(journal);
                } else {
                    weekdaysEvening.push(journal);
                }
            }
        });

        let testMean = _.meanBy(weekdaysAfternoon, (journal) => {
            return JSON.parse(journal.mood);
        });

        bodyStatistics.sort((elementA, elementB) => {
            return elementB.amount - elementA.amount;
        });
        let groupedBodySymptoms = [];
        let totalOthers = 0;
        bodyStatistics.forEach((bodySymptom, i) => {
            if (i < 6) {
                groupedBodySymptoms.push(bodySymptom);
            } else {
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
            groupedBodySymptoms,
            allBodyParts,
            lowerJournal: _.minBy(journals, (journal) => {
                return JSON.parse(journal.mood);
            }),
            higherJournal: _.maxBy(journals, (journal) => {
                return JSON.parse(journal.mood);
            }),
            morningWeekday: {
                totalJournals: weekdaysMorning.length,
                averageMood: (weekdaysMorning.length) ? _.meanBy(weekdaysMorning, (journal) => {
                    return JSON.parse(journal.mood);
                }) : 0,
            },
            afternoonWeekday: {
                totalJournals: weekdaysAfternoon.length,
                averageMood: (weekdaysAfternoon.length) ? _.meanBy(weekdaysAfternoon, (journal) => {
                    return JSON.parse(journal.mood);
                }): 0,
            },
            eveningWeekday: {
                totalJournals: weekdaysEvening.length,
                averageMood: (weekdaysEvening.length) ? _.meanBy(weekdaysEvening, (journal) => {
                    return JSON.parse(journal.mood);
                }): 0,
            },
            morningWeekend: {
                totalJournals: weekendsMorning.length,
                averageMood: (weekendsMorning.length) ? _.meanBy(weekendsMorning, (journal) => {
                    return JSON.parse(journal.mood);
                }) : 0,
            },
            afternoonWeekend: {
                totalJournals: weekendsAfternoon.length,
                averageMood: (weekendsAfternoon.length) ? _.meanBy(weekendsAfternoon, (journal) => {
                    return JSON.parse(journal.mood);
                }) : 0,
            },
            eveningWeekend: {
                totalJournals: weekendsEvening.length,
                averageMood: (weekendsEvening.length) ? _.meanBy(weekendsEvening, (journal) => {
                    return JSON.parse(journal.mood);
                }) : 0,
            },
        }
    }

    public static activityStatistics(activities) {


        let grouped = _.groupBy(activities, 'activityId');
        let ordered = _.orderBy(grouped,  (element) => {
            return element.length;
        }, 'desc');

        let popular1;
        let popular2;
        let popular3;
        let popular4;
        let activitiesOrdered = [];
        let sumOthers = 0;

        ordered.forEach((activityGroup, i) => {
            if (i < 9) {
                activitiesOrdered.push({
                    amount: activityGroup.length,
                    activity: activityGroup[0],
                });
            } else {
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
            } 
        }

        if (ordered.length > 1) {
            popular2 = {
                amount: ordered[1].length,
                activity: ordered[1][0],
            } 
        }

        if (ordered.length > 2) {
            popular3 = {
                amount: ordered[2].length,
                activity: ordered[2][0],
            } 
        }

        if (ordered.length > 3) {
            popular4 = {
                amount: ordered[3].length,
                activity: ordered[3][0],
            } 
        }

        let weekendByHour = [];
        let weekdayByHour = [];

        weekdayByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();
            return (day !== 0 && day !== 6 && hour < 3);
        }));
        weekdayByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day !== 0 && day !== 6 && hour < 6 && hour >= 3);
        }));
        weekdayByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day !== 0 && day !== 6 && hour < 9 && hour >= 6);
        }));
        weekdayByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day !== 0 && day !== 6 && hour < 12 && hour >= 9);
        }));
        weekdayByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day !== 0 && day !== 6 && hour < 15 && hour >= 12);
        }));
        weekdayByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day !== 0 && day !== 6 && hour < 18 && hour >= 15);
        }));
        weekdayByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day !== 0 && day !== 6 && hour < 21 && hour >= 18);
        }));
        weekdayByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day !== 0 && day !== 6 && hour >= 21);
        }));

        weekendByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();
            
            return ((day === 0 || day === 6) && hour < 3);
        }));
        weekendByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return ((day === 0 || day === 6) && hour < 6 && hour >= 3);
        }));
        weekendByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return ((day === 0 || day === 6) && hour < 9 && hour >= 6);
        }));
        weekendByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return ((day === 0 || day === 6) && hour < 12 && hour >= 9);
        }));
        weekendByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return ((day === 0 || day === 6) && hour < 15 && hour >= 12);
        }));
        weekendByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return ((day === 0 || day === 6) && hour < 18 && hour >= 15);
        }));
        weekendByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return ((day === 0 || day === 6) && hour < 21 && hour >= 18);
        }));
        weekendByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return ((day === 0 || day === 6) && hour >= 21);
        }));

        let weekOverView = [];

        for (let i = 0; i < 56; i++){
            weekOverView.push([]);
        }
        activities.forEach((activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let module = Math.floor(sessionDate.hour() / 3);
            let endDate = moment();
            let startDate = moment(sessionDate);

            endDate.hour(0);
            endDate.minute(0);
            startDate.hour(0);
            startDate.minute(0);

            let diffDays = endDate.diff(startDate, 'days');

            let position = 48;
            let startPosition = 48 - (diffDays * 8);
            if (startPosition >= 0) {
                startPosition += module; 
                weekOverView[startPosition].push(activity);
            }
            
        });

        return {
            activitiesOrdered,
            popular1,
            popular2,
            popular3,
            popular4,
            weekdayByHour,
            weekendByHour,
            weekOverView,
        }
    }
}