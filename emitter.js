'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;


var timetable = {};

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
   // timetable = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {on}
         */
        tt: {},

        on: function (event, context, handler) {
            var key = Object.keys(timetable);
            var key2 = Object.keys(this.tt);
            var ev = {};
            ev.event = event;
            ev.context = context;
            ev.handler = handler;
            ev.emitNum = 0;
            timetable[key.length] = ev;
            this.tt[key2.length] = ev;
            console.info('-------');
            console.info(this.tt);
            console.info('-------');

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {on}
         */
        off: function (event, context) {
            for (var key in timetable) {
                if (timetable[key].event === event && timetable[key].context === context) {
                    delete timetable[key];

                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {on}
         */
        emit: function (event) {
            var eArr = eventArray(event);
            for (var j = 0; j <= eArr.length; j++) {
                emitEvent(eArr[j]);
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {on}
         */
        several: function (event, context, handler, times) {
            var key = Object.keys(timetable);
            var key2 = Object.keys(this.tt);
            var ev = {};
            ev.event = event;
            ev.context = context;
            ev.handler = handler;
            if (times > 0) {
                ev.times = times;
                ev.emitNum = 0;
            }

            this.tt[key2.length] = ev;
            console.info('-------');
            console.info(this.tt);
            console.info('-------');
            timetable[key.length] = ev;

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {on}
         */
        through: function (event, context, handler, frequency) {
            var key = Object.keys(timetable);
            var key2 = Object.keys(this.tt);
            var ev = {};
            ev.event = event;
            ev.context = context;
            ev.handler = handler;
            if (frequency > 0) {
                ev.frequency = frequency;
                ev.emitNum = 0;
            }
            timetable[key.length] = ev;
            this.tt[key2.length] = ev;
            console.info('-------');
            console.info(this.tt);
            console.info('-------');

            return this;
        }
    };
}

function eventArray(event) {
    var eArr = [];
    eArr[0] = event;
    var i = 1;
    while (event.lastIndexOf('.') !== -1) {
        var j = event.substring(0, event.lastIndexOf('.'));
        eArr[i] = j;
        event = j;
        i++;
    }

    return eArr;
}


function emitEvent(event) {
    for (var key in timetable) {
        if (timetable[key].event === event) {
            timetable[key].emitNum++;
            var cS = checkSeveral(timetable[key].emitNum, timetable[key].times);
            var cT = checkThrough(timetable[key].emitNum, timetable[key].frequency);
            emitEventDo(cS, cT, key);

        }
    }
}
function emitEventDo(cS, cT, key) {
    if (cS && cT) {
        timetable[key].handler.call(timetable[key].context);
    }
}

function checkSeveral(emitNum, times) {
    if (typeof(times) === 'number' && emitNum > times) {
        return false;
    }

    return true;
}

function checkThrough(emitNum, frequency) {
    if ((emitNum - 1) % frequency !== 0 && typeof(frequency) === 'number') {
        return false;
    }

    return true;
}
