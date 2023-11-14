UserFlagsReceived = new Mongo.Collection('userflagsreceived');

//Just an extra layer of security
UserFlagsReceived.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

UserFlagsReceived.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
