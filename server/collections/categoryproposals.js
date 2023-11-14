CategoryProposals = new Mongo.Collection('categoryproposals');

//Just an extra layer of security
CategoryProposals.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

CategoryProposals.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
