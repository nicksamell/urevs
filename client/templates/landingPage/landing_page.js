Template.landingPage.onRendered(function() {
	if (localStorage.getItem('notFirstTimeVisit') != "true") {
		$('#site-search-query1').addClass('flashing-border');
		$('#site-search-query1').addClass('ridge-border');
		Session.set('keyupSearch', false);
	} else {
		//do nothing
	};
	
	Suggestions = new Mongo.Collection(null);
});

Template.landingPage.helpers({
	xs: function() {
		if ($(window).width() < 768) {
			return true;
		} else {
			return false;
		}		
	},
	formBreak: function() {
		if ($(window).width() < 504) {
			return true;
		}
	},
	notFirstTimeVisit: function() {
		if (localStorage.getItem('notFirstTimeVisit') == "true") {
			return true;
		}
	},
	keyupSearch: function() {
		return Session.get('keyupSearch');
	}
});

Template.landingPage.events({
	'keyup #site-search-query1': function() {
		/*if ($('#site-search-query1').val() != '') {
			Meteor.call('suggestionsMethod', $('#site-search-query1').val(), function(err, result) {
				console.log(err);
				Suggestions.remove({});
				$('#suggestions1').empty();
				for (var i = 0; i < 5; i++) {
					if (!Suggestions.find({revTitleBit: result[i]['revTitleBit']}).count()) {
						$('#suggestions1').append("<option value='" + result[i]['revTitleBit'] + "'>");
						Suggestions.insert(result[i]);
					}
				}
			});
		}*/
	
		if ($('#site-search-query1').hasClass('ridge-border')) {
			$('#site-search-query1').removeClass('ridge-border')
		}
		if ($('#site-search-query2').val() == '') {
			$('.search-circle-submit').val(TAPi18n.__('landing_single_search_button'));
		} else {
			$('.search-circle-submit').val(TAPi18n.__('landing_comparison_search_button'));
		}
		
		if ($('#firstTimeSuggestionBox').length) {
			$('#firstTimeSuggestionBox').remove();
			$('#landing-arrow').remove();
			Session.set('keyupSearch', true);
		}
		/*
		if ($('#site-search-query1').val() == '' && $('#site-search-query2').val() == '') {
			$('.search-circle-submit').addClass('disabled');
		} else {
			$('.search-circle-submit').removeClass('disabled');			
		}
		*/
	},
	'keyup #site-search-query2': function() {
		/*if ($('#site-search-query2').val() != '') {
			Meteor.call('suggestionsMethod', $('#site-search-query2').val(), function(err, result) {
				console.log(err);
				Suggestions.remove({});
				$('#suggestions2').empty();
				for (var i = 0; i < 5; i++) {
					if (!Suggestions.find({revTitleBit: result[i]['revTitleBit']}).count()) {
						$('#suggestions2').append("<option value='" + result[i]['revTitleBit'] + "'>");
						Suggestions.insert(result[i]);
					}
				}
			});
		}*/
		
		if ($('#site-search-query1').val() == '') {
			$('.search-circle-submit').val(TAPi18n.__('landing_single_search_button'));
		} else {
			$('.search-circle-submit').val(TAPi18n.__('landing_comparison_search_button'));
		}
		
		if ($('#firstTimeSuggestionBox').length) {
			$('#firstTimeSuggestionBox').remove();
			$('#landing-arrow').remove();
			Session.set('keyupSearch', true);
		}
		/*
		if ($('#site-search-query1').val() == '' && $('#site-search-query2').val() == '') {
			$('.search-circle-submit').addClass('disabled');
		} else {
			$('.search-circle-submit').removeClass('disabled');			
		}
		*/
	},
	//add on backspace
	'submit #hp-site-search': function(e) {
		e.preventDefault();
		
		if ($('.search-circle-submit').hasClass('disabled')) {
			return;
		}
		
		let searchString1;
		let searchString2;
		let typeFilter = 'all';
		let range1 = $('#homePriceRange1').val();
		let range2 = $('#homePriceRange2').val();
		
		if (!$('#site-search-query1').val()) {
			searchString1 = 'null';
		} else {
			searchString1 = $('#site-search-query1').val();
		}
		
		if (!$('#site-search-query2').val()) {
			searchString2 = 'null';
		} else {
			searchString2 = $('#site-search-query2').val();
		}
		
		if ($('#site-search-query1').val() && $('#site-search-query2').val()) {
			typeFilter = 'comparison';
		}
		
		if (!range1.length) {
			range1 = '-1';
		}
		
		if (!range2.length) {
			range2 = '-1';
		}
				
		Router.go('searchLandingPage', {searchString1, searchString2, typeFilter, range1, range2});
	}
});
