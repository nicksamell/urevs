YoutubeRequests = new Mongo.Collection('youtuberequests');

//Just an extra layer of security
YoutubeRequests.allow({
	insert() { return false; },
	update() { return false; },
	remove() { return false; }
});

YoutubeRequests.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
