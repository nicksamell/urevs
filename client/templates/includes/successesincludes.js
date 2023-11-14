//DiscoverMeteor Start

Template.successes.helpers({
	successes: function() {
		return Successes.find();
	}
});

Template.success.onRendered(function() {
	var success = this.data;

	Meteor.setTimeout(function () {
		Successes.remove(success._id);
	}, 8000);
});

//DiscoverMeteor End
