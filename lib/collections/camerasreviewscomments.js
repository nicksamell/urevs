CamerasReviewsComments = new Mongo.Collection('camerasreviewscomments');

//Just an extra layer of security
CamerasReviewsComments.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

CamerasReviewsComments.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
