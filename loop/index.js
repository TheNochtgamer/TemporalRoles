const { Client, Role, GuildMember } = require('discord.js');
const Colors = require('colors');
const moment = require('moment');

class Timer {
    /**
     * @param {String} roleId 
     * @param {String} memberId 
     * @param {GuildMember} member 
     * @param {moment.Moment} timeout 
     */
    constructor(roleId, memberId, member, timeout) {
        this.roleId = roleId;
        this.memberId = memberId;
        this.member = member;
        this.timeout = timeout;
    }
}

class Loop {
    timers = [new Timer()];

    /**
     * @param {Client} client 
     */
    constructor(client, interval) {
        this.timers.pop();
        this.bot = client;
        this.interval = interval;
        this.main();
    }

    /**
     * @param {Role} role 
     * @param {GuildMember} member 
     * @param {Number} tiempo 
     */
    async add(role, member, tiempo) {
        if (this.checkTimer(role, member)) {
            console.log(Colors.red('Ya existe este contador R:' + Colors.gray(role.id) + ' | U:' + Colors.gray(member.id)));
            return;
        }

        let timeout = moment().add(tiempo, 'millisecond');
        this.timers.push(new Timer(role.id, member.id, member, timeout));
        console.log('Contador añadido:', this.timers);
    }

    /**
     * @param {Role} role 
     */
    remove(role) {
        this.timers.forEach((timer, index) => {
            if (timer.roleId == role.id) {
                console.log(Colors.red('Contador cortado R:' + Colors.gray(timer.roleId) + ' | U:' + Colors.gray(timer.memberId)));
                this.timers.splice(index, 1);
            }
        });
    }

    /**
     * @param {Role} role 
     * @param {GuildMember} member 
     * @returns 
     */
    kill(role, member) {
        for (const index in this.timers) {
            const timer = this.timers[index];
            const now = moment();
            if (timer.roleId == role.id && timer.memberId == member.id && now.diff(timer.timeout, 'second') < -1) {
                console.log(Colors.red('Contador cortado R:' + Colors.gray(timer.roleId) + ' | U:' + Colors.gray(timer.memberId)));
                this.timers.splice(index, 1);
                return true;
            }
        }
        return false;
    }

    /**
     * @param {Role} role 
     * @param {GuildMember} member 
     * @returns 
     */
    checkTimer(role, member) {
        let check = (timer) => timer.roleId == role.id && timer.memberId == member.id;
        let result = this.timers.some(check);

        return result;
    }

    main() {
        setInterval(() => {
            const now = moment();
            this.timers.forEach(async (timer, index) => {
                if (now.diff(timer.timeout, 'millisecond') > 0) {
                    if (!this.bot.timedRoles.get(timer.roleId)) {
                        console.log(Colors.red('Contador bug R:' + Colors.gray(timer.roleId) + ' | U:' + Colors.gray(timer.memberId)));
                        this.timers.splice(index, 1);
                        return;
                    }
                    console.log(Colors.green('Contador finalizado R:' + Colors.gray(timer.roleId) + ' | U:' + Colors.gray(timer.memberId)));

                    try {
                        await timer.member.roles.remove(timer.roleId);
                    } catch (error) {

                    }
                    this.timers.splice(index, 1);
                } else {
                    console.log(Colors.blue('tick... | ^' + this.timers.length));
                }
            });
        }, this.interval);
    }
}

module.exports = Loop;