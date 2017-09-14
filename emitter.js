'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;


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
        timetable: {},

        on: function (event, context, handler) {
            var key = Object.keys(this.timetable);
            var ev = {};
            ev.event = event;
            ev.context = context;
            ev.handler = handler;
            ev.emitNum = 0;
            this.timetable[key.length] = ev;

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {on}
         */
        off: function (event, context) {
            var e = event;
            var c = context;

            for (var key in this.timetable) {
                if (this.timetable[key].event === e && this.timetable[key].context === c) {
                    delete this.timetable[key];

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
                emitEvent(eArr[j], this.timetable);
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
            var key = Object.keys(this.timetable);
            var ev = {};
            ev.event = event;
            ev.context = context;
            ev.handler = handler;
            if (times > 0) {
                ev.times = times;
                ev.emitNum = 0;
            }
            this.timetable[key.length] = ev;

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
            var key = Object.keys(this.timetable);
            var ev = {};
            ev.event = event;
            ev.context = context;
            ev.handler = handler;
            if (frequency > 0) {
                ev.frequency = frequency;
                ev.emitNum = 0;
            }
            this.timetable[key.length] = ev;

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


function emitEvent(event, timetable) {
    for (var key in timetable) {
        if (timetable[key].event === event) {
            timetable[key].emitNum++;
            var cS = checkSeveral(timetable[key].emitNum, timetable[key].times);
            var cT = checkThrough(timetable[key].emitNum, timetable[key].frequency);
            emitEventDo(cS, cT, key, timetable);

        }
    }
}
function emitEventDo(cS, cT, key, timetable) {
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
