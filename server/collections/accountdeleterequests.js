AccountDeleteRequests = new Mongo.Collection('AccountDeleteRequests');

//Just an extra layer of security
AccountDeleteRequests.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

AccountDeleteRequests.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
