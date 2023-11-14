Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn: function() { 
		return Meteor.subscribe('categories');
	}
});

Router.route('/blog', { 
	name: 'blogPage',
	onAfterAction: function() {
		document.title = 'urevs blog';
  	}
});

Router.route('/myaccount', { 
	name: 'accountPage',
	onAfterAction: function() {
		document.title = 'my account';
  	}
});

Router.route('/newest/:newestPostsLimit?', {
	name: 'newestPage',
	onAfterAction: function() {
		document.title = 'newest reviews';
  	}
});

NewestPageController = RouteController.extend({
	template: 'newestPage',
	increment: 10,
	newestPostsLimit: function() {
		let newestPostsLimit = parseInt(this.params.newestPostsLimit, 10) || this.increment;
		
		if (newestPostsLimit < 1) {
			newestPostsLimit = 1;
		}
		
		return newestPostsLimit;
	},
	findOptions: function() {
		return this.newestPostsLimit();
	},
	subscriptions: function() {
		let currentLangLabel;
		
		if (TAPi18n.getLanguage()) {
			if (Meteor.isClient) {
				currentLangLabel = 'en';
			
				if (localStorage.getItem('urevsLanguagePreference')) {
					currentLangLabel = localStorage.getItem('urevsLanguagePreference');
				}
			}
		}
	
		this.newestSub = Meteor.subscribe('newestSubscription', this.findOptions(), currentLangLabel);
	},
	newestReviews: function() {
		return SearchIndex.find({}, {sort: {'submitted': -1}});
	},
	data: function() {
		let language;
		if (Meteor.isClient) {
			language = TAPi18n.getLanguage();
		}
	
		let hasMoreNewest = ReactiveMethod.call('hasMoreNewestMethod', language, this.findOptions());

		let sanitizedNewestPostsLimit;

		if (this.newestPostsLimit() - this.increment <= 0) {
			sanitizedNewestPostsLimit = 1;
		} else {
			sanitizedNewestPostsLimit = this.newestPostsLimit() - this.increment;
		};

		let nextNewestPath = this.route.path({newestPostsLimit: this.newestPostsLimit() + this.increment});
		let previousNewestPath = this.route.path({newestPostsLimit: sanitizedNewestPostsLimit});
		
		return {
			newestReviews: this.newestReviews(),
			hasMoreNewestHelper: hasMoreNewest,
			hasMoreNewestPath: hasMoreNewest ? nextNewestPath: previousNewestPath
		};
	}
});

Router.route('/trendingtoday/:trendingPostsLimit?', {
	name: 'trendingPage',
	onAfterAction: function() {
		document.title = 'trending reviews';
  	}
});

TrendingPageController = RouteController.extend({
	template: 'trendingPage',
	increment: 10,
	trendingPostsLimit: function() {
		let trendingPostsLimit = parseInt(this.params.trendingPostsLimit, 10) || this.increment;
		
		if (trendingPostsLimit < 1) {
			trendingPostsLimit = 1;
		}
		
		return trendingPostsLimit;
	},
	findOptions: function() {
		return this.trendingPostsLimit();
	},
	subscriptions: function() {
		let amendedOptions = this.findOptions()/5;
		let options = this.findOptions() - amendedOptions;

		let currentLangLabel;
		
		if (TAPi18n.getLanguage()) {
			if (Meteor.isClient) {
				currentLangLabel = 'en';
			
				if (localStorage.getItem('urevsLanguagePreference')) {
					currentLangLabel = localStorage.getItem('urevsLanguagePreference');
				}
			}
		}

		//for trending reviews
			this.trendingSub = Meteor.subscribe('trendingSubscription', options, currentLangLabel);
		//for bullhorn reviews
			this.trendingSub = Meteor.subscribe('trendingSubscriptionAmended', amendedOptions, currentLangLabel);
	},
	trendingReviews: function() {
		return SearchIndex.find({}, {sort: {'hornTime': -1, 'trendingCount': -1}});
	},
	data: function() {
		let language;
		if (Meteor.isClient) {
			language = TAPi18n.getLanguage();
		}
	
		let hasMoreTrending = ReactiveMethod.call('hasMoreTrendingMethod', language, this.findOptions());

		let sanitizedTrendingPostsLimit;

		if (this.trendingPostsLimit() - this.increment <= 0) {
			sanitizedTrendingPostsLimit = 1;
		} else {
			sanitizedTrendingPostsLimit = this.trendingPostsLimit() - this.increment;
		};

		let nextTrendingPath = this.route.path({trendingPostsLimit: this.trendingPostsLimit() + this.increment});
		let previousTrendingPath = this.route.path({trendingPostsLimit: sanitizedTrendingPostsLimit});

		return {
			trendingReviews: this.trendingReviews(),
			hasMoreTrendingHelper: hasMoreTrending,
			hasMoreTrendingPath: hasMoreTrending ? nextTrendingPath: previousTrendingPath
		};
	}
});

//Site-Wide Search Landing Page
Router.route('/search/:searchString1/:searchString2/:typeFilter/:range1/:range2/:searchLimit?', {
	name: 'searchLandingPage',
	onAfterAction: function() {
		if (Router.current().params.searchString1 != 'null' && Router.current().params.searchString2 != 'null') {
			document.title = 'search: ' + Router.current().params.searchString1 + ' vs ' + Router.current().params.searchString2;
		} else if (Router.current().params.searchString1 != 'null') {
			document.title = 'search: ' + Router.current().params.searchString1;
		} else {
			document.title = 'search: ' + Router.current().params.searchString2;
		}
  	}
});

SearchLandingPageController = RouteController.extend({
	template: 'searchLandingPage',
	increment: 5,
	searchLandingParams: function() {
		let searchLimit = parseInt(this.params.searchLimit, 10) || 10;

		let currentSearchString1 = this.params.searchString1;
		let currentSearchString2 = this.params.searchString2;
		let typeFilter = this.params.typeFilter;
		let range1 = parseInt(this.params.range1, 10) || 0;
		let range2 = parseInt(this.params.range2, 10) || 10000;
		
		if (range1 > 10000) {
			range1 = 10000;
		} else if (range1 < 0) {
			range1 = 0;
		}
		
		if (range2 > 10000) {
			range2 = 10000;
		} else if (range2 < 0) {
			range2 = 10000;
		}
	
		if (range1 > range2) {
			return throwError("Please enter your range from lowest to highest."); 
		}
		
		if (searchLimit < 1) {
			searchLimit = 1;
		}
				
		return { currentSearchString1, currentSearchString2, searchLimit, typeFilter, range1, range2 };
	},
	subscriptions: function() {
		Session.set('newSearchUrl', true);
		
		let currentLangLabel;
		if (Meteor.isClient) {
			currentLangLabel = TAPi18n.getLanguage();
		}
		
		this.reviewSLSub = Meteor.subscribe('searchLandingSubscription', this.searchLandingParams().currentSearchString1, this.searchLandingParams().currentSearchString2, this.searchLandingParams().typeFilter, this.searchLandingParams().range1, this.searchLandingParams().range2, this.searchLandingParams().searchLimit, currentLangLabel);
	},
	searchResults: function() {
		if (this.searchLandingParams().typeFilter == 'all') {
			return SearchIndex.find({}, {sort: {'single': -1, difference: 1}});
		} else if (this.searchLandingParams().typeFilter == 'single') {
			return SearchIndex.find({'single': true}, {sort: {'single': -1, 'likes1': -1}});
		} else if (this.searchLandingParams().typeFilter == 'comparison') {
			return SearchIndex.find({'single': false}, {sort: {'single': -1, difference: 1}});
		}
	},
	waitOn: function() {
		let currentLangLabel = TAPi18n.getLanguage();

		hasMoreSL = ReactiveMethod.call('hasMoreSearchMethod', this.searchLandingParams().currentSearchString1, this.searchLandingParams().currentSearchString2, this.searchLandingParams().typeFilter, this.searchLandingParams().range1, this.searchLandingParams().range2, this.searchLandingParams().searchLimit, currentLangLabel); 
	},
	data: function() {
		let nextSearchPath = this.route.path({searchString1: this.searchLandingParams().currentSearchString1, searchString2: this.searchLandingParams().currentSearchString2, typeFilter: this.searchLandingParams().typeFilter, range1: this.searchLandingParams().range1, range2: this.searchLandingParams().range2, searchLimit: this.searchLandingParams().searchLimit + this.increment});
		let previousSearchPath = this.route.path({searchString1: this.searchLandingParams().currentSearchString1, searchString2: this.searchLandingParams().currentSearchString2, typeFilter: this.searchLandingParams().typeFilter, range1: this.searchLandingParams().range1, range2: this.searchLandingParams().range2, searchLimit: this.searchLandingParams().searchLimit - this.increment});
		
		let hasMoreSearchPath = hasMoreSL ? nextSearchPath : previousSearchPath;
		
		return {
			searchResults: this.searchResults(),
			hasMoreSearchPath,
			hasMoreSL
		}
	}
});

//Review Pages per Category
Router.route('/:category/:_id/:commentsLimit?', { 
	name: 'reviewPage',
	onAfterAction: function() {
		let categorySEO = Router.current().params.category;
		let catURL;
		let revURL;
		 
		for (let i = 0; i < categorySEO.length; i++) {
			if (categorySEO[i] === 's') {
				if (categorySEO[i + 1] === 'r' && categorySEO[i + 2] === 'e' && categorySEO[i + 3] === 'v') {
					catURL = categorySEO.substring(0, i);
					revURL = categorySEO.substring(i + 1, categorySEO.length - 1);
					
					catURL = catURL.charAt(0).toUpperCase() + catURL.slice(1);
					revURL = revURL.charAt(0).toUpperCase() + revURL.slice(1);
				}
			}
		}
	
		document.title = catURL + ' ' + revURL;
  	}
});

ReviewPageController = RouteController.extend({
	template: 'reviewPage',
	increment: 3,
	reviewParams: function() {
		commentsLimit = parseInt(this.params.commentsLimit, 10) || 5;
		
		let currentCategory = this.params.category;
		let currentReviewId = this.params._id;
		
		if (commentsLimit < 1) {
			commentsLimit = 1;
		}
		
		return { currentCategory, currentReviewId, commentsLimit };
	},
	subscriptions: function() {
		this.reviewSub = Meteor.subscribe('reviewPage', this.reviewParams().currentCategory, this.reviewParams().currentReviewId, this.reviewParams().commentsLimit);
	},
	review: function() {
		return Mongo.Collection.get(this.reviewParams().currentCategory).find();
	},
	waitOn: function() {
		let collection = this.reviewParams().currentCategory;

		//eventually use imports and exports
		RSCount1 = ReactiveMethod.call('RSCountMethod1', collection, this.reviewParams().currentReviewId);
		RSCount2 = ReactiveMethod.call('RSCountMethod2', collection, this.reviewParams().currentReviewId);
		hasMoreLackRS = ReactiveMethod.call('hasMoreLackMethod', collection, this.reviewParams().currentReviewId, this.reviewParams().commentsLimit);
		RSCount3 = ReactiveMethod.call('hasMoreLackCount', collection, this.reviewParams().currentReviewId);
	},
	data: function() {
		nextReviewPath = this.route.path({category: this.reviewParams().currentCategory, _id: this.reviewParams().currentReviewId, commentsLimit: this.reviewParams().commentsLimit + this.increment});
		let previousCommentsLimit = this.reviewParams().commentsLimit - this.increment;
		if (previousCommentsLimit < 1) {
			previousCommentsLimit = 1;
		}
		previousReviewPath = this.route.path({category: this.reviewParams().currentCategory, _id: this.reviewParams().currentReviewId, commentsLimit: previousCommentsLimit});
		
		hasMoreLackReviewPath = hasMoreLackRS ? nextReviewPath : previousReviewPath;

		return {
			review: this.review()
		};
	}
});


//Home Page
Router.route('/', { 
	name: 'landingPage',
	onAfterAction: function() {
		document.title = 'urevs';
	}
});

Router.onStop(function() {
	if (localStorage.getItem('notFirstTimeVisitAnywhere') != "true") {
		localStorage.setItem('notFirstTimeVisitAnywhere', true);
	}

	if (localStorage.getItem('notFirstTimeVisitReviewPage') != "true" && Router.current().route.getName() == 'reviewPage') {
		localStorage.setItem('notFirstTimeVisitReviewPage', true);
	}
	
	if (localStorage.getItem('notFirstTimeVisitTrending') != "true" && Router.current().route.getName() == 'trendingPage') {
		localStorage.setItem('notFirstTimeVisitTrending', true);
	}
	
	if (localStorage.getItem('notFirstTimeVisit') != "true" && Router.current().route.getName() == 'landingPage') {
		localStorage.setItem('notFirstTimeVisit', true);
	}
});
