GamesReviewsComments = new Mongo.Collection('gamesreviewscomments');

//Just an extra layer of security
GamesReviewsComments.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

GamesReviewsComments.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
