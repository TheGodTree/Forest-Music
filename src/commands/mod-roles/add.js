'use babel';
'use strict';

import Command from '../command';
import CommandFormatError from '../../errors/command-format';

export default class AddModRoleCommand extends Command {
	constructor(bot) {
		super(bot, {
			name: 'add-mod-role',
			module: 'mod-roles',
			memberName: 'add',
			description: 'Adds a moderator role.',
			usage: 'add-mod-role <role>',
			details: 'The role must be the name or ID of a role, or a role mention. Only administrators may use this command.',
			examples: ['add-mod-role cool', 'add-mod-role 205536402341888001', 'add-mod-role @CoolPeopleRole'],
			guildOnly: true
		});
	}

	hasPermission(guild, user) {
		return this.bot.permissions.isAdmin(guild, user);
	}

	async run(message, args) {
		if(!args[0]) throw new CommandFormatError(this, message.guild);
		const matches = this.bot.util.patterns.roleID.exec(args[0]);
		const idRole = matches ? message.guild.roles.get(matches[1]) : null;
		const roles = idRole ? [idRole] : this.bot.util.search(message.guild.roles.array(), args[0]);

		if(roles.length === 1) {
			if(this.bot.storage.modRoles.save(roles[0])) {
				return `Added "${roles[0].name}" to the moderator roles.`;
			} else {
				return `Unable to add "${roles[0].name}" to the moderator roles. It already is one.`;
			}
		} else if(roles.length > 1) {
			return this.bot.util.disambiguation(roles, 'roles');
		} else {
			return `Unable to identify role.`;
		}
	}
}
