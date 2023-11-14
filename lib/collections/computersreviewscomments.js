ComputersReviewsComments = new Mongo.Collection('computersreviewscomments');

//Just an extra layer of security
ComputersReviewsComments.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

ComputersReviewsComments.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
