Template.genericSearchTemplate.onRendered(function() {
	if (Router.current().params.range1 > 0) {
		$('#homePriceRange1').val(Router.current().params.range1);
	}
	
	if (Router.current().params.range2 > 0) {
		$('#homePriceRange2').val(Router.current().params.range2);
	}
});

Template.genericSearchTemplate.helpers({
	xs: function() {
		if ($(window).width() < 768) {
			return true;
		} else {
			return false;
		}	
	},
	isSearchPage: function() {
		if (Router.current().route.getName() == 'searchLandingPage') {
			return true;
		}
	}
});

Template.genericSearchTemplate.events({
	'keyup #generic-site-search-query1': function() {
		if ($('#generic-site-search-query2').val() == '') {
			$('.generic-search-submit').children().removeClass('glyphicon-duplicate');
			if (!$('.generic-search-submit').children().hasClass('glyphicon-search')) {
				$('.generic-search-submit').children().addClass('glyphicon-search');
			}
		} else {
			if ($('.generic-search-submit').children().hasClass('glyphicon-search')) {
				$('.generic-search-submit').children().removeClass('glyphicon-search');
			}
			$('.generic-search-submit').children().addClass('glyphicon-duplicate');
		}
	},
	'keyup #generic-site-search-query2': function() {
		if ($('#generic-site-search-query1').val() == '') {
			$('.generic-search-submit').children().removeClass('glyphicon-duplicate');
			if (!$('.generic-search-submit').children().hasClass('glyphicon-search')) {
				$('.generic-search-submit').children().addClass('glyphicon-search');
			}
		} else {
			if ($('.generic-search-submit').children().hasClass('glyphicon-search')) {
				$('.generic-search-submit').children().removeClass('glyphicon-search');
			}
			$('.generic-search-submit').children().addClass('glyphicon-duplicate');
		}
	},
	'click .generic-search, submit .generic-site-search-form': function(e) {
		e.preventDefault();
		
		let searchString1;
		let searchString2;
		let typeFilter = 'all';
		let range1;
		let range2;
	
		if (!$('#generic-site-search-query1').val()) {
			searchString1 = 'null';
		} else {
			searchString1 = $('#generic-site-search-query1').val();
		}
	
		if (!$('#generic-site-search-query2').val()) {
			searchString2 = 'null';
		} else {
			searchString2 = $('#generic-site-search-query2').val();
		}
	
		if ($('#generic-site-search-query1').val() && $('#generic-site-search-query2').val()) {
			typeFilter = 'comparison';
		}

		if ($('#homePriceRange1').length) {
			if ($('#homePriceRange1').val().length) {
				range1 = $('#homePriceRange1').val();
			} else {
				range1 = 0;
			}
			
			if ($('#homePriceRange2').val().length) {
				range2 = $('#homePriceRange2').val();
			} else {
				range2 = 10000;
			}
		}

		Router.go('searchLandingPage', {searchString1, searchString2, typeFilter, range1, range2});
	}
});

Template.genericSearchTemplate.onRendered(function(){
	Tracker.autorun(function() {
		if (Session.get('newSearchUrl')) {
			if (Router.current().params.searchString1 != 'null' && Router.current().params.searchString2 != 'null') {
				$('#generic-site-search-query1').val(Router.current().params.searchString1);
				$('#generic-site-search-query2').val(Router.current().params.searchString2);
			}
			else if (Router.current().params.searchString1 != 'null') {
				$('#generic-site-search-query1').val(Router.current().params.searchString1);
			} 
			else if (Router.current().params.searchString2 != 'null') {
				$('#generic-site-search-query2').val(Router.current().params.searchString2);
			}
		
			Session.set('newSearchUrl', false);
		}
	});
});
