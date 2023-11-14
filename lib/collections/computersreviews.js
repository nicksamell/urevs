ComputersReviews = new Mongo.Collection('computersreviews');

//Just an extra layer of security
ComputersReviews.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

ComputersReviews.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
