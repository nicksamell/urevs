Template.accessDenied.onRendered(function() {
	Meteor.setTimeout(function() {
		if (!$('#login-buttons-logout').length) {
			$('.dropdown-toggle').html(TAPi18n.__('access_denied_sign_in'));
			
			$('li#login-dropdown-list').attr("style", "list-style: none;");
		}
	}, 500);
});

Template.accessDenied.helpers({
	fromIntroModal: function() {
		return Session.get('fromIntroModal');
	},
	ifStartReview: function() {
		if (Router.current().route.getName() == 'searchLandingPage') {
			return true;
		}
	}
});

Template.accessDenied.events({
	'click .dropdown-toggle': function(e) {
		if ($(window).width() < 990) {
			$(e.target).siblings('.dropdown-menu').attr("style", "left: 20px;");
		} else {
			$(e.target).siblings('.dropdown-menu').attr("style", "margin-left: 80px;");
		}
	}
});
