CamerasReviews = new Mongo.Collection('camerasreviews');

//Just an extra layer of security
CamerasReviews.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

CamerasReviews.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
