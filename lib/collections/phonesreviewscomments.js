PhonesReviewsComments = new Mongo.Collection('phonesreviewscomments');

//Just an extra layer of security
PhonesReviewsComments.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

PhonesReviewsComments.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
