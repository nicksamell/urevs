GamesReviews = new Mongo.Collection('gamesreviews');

//Just an extra layer of security
GamesReviews.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

GamesReviews.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
