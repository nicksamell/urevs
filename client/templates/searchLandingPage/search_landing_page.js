Template.searchLandingPage.onCreated(function() {
	if (Router.current().params.searchString1.length && Router.current().params.searchString2.length) {
		if (Router.current().params.searchString1 != 'null' && Router.current().params.searchString2 != 'null') 	{
			Session.set('isDisabled', true);
		}
	}
	
	Session.set('searchString1Helper', Router.current().params.searchString1);
	Session.set('searchString2Helper', Router.current().params.searchString2);
});

Template.searchLandingPage.helpers({	
	xs: function() {
		if ($(window).width() < 768) {
			return true;
		} else {
			return false;
		}	
	},
	fillInHelper: function() {
		if (Router.current().params.searchString1 != 'null') {
			$('#generic-site-search-query1').attr('placeholder', Router.current().params.searchString1);
		}
		
		if (Router.current().params.searchString2 != 'null') {
			$('#generic-site-search-query2').attr('placeholder', Router.current().params.searchString2);
		}
	},
	resultsPresent: function() {
		if (SearchIndex.find().fetch().length) {
			return true;
		}
	},
	categories: function() {
		return Categories.find();
	},
	category: function() {
		if (this.title === 'Computers, Tablets & Related') {
			switch (TAPi18n.getLanguage()) {
			 case 'en':
			 	return 'Computers & Related';
			 	break;
			 case 'pl':
			 	return 'Komputery i Akcesoria';
			 	break;
			}
		} else {
			return this.title;
		}
	},
	spellCheckSuggestions: function() {
		let language = TAPi18n.getLanguage();
		let searchString1 = Router.current().params.searchString1;
		let searchString2 = Router.current().params.searchString2;
		let range1 = parseInt(Router.current().params.range1, 10) || 0;
		let range2 = parseInt(Router.current().params.range2, 10) || 10000;
		
		spellCheckSuggestions = ReactiveMethod.call('spellCheckSuggestionsMethod', language, searchString1, searchString2, range1, range2);

		let spellCheckUseful;

		let typeFilter = Router.current().params.typeFilter;

		let vsPresent;
		
		for (let i = 0; i < spellCheckSuggestions.length; i++) {
			if (spellCheckSuggestions[i] == 'v') {
				if (spellCheckSuggestions[i - 1] == ' ' && spellCheckSuggestions[i + 1] == 's' && spellCheckSuggestions[i + 2] == ' ' ) {
					vsPresent = true;
				}
			}
		}
		
		if (vsPresent) {
			for (let i = 0; i < spellCheckSuggestions.length; i++) {
				if (spellCheckSuggestions[i] == 'v') {
					if (spellCheckSuggestions[i + 1] == 's') {
						searchString1 = spellCheckSuggestions.substring(0, i - 1);
						searchString2 = spellCheckSuggestions.substring(i + 3, spellCheckSuggestions.length);
						
						spellCheckUseful = ReactiveMethod.call('spellCheckNecessaryMethod', searchString1, searchString2, typeFilter, range1, range2, language);
					}
				}
			}
		} else if (searchString1 != 'null') {
			searchString1 = spellCheckSuggestions;
			searchString2 = 'null';

			spellCheckUseful = ReactiveMethod.call('spellCheckNecessaryMethod', searchString1, searchString2, typeFilter, range1, range2, language);
		} else if (searchString2 != 'null') {
			searchString1 = 'null';
			searchString2 = spellCheckSuggestions;
			
			spellCheckUseful = ReactiveMethod.call('spellCheckNecessaryMethod', searchString1, searchString2, typeFilter, range1, range2, language);
		}

		return spellCheckSuggestions;		
	},
	searchString1Helper: function() {
		if ($('#generic-site-search-query1').length) {
			return Session.get('searchString1Helper');
		} else {
			return Router.current().params.searchString1;
		}
	},
	searchString2Helper: function() {
		if ($('#generic-site-search-query2').length) {
			return Session.get('searchString2Helper');
		} else {
			return Router.current().params.searchString2;
		}
	},
	range1Helper: function() {
		return Router.current().params.range1;
	},
	range2Helper: function() {
		return Router.current().params.range2;
	},
	searchLimitHelper: function() {
		if (Router.current().params.searchLimit) {
			return Router.current().params.searchLimit;
		}
	},
	isSingle: function() {
		if (Router.current().params.typeFilter == 'single') {
			return 'active';
		}
	},
	isDouble: function() {
		if (Router.current().params.typeFilter == 'comparison') {
			return 'active';
		}
	},
	isAll: function() {
		if (Router.current().params.typeFilter == 'all') {
			return 'active';
		}
	},
	isSingleDouble: function() {
		if (Router.current().params.typeFilter == 'single' || Router.current().params.typeFilter == 'comparison') {
			return true;
		}
	},
	isDisabled: function() {
		if (Session.get('isDisabled')) {
			return 'disabled';
		} else {
			return '';
		}
	}
});

Template.searchResultItem.helpers({
	postsCount: function() {
		let array = SearchIndex.find().fetch();
		 
		for(let i = 0; i < array.length; i++) { 
			if(array[i]['_id'] === this._id) { 
				return 'search-item-' + (i+1);
			} 
		} 
	},
	revTitleDouble: function() {
		var title1 = this.revTitle1;
		var title2 = this.revTitle2;
		
		var fullTitle = title1 + ' vs ' + title2; 
		return fullTitle;
	}
});

Template.searchLandingPage.events({
	'keyup #generic-site-search-query1, keyup #generic-site-search-query2': function() {
		if ($('#generic-site-search-query2').val().length && $('#generic-site-search-query1').val().length) {
			Session.set('isDisabled', true);
		} else {
			Session.set('isDisabled', false);
		}
		
		Session.set('searchString1Helper', $('#generic-site-search-query1').val());
		Session.set('searchString2Helper', $('#generic-site-search-query2').val());
	},
	'click .filters-show': function() {
		if ($('.filters-show').find('span').hasClass('glyphicon-chevron-down')) {
			$('.filters-show').find('span').removeClass('glyphicon-chevron-down');
			$('.filters-show').find('span').addClass('glyphicon-chevron-up');
		} else if ($('.filters-show').find('span').hasClass('glyphicon-chevron-up')) {
			$('.filters-show').find('span').removeClass('glyphicon-chevron-up');
			$('.filters-show').find('span').addClass('glyphicon-chevron-down');
		}
	},
	'click #typeFilterTabs': function() {
		$('.filters-show').click();
	}, 
	'click #spellCheckRedirect': function(e) {
		e.preventDefault();

		let searchString1 = Router.current().params.searchString1;
		let searchString2 = Router.current().params.searchString2;
		let typeFilter = Router.current().params.typeFilter;
		let range1 = parseInt(Router.current().params.range1, 10) || 0;
		let range2 = parseInt(Router.current().params.range2, 10) || 10000;

		let vsPresent;
	
		for (let i = 0; i < spellCheckSuggestions.length; i++) {
			if (spellCheckSuggestions[i] == 'v') {
				if (spellCheckSuggestions[i - 1] == ' ' && spellCheckSuggestions[i + 1] == 's' && spellCheckSuggestions[i + 2] == ' ' ) {
					vsPresent = true;
				}
			}
		}

		if (vsPresent) {
			for (let i = 0; i < spellCheckSuggestions.length; i++) {
				if (spellCheckSuggestions[i] == 'v') {
					if (spellCheckSuggestions[i + 1] == 's') {
						searchString1 = spellCheckSuggestions.substring(0, i - 1);
						searchString2 = spellCheckSuggestions.substring(i + 3, spellCheckSuggestions.length);
						
						if (!searchString2.length) {
							searchString2 = 'null';
						}
						
						Router.go('searchLandingPage', {searchString1, searchString2, typeFilter, range1, range2});
					}
				}
			}
		} else if (searchString1 != 'null') {
			searchString1 = spellCheckSuggestions;

			Router.go('searchLandingPage', {searchString1, searchString2, typeFilter, range1, range2});
		} else if (searchString2 != 'null') {
			searchString2 = spellCheckSuggestions;
			
			Router.go('searchLandingPage', {searchString1, searchString2, typeFilter, range1, range2});
		}
	}
});

if ($(window).width() > 768) {
	$(window).scroll(function() {
		var number;
		var className;
	
		if (((150 + window.pageYOffset)/200) >= (parseInt((150 + window.pageYOffset)/200))) {
			number = parseInt((250 + window.pageYOffset)/200);
			className = '.search-item-';
			className += number;
		
			if ($(className).parent().attr("style") != "transform: scale(1.2,1.2); margin-bottom: 40px;") {
				$(className).parent().attr("style", "transform: scale(1.2,1.2); margin-bottom: 40px;");
				number -= 1;
				className = '.search-item-';
				className += number;
				$(className).parent().attr("style", "");
				number += 2;
				className = '.search-item-';
				className += number;
				$(className).parent().attr("style", "");
			}
		}
	});
}
