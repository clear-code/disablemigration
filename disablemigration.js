// 設定移行ウィザードを無効化するだけでなく、自動的に特定の内容だけをインポートさせたい場合の設定

pref("extensions.disablemigration.autoMigration.enabled", true);
pref("extensions.disablemigration.autoMigration.migrateAsManual", true);

// ie, opera, dogbert, safari, seamonkey
pref("extensions.disablemigration.autoMigration.target", "ie");

/* see nsIBrowserProfileMigrator
	0  = all
	1  = settings
	2  = cookies
	4  = history
	8  = form data
	16 = passwords
	32 = bookmarks
	64 = other data
*/
pref("extensions.disablemigration.autoMigration.items", 32);
