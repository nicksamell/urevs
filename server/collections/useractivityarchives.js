UserActivityArchives = new Mongo.Collection('useractivityarchives');

//Just an extra layer of security
UserActivityArchives.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

UserActivityArchives.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
