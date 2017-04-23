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

        journals.forEach((journal) => {
            let sessionDate = moment(journal.sessionDate, 'DD-MM-YYYY HH:mm');

            if (sessionDate.day() > 4) {
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

            return (day <= 4 && hour < 3);
        }));
        weekdayByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day <= 4 && hour < 6 && hour >= 3);
        }));
        weekdayByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day <= 4 && hour < 9 && hour >= 6);
        }));
        weekdayByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day <= 4 && hour < 12 && hour >= 9);
        }));
        weekdayByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day <= 4 && hour < 15 && hour >= 12);
        }));
        weekdayByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day <= 4 && hour < 18 && hour >= 15);
        }));
        weekdayByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day <= 4 && hour < 21 && hour >= 18);
        }));
        weekdayByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day <= 4 && hour >= 21);
        }));

        weekendByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day > 5 && hour < 3);
        }));
        weekendByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day > 4 && hour < 6 && hour >= 3);
        }));
        weekendByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day > 4 && hour < 9 && hour >= 6);
        }));
        weekendByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day > 4 && hour < 12 && hour >= 9);
        }));
        weekendByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day > 4 && hour < 15 && hour >= 12);
        }));
        weekendByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day > 4 && hour < 18 && hour >= 15);
        }));
        weekendByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day > 4 && hour < 21 && hour >= 18);
        }));
        weekendByHour.push(_.filter(activities, (activity) => {
            let sessionDate = moment(activity.sessionDate, 'DD-MM-YYYY HH:mm');
            let hour = sessionDate.hour();
            let day = sessionDate.day();

            return (day > 4 && hour >= 21);
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