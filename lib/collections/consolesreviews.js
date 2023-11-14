ConsolesReviews = new Mongo.Collection('consolesreviews');

//Just an extra layer of security
ConsolesReviews.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

ConsolesReviews.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
