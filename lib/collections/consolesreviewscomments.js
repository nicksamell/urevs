ConsolesReviewsComments = new Mongo.Collection('consolesreviewscomments');

//Just an extra layer of security
ConsolesReviewsComments.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

ConsolesReviewsComments.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
