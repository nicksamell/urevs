PhonesReviews = new Mongo.Collection('phonesreviews');

//Just an extra layer of security
PhonesReviews.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

PhonesReviews.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
