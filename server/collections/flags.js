Flags = new Mongo.Collection('flags');

//Just an extra layer of security
Flags.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

Flags.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
