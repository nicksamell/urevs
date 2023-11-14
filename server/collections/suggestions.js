Suggestions = new Mongo.Collection('suggestions');

//Just an extra layer of security
Suggestions.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

Suggestions.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
