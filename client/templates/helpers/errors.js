//DiscoverMeteor Start

Errors = new Mongo.Collection(null);

throwError = function(message) {
	if (message.message == 'Internal server error [500]') {
		Errors.insert({message: message});
		Errors.insert({message: TAPi18n.__('something_broke_error')});
	} else {
		Errors.insert({message: message});
	}
};

//DiscoverMeteor End

