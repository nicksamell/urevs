TvsReviews = new Mongo.Collection('tvsreviews');

//Just an extra layer of security
TvsReviews.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

TvsReviews.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
