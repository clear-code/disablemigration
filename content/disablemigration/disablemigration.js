var DisableMigration = {

	override : function()
	{
		switch (location.href)
		{
			// Firefox
			case 'chrome://browser/content/migration/migration.xul':
				eval('MigrationWizard.init = ' + 
					MigrationWizard.init.toSource().replace(
						'if (this._autoMigrate) {',
						'$& DisableMigration.hideWindow(); return;'
					)
				);
				break;

			// Thunderbird
			case 'chrome://messenger/content/migration/migration.xul':
				eval('MigrationWizard.init = ' + 
					MigrationWizard.init.toSource().replace(
						'if ("arguments" in window) {',
						'$& DisableMigration.hideWindow(); return;'
					)
				);
				break;
		}
	},

	hideWindow : function()
	{
		window.resizeTo(1, 1);
		window.moveTo(-10000, -10000);

		var waitFlag = this.doAutoMigration();
		window.setTimeout("window.close();", 0);
	},

	doAutoMigration : function()
	{
		if (!this.getBoolPref('extensions.disablemigration.autoMigration.enabled'))
			return;

		var skipInFirstStartup = this.getBoolPref('extensions.disablemigration.autoMigration.migrateAsManual');
		var done = this.getBoolPref('extensions.disablemigration.autoMigration.done');
		var isFirstStartup = ('arguments' in window && window.arguments.length > 1);

		if (skipInFirstStartup && (done || isFirstStartup))
			return;

		var sourceProduct = this.getCharPref('extensions.disablemigration.autoMigration.target');
		if (!sourceProduct)
			return;

		const nsIBrowserProfileMigrator = Components.interfaces.nsIBrowserProfileMigrator;

		var migrator;
		try {
			migrator = Components
					.classes['@mozilla.org/profile/migrator;1?app=browser&type='+sourceProduct]
					.createInstance(nsIBrowserProfileMigrator);

		}
		catch(e) {
		}

		if (!migrator || !migrator.sourceExists)
			return;

		var flags = this.getIntPref('extensions.disablemigration.autoMigration.items') || 0;

		var profile = null;
		if (!migrator.sourceHasMultipleProfiles) {
			var profiles = migrator.sourceProfiles;
			if (profiles && profiles.Count() == 1) {
				var profileName = profiles.QueryElementAt(0, Components.interfaces.nsISupportsString);
				profile = profileName.data;
			}
		}

		try {
			var startup = isFirstStartup ?
					window.arguments[2].QueryInterface(Components.interfaces.nsIProfileStartup) :
					null ;
			migrator.migrate(flags, startup, profile);
			this.Pref.setBoolPref('extensions.disablemigration.autoMigration.done', true);
		}
		catch(e) {
//			alert(e);
		}
	},

	getBoolPref : function(aName)
	{
		try {
			return this.Pref.getBoolPref(aName);
		}
		catch(e) {
		}
		return null;
	},

	getCharPref : function(aName)
	{
		try {
			return this.Pref.getCharPref(aName);
		}
		catch(e) {
		}
		return null;
	},

	getIntPref : function(aName)
	{
		try {
			return this.Pref.getIntPref(aName);
		}
		catch(e) {
		}
		return null;
	},

	Pref : Components
			.classes['@mozilla.org/preferences;1']
			.getService(Components.interfaces.nsIPrefBranch)

};
