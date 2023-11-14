TvsReviewsComments = new Mongo.Collection('tvsreviewscomments');

//Just an extra layer of security
TvsReviewsComments.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

TvsReviewsComments.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
