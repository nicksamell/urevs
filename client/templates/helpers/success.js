//DiscoverMeteor Start

Successes = new Mongo.Collection(null);

throwSuccess = function(message) {
	Successes.insert({message: message});
};

//DiscoverMeteor End
