SearchIndex = new Mongo.Collection('searchindex');

//Just an extra layer of security
SearchIndex.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

SearchIndex.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
