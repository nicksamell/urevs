SpellCheck = new Mongo.Collection('spellcheck');

//Just an extra layer
SpellCheck.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

SpellCheck.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
