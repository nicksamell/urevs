/*$(window).scroll(function() {
	if ($(window).scrollTop() + $(window).height() == $(document).height()) {
		$('.navigator-ui').addClass('navigator-ui-bottom');
		$('.navigator-ui-bottom').removeClass('navigator-ui');
	}
	
	if ($(window).scrollTop() + $(window).height() < $(document).height()) {
		$('.navigator-ui-bottom').addClass('navigator-ui');
		$('.navigator-ui').removeClass('navigator-ui-bottom');
	}
});*/

Template.reviewPage.onCreated(function() {
	if (TAPi18n.getLanguage() == 'pl') {
		Session.set('review-navigator', 'Kliknij >');
	} else {
		Session.set('review-navigator', 'Click >');
	}
	Session.set('keyupId', '');
	Session.set('isNormalNavigator', true);
	Session.set('isCommentBoxSummoned', false);
	Session.set('searchBoxSummonedReview', false);
	Session.set('newComment', true);
	Session.set('editingCharCount', false);
	Session.set('creatingCharCount', false);
	Session.set('charCount', 1000);
	Session.set('modalVisible', false);
	if (Router.current().params.commentsLimit) {
		Session.set('hasMoreLessURL', parseInt(Router.current().params.commentsLimit, 10));	
	} else {
		Session.set('hasMoreLessURL', 5);
	}
	Meteor.setTimeout(function() {
		$(".shareit-facebook-colors").attr("style", "margin-bottom: 10px;");
		$(".shareit-twitter-colors").attr("style", "margin-bottom: 10px;");
		$(".shareit-pinterest-colors").attr("style", "margin-bottom: 10px;");
		$(".shareit-google-colors").attr("style", "margin-bottom: 10px;");
	}, 1000);
	
	var collection = Router.current().params.category;
	var reviewId = Router.current().params._id;
	
	Meteor.call('countViews', reviewId, function(error) {
		if (error) {
			if (TAPi18n.getLanguage() != 'en') {
				switch (error.message) {
				 case 'Please limit your review Id to 50 characters.':
				 	return throwError(TAPi18n.__('review_id_too_long'));
				 	break;
				 case 'Please keep your review Id to greater than 0 characters.':
				 	return throwError('review_page_keep_rev_id_more_than_0');
				 	break;
				}
			}
			
			return throwError(error);
		}
	});
});

Template.reviewPage.onRendered(function () {
	if (newReview) {
		newReview = false;
		location.reload();
	}
	
	Session.set('keyupCriteriaAdd', false);
	
//DiscoverMeteor Start
	this.find('.wrapper')._uihooks = {
		insertElement: function(node, next) {
			$(node)
				.hide()
				.insertBefore(next)
				.fadeIn();
		},
		removeElement: function(node) {
			$(node).fadeOut(function() {
				$(this).remove();
			});
		}
	}
	this.find('.wrapper1')._uihooks = {
		insertElement: function(node, next) {
			$(node)
				.hide()
				.insertBefore(next)
				.fadeIn();
		},
		removeElement: function(node) {
			$(node).fadeOut(function() {
				$(this).remove();
			});
		}
	}
	this.find('.wrapper2')._uihooks = {
		insertElement: function(node, next) {
			$(node)
				.hide()
				.insertBefore(next)
				.fadeIn();
		},
		removeElement: function(node) {
			$(node).fadeOut(function() {
				$(this).remove();
			});
		}
	}
	this.find('.wrapper3')._uihooks = {
		insertElement: function(node, next) {
			$(node)
				.hide()
				.insertBefore(next)
				.fadeIn();
		},
		removeElement: function(node) {
			$(node).fadeOut(function() {
				$(this).remove();
			});
		}
	}
	this.find('.wrapper4')._uihooks = {
		insertElement: function(node, next) {
			$(node)
				.hide()
				.insertBefore(next)
				.fadeIn();
		},
		removeElement: function(node) {
			$(node).fadeOut(function() {
				$(this).remove();
			});
		}
	}
	//DiscoverMeteor End
});

Template.reviewPage.helpers({
	noReview: function() {
		let collection = Router.current().params.category;
		let reviewId = Router.current().params._id;
		
		return ReactiveMethod.call('noReview', collection, reviewId);
	},
	
	shareData: function() {
		let title; 
		let description;
		let image = '/urevs_logo.png';
		
		if (Mongo.Collection.get(Router.current().params.category).find({_id: Router.current().params._id}).fetch()[0]['single']) {
			title = Mongo.Collection.get(Router.current().params.category).find({_id: Router.current().params._id}).fetch()[0]['productName1'];
			description = TAPi18n.__('review_help_out_single_1') + title + TAPi18n.__('review_help_out_single_2');
		} else {
			title = Mongo.Collection.get(Router.current().params.category).find({_id: Router.current().params._id}).fetch()[0]['productName1'] + ' vs ' + Mongo.Collection.get(Router.current().params.category).find({_id: Router.current().params._id}).fetch()[0]['productName2'];
			description = TAPi18n.__('review_help_out_double_1') + title + TAPi18n.__('review_help_out_double_2');
		}
		return {
			title: title,
			description: description,
			thumbnail: image
		};
	},
	
	picUrl1: function() {
		return this.picUrl1;
	},
	
	picUrl2: function() {
		return this.picUrl2;
	},
	
	picSourcesDouble: function() {
		if (this.picSource1 || this.picSource2) {
			return true;
		}
	},
	
	notFirstVisitReviewPage: function() {
		if (localStorage.getItem('notFirstTimeVisitReviewPage') != 'true') {
			return false;
		} else {
			return true;
		}
	},
	
	productName2ImgMD: function() {
		if ($(window).width() > 768) {
			return 'productName2-img';
		}
	},
	
	xs: function() {
		if ($(window).width() < 768) {
			return true;
		} else {
			return false;
		}		
	},
	
	currentCommentNumber: function() {
		if (Session.get('review-navigator') == 'Click >') {
			return Session.get('review-navigator');
		}
		
		return parseInt(Session.get('review-navigator'), 10);
	},
	
	isNormalNavigator: function() {
		return Session.get('isNormalNavigator');
	},
	
	cSSSetting: function() {
		if (Meteor.user().profile.cSSSetting === 'left' || Meteor.user().profile.cSSSetting == undefined) {
			return true;
		}
	},
	
	cSSSettingBoth: function() {
		if (Meteor.user().profile.cSSSetting === 'both') {
			return true;
		}
	},
	
	hasMoreReviewHelper: function() {
		if (Session.get('hasMoreURLBoolean') || Session.get('hasMoreURLBoolean') === false) {
			return Session.get('hasMoreURLBoolean');
		} else {
			let commentsLimit;
			if (Router.current().params.commentsLimit) {
				commentsLimit = parseInt(Router.current().params.commentsLimit, 10);
			} else {
				commentsLimit = 5;
			}
			
			if ($(window).width() < 768) {
				if (RSCount1 > commentsLimit) { 
					return true;
				} else {
					return false;
				}
			} else {
				if (RSCount1 > commentsLimit) { 
					return true;
				} else {
					return false;
				}
			}
		}
	},
	
	hasMoreLackReviewHelper: function() {
		let commentsLimit;
		if (Router.current().params.commentsLimit) {
			commentsLimit = parseInt(Router.current().params.commentsLimit, 10);
		} else {
			commentsLimit = 5;
		}
		
		if (RSCount3 > commentsLimit) { 
			return true;
		} else {
			return false;
		}
	},
	
	hasMoreReviewPath: function() {
		let commentsLimit;
		let collection = Router.current().params.category;
		let reviewId = Router.current().params._id;
		let url;
		
		commentsLimit = Session.get('hasMoreLessURL');

		url = '/' + collection + '/' + reviewId + '/' + commentsLimit;
	
		return url;
	},
	
	hasMoreLackReviewPath: function() {
		let commentsLimit;
		let collection = Router.current().params.category;
		let reviewId = Router.current().params._id;
		let url;
		
		commentsLimit = Session.get('hasMoreLessLackURL');

		url = '/' + collection + '/' + reviewId + '/' + commentsLimit;
	
		return url;
	},
	
	nextSnippetAmount: function() {
		return Session.get('hasMoreLessURL');
	},
	
	isHighlightedBullHorn: function() {
		let collection = Router.current().params.category;
		let reviewId = Router.current().params._id;

		if (ReactiveMethod.call('isHighlightedBullHorn', collection, reviewId, Meteor.user()._id) == 'active') {
			$('.review-bullhorn').addClass('active');
		}
		//userId only sent in to force reactivity. not utilized anywhere in code
	},
	
	isInTrending: function() {
		let currentLangLabel = TAPi18n.getLanguage();
		let reviewId = Router.current().params._id;
	
		return ReactiveMethod.call('isInTrending', currentLangLabel, reviewId);
	},
	
	isHighlightedLike: function() {
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var single = this.single;
		
		if (ReactiveMethod.call('isHighlightedLike', collection, reviewId, single, Meteor.user()._id) == 'likes1') {
			$('.btn.likes1').addClass('active');
		} else if (ReactiveMethod.call('isHighlightedLike', collection, reviewId, single, Meteor.user()._id) == 'likes2') {
			$('.btn.likes2').addClass('active');
		}
		//userId only sent in to force reactivity. not utilized anywhere in code
	},	
	
	comments: function() {
		var collection = Router.current().params.category;
		collection += 'comments';
		
		return Mongo.Collection.get(collection).find({_id: Router.current().params._id}).fetch();
	},
	
	likePlacement: function() {
		var userObject = Meteor.users.find({_id: Meteor.userId()}).fetch();
		
		if (!userObject.length) {
			return true;
		}
		
		if (userObject[0]['profile']['likeSettings'] == 'top') {
			return false;
		} else {
			return true;
			//otherwise, set to top as default or because user prefers so
		}
	},
	
	isSearchBoxBottom: function() {
		var userObject = Meteor.users.find({_id: Meteor.userId()}).fetch();

		if (userObject[0]['profile']['reviewSearchBoxPref'] === 'top') {
			return true;
		} else {
			return false;
			//otherwise, set to bottom as default or because user prefers so
		} 
	},
	
	isCommentBoxSummoned: function() {
		return Session.get('isCommentBoxSummoned');
	},
	
	searchBoxSummoned: function() {
		return Session.get('searchBoxSummonedReview');
	},
	
	singleCommentColor: function() {
		if (Session.get('newComment')) {
			Meteor.setTimeout(function() {
				$('.comment').addClass('singleComment');
			}, 100);
		}
	},
	
	review_page_share_sub_header1: function() {
		if (!Session.get('bullHornLeftCount')) {
			let collection = Router.current().params.category;
			let reviewId = Router.current().params._id;
	
			return ReactiveMethod.call('bullHornLeftCount', collection, reviewId);
		} else {
			return Session.get('bullHornLeftCount');
		}
	},
	
	isHighlightedLeftCompBtn: function() {
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var criteriaId = this._id;
		
		if (ReactiveMethod.call('whichHighlightedCompBtn', collection, reviewId, criteriaId, Meteor.user()._id) === true) {
			return 'active';
		}
		//userId only sent in to force reactivity. not utilized anywhere in code
	},
	
	isHighlightedRightCompBtn: function() {
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var criteriaId = this._id;
		
		if (ReactiveMethod.call('whichHighlightedCompBtn', collection, reviewId, criteriaId, Meteor.user()._id) === false) {
			return 'active';
		}
		//userId only sent in to force reactivity. not utilized anywhere in code
	},
	
	compCriteriaPercent1: function() {
	  let percent = ((this.compCriteriaVotes1/(this.compCriteriaVotes1 + this.compCriteriaVotes2)) * 100);
	  if (!percent) {
			percent = 0;
		} else {
			percent = percent.toFixed(0);
		}
		
		return percent;
	},
	
	compCriteriaPercent2: function() {
		let percent = ((this.compCriteriaVotes2/(this.compCriteriaVotes1 + this.compCriteriaVotes2)) * 100);
		if (!percent) {
			percent = 0;
		} else {
			percent = percent.toFixed(0);
		}
		
		return percent;
	},
	
	totalVotes: function() {
		return (this.compCriteriaVotes1 + this.compCriteriaVotes2);
	},
	
	keyupCriteriaAdd: function() {
		return Session.get('keyupCriteriaAdd');
	},
	
	desCharCount: function() {
		return Session.get('desCharCount');
	},
	
	isHighlightedSuggestionVoteBtn: function() {
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var suggestionId = this._id;
		
		if (ReactiveMethod.call('isHighlightedSuggestionVoteBtn', collection, reviewId, suggestionId, Meteor.user()._id)) {
			return 'active';
		}
		//userId only sent in to force reactivity. not utilized anywhere in code
	},
	
	criteriaSuggestionUpvotesAmount: function() {
		if (this.upvotes == 1) {
			return '1 vote';
		} else {
			return this.upvotes + ' votes';
		}
	},
	
	maxSugReached: function() {
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		
		return ReactiveMethod.call('isMaxSugReached', collection, reviewId);
	},
	
	singleLikesTitle: function() {
		return TAPi18n.__('review_which_product');
	},
	
	rating: function() {
		var rating = (this.compCriteriaRatingSum)/(this.compCriteriaRatesTotal * 5)
		
		if (this.compCriteriaRatesTotal == 0) {
			rating = 0;
		}
		
		rating = rating * 5;
		
		return rating;
	},
	
	totalRates: function() {
		return this.compCriteriaRatesTotal;
	},
	
	lastRating: function() {
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var criteriaId = this._id;
	
		return ReactiveMethod.call('lastRating', collection, reviewId, criteriaId, Meteor.user()._id);
	},
	
	possibleNotTruePrice: function() {
		if (Mongo.Collection.get(Router.current().params.category).find().fetch()[0]['product1Price'] == 0 || Mongo.Collection.get(Router.current().params.category).find().fetch()[0]['product2Price'] == 0) {
			return true;
		}
	}
});

Template.reviewCommentItem.helpers({
	commentsCount1: function() {
		let array = Mongo.Collection.get(Router.current().params.category + 'comments').find().fetch()[0]['comments1'];
		 
		for(let i = 0; i < array.length; i++) { 
			if(array[i]['_id'] === this._id) { 
				return i + 1;
			} 
		} 
		
		return -1; 
	},
	
	showTutSnippet: function() {
		let array = Mongo.Collection.get(Router.current().params.category + 'comments').find().fetch()[0]['comments1'];
		 
		for(let i = 0; i < array.length; i++) { 
			if(array[i]['_id'] === this._id) { 
				if ((i + 1) == 1) {
					return true;
				}
			} 
		}
	},
	
	commentsCount2: function() {
		let array = Mongo.Collection.get(Router.current().params.category + 'comments').find().fetch()[0]['comments2'];
		
		for(let i = 0; i < array.length; i++) { 
			if(array[i]['_id'] === this._id) { 
				return i + 1;
			} 
		} 
		return -1;
	},
	
	whichComment: function() {
		if (this.commentsGroup == 'comments1') {
			return true;
		} else {
			return false;
		}
	},
	
	commentId: function() {
		return this._id;
	},
	
	notFirstVisitSnippetReviewPage: function() {
		if (localStorage.getItem('notFirstTimeVisitReviewPage') != 'true') {
			return false;
		} else {
			return true;
		}
	},
	
	editingCharCount: function() {
		return Session.get('editingCharCount');
	},
	
	charCount: function() {
		return Session.get('charCount');
	},
	
	bigComment: function() {		
		if (this.comment.length > 500) {
			return true;
		}
	},
	
	filteredComment: function() {
		if (this.comment.length > 500) {
			return this.comment.substring(0, 500);
		}
	},
	
	isHighlightedUpVote: function() {
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var commentId = this._id;
		var commentsGroup = $(this)[0]['commentsGroup'];
		
		return ReactiveMethod.call('isHighlightedUpVote', collection, reviewId, commentsGroup, commentId, Meteor.user()._id);
		//userId only sent in to force reactivity. not utilized anywhere in code
	},	
	
	isHighlightedDownVote: function() {
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var commentId = this._id;
		var commentsGroup = $(this)[0]['commentsGroup'];
		
		return ReactiveMethod.call('isHighlightedDownVote', collection, reviewId, commentsGroup, commentId, Meteor.user()._id);
		//userId only sent in to force reactivity. not utilized anywhere in code
	},
	
	reviewSnippetTranslationF: function() {
		switch (TAPi18n.getLanguage()) {
			case 'en':
				return 'Is this snippet inaccurate/misleading?';
				break;
			case 'pl':
				return 'Czy jest ten wycinek niedokładny/omylny?';
				break;
		}
	},
	
	reviewSnippetTranslationA: function() {
		switch (TAPi18n.getLanguage()) {
			case 'en':
				return 'Is this snippet accurate?';
				break;
			case 'pl':
				return 'Czy jest ten wycinek dokładny?';
				break;
		}
	},
	
	author: function() {
		var commentsGroup = this.commentsGroup;
		var collection = Router.current().params.category;
		var commentId = this._id;
		var reviewId = Router.current().params._id;
		
		return ReactiveMethod.call('getAuthorName', commentId, commentsGroup, collection, reviewId);
	},
	
	owner: function() {
		var commentsGroup = this.commentsGroup;
		var collection = Router.current().params.category;
		var commentId = this._id;
		var reviewId = Router.current().params._id;

		return ReactiveMethod.call('checkOwner', commentId, commentsGroup, collection, reviewId, Meteor.user()._id);
		//userId only sent in to force reactivity. not utilized anywhere in code
	},
	
	isYoutubeLink: function() {
		return ReactiveMethod.call('isYoutubeLinkMethod');
	},
	
	youtubeLink: function() {
		return ReactiveMethod.call('getYoutubeLink');
	},
	
	proPicHelper: function () {
		let collection = Router.current().params.category;
		let reviewId = Router.current().params._id;
		let commentId = this._id;
		let commentsGroup = this.commentsGroup;
		
		let userProPic = ReactiveMethod.call('commentProPic', collection, reviewId, commentId, commentsGroup);
		
		if (userProPic.includes('facebookId - ')) {
			var fbID = userProPic.substring(13, userProPic.length);
	
			HTTP.call('GET', 'https://graph.facebook.com/' + fbID + '/picture/?redirect=0&type=large', function (err, res) { 
				if (res) {
					Session.set('proPic' + commentId, res.data.data.url);
				}
			});
		} else {
			Session.set('proPic' + commentId, userProPic);
		}
	},
	
	proPic: function() {
		return Session.get('proPic' + this._id);
	},
	
	onRightSnippet: function() {
		if (Session.get('keyupId') == this._id) {
			return true;
		}
	}
});

Template.reviewCommentItemLack.helpers({
	commentsCount3: function() {
		let array = Mongo.Collection.get(Router.current().params.category + 'comments').find().fetch()[0]['commentsLack'];
		 
		for(let i = 0; i < array.length; i++) { 
			if(array[i]['_id'] === this._id) { 
				return i + 1;
			} 
		} 
		return -1;
	},
	
	editingCharCount: function() {
		return Session.get('editingCharCount');
	},
	
	charCount: function() {
		return Session.get('charCount');
	},
	
	bigComment: function() {		
		if (this.comment.length > 500) {
			return true;
		}
	},
	
	filteredComment: function() {
		if (this.comment.length > 500) {
			return this.comment.substring(0, 500);
		}
	},

	owner: function() {
		var commentsGroup = this.commentsGroup;
		var collection = Router.current().params.category;
		var commentId = this._id;
		var reviewId = Router.current().params._id;

		return ReactiveMethod.call('checkOwner', commentId, commentsGroup, collection, reviewId, Meteor.user()._id);
	},
	
	isHighlightedUpVote: function() {
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var commentId = this._id;
		var commentsGroup = $(this)[0]['commentsGroup'];
		
		return ReactiveMethod.call('isHighlightedUpVote', collection, reviewId, commentsGroup, commentId);
	},
	
	isHighlightedDownVote: function() {
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var commentId = this._id;
		var commentsGroup = $(this)[0]['commentsGroup'];
		
		return ReactiveMethod.call('isHighlightedDownVote', collection, reviewId, commentsGroup, commentId);
	},

	reviewSnippetTranslationF: function() {
		switch (TAPi18n.getLanguage()) {
			case 'en':
				return 'Is this snippet inaccurate/misleading?';
				break;
			case 'pl':
				return 'Czy jest ten wycinek niedokładny/omylny?';
				break;
		}
	},
	
	reviewSnippetTranslationA: function() {
		switch (TAPi18n.getLanguage()) {
			case 'en':
				return 'Is this snippet accurate?';
				break;
			case 'pl':
				return 'Czy jest ten wycinek dokładny?';
				break;
		}
	},
	
	author: function() {
		var commentsGroup = this.commentsGroup;
		var collection = Router.current().params.category;
		var commentId = this._id;
		var reviewId = Router.current().params._id;
		
		return ReactiveMethod.call('getAuthorName', commentId, commentsGroup, collection, reviewId);
	},
	
	isYoutubeLink: function() {
		return ReactiveMethod.call('isYoutubeLinkMethod');
	},
	
	youtubeLink: function() {
		return ReactiveMethod.call('getYoutubeLink');
	},
	
	proPicHelper: function () {
		let collection = Router.current().params.category;
		let reviewId = Router.current().params._id;
		let commentId = this._id;
		let commentsGroup = this.commentsGroup;
		
		let userProPic = ReactiveMethod.call('commentProPic', collection, reviewId, commentId, commentsGroup);
		
		if (userProPic.includes('facebookId - ')) {
			var fbID = userProPic.substring(13, userProPic.length);
	
			HTTP.call('GET', 'https://graph.facebook.com/' + fbID + '/picture/?redirect=0&type=large', function (err, res) { 
				if (res) {
					Session.set('proPic' + commentId, res.data.data.url);
				}
			});
		} else {
			Session.set('proPic' + commentId, userProPic);
		}
	},
	
	proPic: function() {
		return Session.get('proPic' + this._id);
	}
});

Template.reviewCommentSubmitBoxS.helpers({
	isCommentBoxSummoned: function() {
		return Session.get('isCommentBoxSummoned');
	},
	
	creatingCharCount: function() {
		return Session.get('creatingCharCount');
	},
	
	charCount: function() {
		return Session.get('charCount');
	}
});

Template.reviewCommentSubmitBoxXs.helpers({
	isCommentBoxSummoned: function() {
		return Session.get('isCommentBoxSummoned');
	},
	
	creatingCharCount: function() {
		return Session.get('creatingCharCount');
	},
	
	charCount: function() {
		return Session.get('charCount');
	}
});

Template.reviewPage.events({
	'click .likes-button': function(e) {
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var single = this.single;
		var likes;
	
		if ($(e.target).hasClass('likes1')) {
			likes = 'likes1';
		} else if ($(e.target).hasClass('likes2')) {
			likes = 'likes2';
		}
	
		var checkLBActivation = function () {
			if (likes == 'likes1') {
				if ($('.btn.likes1').hasClass('active')) {
					$('.btn.likes1').removeClass('active');
				} else {
					$('.btn.likes1').addClass('active');
				}
			} else if (likes == 'likes2') {
				if ($('.btn.likes2').hasClass('active')) {
					$('.btn.likes2').removeClass('active');
				} else {
					$('.btn.likes2').addClass('active');
				}
			}
		};
	
		checkLBActivation();
	
		Meteor.call('revLike', collection, reviewId, single, likes, function(error, liked) {
			if (error) {
				checkLBActivation();
			
				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
					 case 'Sorry! You have to be logged in to indicate recommendations on reviews.':
					 	return throwError(TAPi18n.__('log_in_to_recommend'));
					 	break;
					 case "Please limit your review Id to 50 characters.":
					 	return throwError(TAPi18n.__('review_id_too_long'));
					 	break;
					 case "If you wish to change your recommendation, click on your original choice's recommend button to cancel that vote and then vote for your new choice.":
					 	return throwError(TAPi18n.__('already_recommended_text'));
					 	break;
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;
					}
				}
			
				return throwError(error);
			}
		
			if (liked) {
				if (Meteor.user().profile.showShareRecSettings || Meteor.user().profile.showShareRecSettings == undefined) {
					$('#likeDialog').modal('show');
				}
				throwSuccess(TAPi18n.__('recommend_success'));
			} else {
				throwSuccess(TAPi18n.__('recommend_cancelled'));
			}
		});
	},
	
	'click .compCritBtn': function(e) {
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var criteriaId = this._id;
		var criteria1Boolean;
		
		if ($(e.target).hasClass('compCrit1')) {
			criteria1Boolean = true;
		} else if ($(e.target).hasClass('compCrit2')) {
			criteria1Boolean = false;
		}
		
		var checkAUActivation = function() {
			if ($(e.target).is('button')) {
				if ($(e.target).hasClass('active')) {
					$(e.target).removeClass('active');
				} else {
					$(e.target).addClass('active');
				}
			} else {
				if ($(e.target).parent().hasClass('active')) {
					$(e.target).parent().removeClass('active');
				} else {
					$(e.target).parent().addClass('active');
				}
			}
		};
		
		checkAUActivation();
		
		Meteor.call('criteriaVote', collection, reviewId, criteriaId, criteria1Boolean, function(error) {
			if (error) {
				checkAUActivation();
				
				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
					 case 'Sorry! You have to be logged in to vote on products.':
					 	return throwError(TAPi18n.__('log_in_to_grade'));
					 	break;
					 case "Please limit your review Id to 50 characters.":
					 	return throwError('review_id_too_long');
					 case "Please limit the criteria id to 50 characters.":
					 	return throwError('review_crit_id_too_long');
					 case "Please keep your review Id to greater than 0 characters.":
					 	return throwError('review_page_keep_rev_id_more_than_0');
					 case "Please keep your criteria Id to greater than 0 characters.":
					 	return throwError('review_page_keep_crit_id_more_than_0');
					 case "If you wish to change your vote, click on your original choice's vote button to cancel that vote and then select your new choice.":
					 	return throwError(TAPi18n.__('already_graded_text'));
					 	break;
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;
					}
				}
				
				return throwError(error);
			}
		});
	},
	
	'click .rateCritBtn': function(e) {
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var criteriaId = $(e.target).parents('.compCriteriaUnit').attr('id');
			
			var indexNo = $(e.target).parents('.compCriteriaUnit').index() + 1;
			var idOfTarget = '#stars_' + indexNo;
		
		var userRating = $(idOfTarget).data('userrating');

		Meteor.call('criteriaRate', collection, reviewId, criteriaId, userRating, function(error, result) {
			if (error) {
				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
					 case 'Sorry! You have to be logged in to vote on products.':
					 	return throwError(TAPi18n.__('log_in_to_grade'));
					 	break;
					 case "Please limit your review Id to 50 characters.":
					 	return throwError('review_id_too_long');
					 	break;
					 case "Please limit the criteria id to 50 characters.":
					 	return throwError('review_crit_id_too_long');
					 	break;
					 case "If you wish to change your vote, click on your original choice's vote button to cancel that vote and then select your new choice.":
					 	return throwError(TAPi18n.__('already_graded_text'));
					 	break;
					 case 'Sorry, no negative ratings allowed.':
					 	return throwError(TAPi18n.__('review_no_neg_ratings'));
					 	break;
					 case 'Sorry, highest rating allowed is 5.':
					 	return throwError(TAPi18n.__('review_highest_allowed'));
					 	break;
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;
					}
				}
				
				return throwError(error);
			}
			
			if (result == 'annulment') {
				throwSuccess(TAPi18n.__('review_rate_cancelled'));
				$(e.target).parents('.compCriteriaUnit').children('.lastRating').html('');
			} else {
				throwSuccess(TAPi18n.__('review_rate_success'));
				$(e.target).parents('.compCriteriaUnit').children('.lastRating').html('Your last rating: ' + userRating);
			}
		});
	},
	
	'click #more-criteria-suggestions': function(e) {
		e.preventDefault();
		
		$('#criteriaSuggestionsModal').modal('show');
	},
	
	'submit .new-criteria-form': function(e) {
		e.preventDefault();
		
		if ($(e.target).children('#newCriteriaInput').is(":focus")) {
			$('#newCriteriaDescription').focus();
			return;
		}
		
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var newCriteria = $(e.target).children('#newCriteriaInput').val();
		var newCriteriaDescription = $(e.target).children('#newCriteriaDescription').val();
		
		Meteor.call('newCriteriaSubmit', collection, reviewId, newCriteria, newCriteriaDescription, function(error) {
			if (error) {
				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
					 case 'Sorry! You have to be logged in to suggest a new criteria.':
					 	return throwError(TAPi18n.__('log_in_to_suggest_criteria'));
					 	break;
					 case 'Sorry! Maximum number of criteria suggestions has been reached.':
					 	return throwError(TAPi18n.__('max_crit_sug_reached'));
					 	break;
					 case 'Please limit your review Id to 50 characters.':
					 	return throwError(TAPi18n.__('review_id_too_long'));
					 	break;
					 case 'Please limit your criteria suggestion to 50 characters.':
					 	return throwError(TAPi18n.__('limit_crit_sug'));
					 	break;
					 case "Sorry - your suggestion couldn't be saved because no criteria text was received. Please submit a criteria suggestion with full content.":
					 	return throwError(TAPi18n.__('no_content_crit_sug'));
					 	break;
					 case 'Please limit your criteria description to 300 characters.':
					 	return throwError(TAPi18n.__('limit_crit_sug_desc'));
					 	break;
					 case "Sorry - your suggestion couldn't be saved because no description text was received. Please submit a criteria suggestion with a description.":
					 	return throwError(TAPi18n.__('no_content_crit_sug'));
					 	break;
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;
					}
				}
				
				return throwError(error);
			}
			
			$(e.target).children('input[type=text]').val('');
			$('#criteriaSuggestionsModal').modal('show');
		});
	},
	
	'click .criteria-suggestion-vote': function(e) {
	
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var criteriaSuggestionId = this._id;
		var single = Mongo.Collection.get(collection).find().fetch()[0]['single'];
		
		var checkAUActivation = function() {
			if ($(e.target).hasClass('active')) {
				$(e.target).removeClass('active');
			} else {
				$(e.target).addClass('active');
			}
		};
		
		checkAUActivation();
		
		Meteor.call('criteriaSuggestionVote', collection, reviewId, criteriaSuggestionId, single, function(error, result) {
			if (error) {
				checkAUActivation();
				
				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
					 case 'Sorry! You have to be logged in to vote on criteria suggestions.':
					 	return throwError(TAPi18n.__('log_in_to_vote_crit_sug'));
					 	break;
					 case 'Please limit your review Id to 50 characters.':
					 	return throwError(TAPi18n.__('review_crit_id_too_long'));
					 	break;
					 case "Please limit the criteria suggestion id to 50 characters.":
					 	return throwError(TAPi18n.__('review_crit_sug_id_too_long'));
					 	break;
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;
					}
				}
				
				return throwError(error);
			}
			
			switch (result) {
				case true:
					return throwSuccess(TAPi18n.__('success_vote_counted'));
				 	break;
		 		case false:
				 	return throwSuccess(TAPi18n.__('success_suggestion_vote_cancelled'));
				 	break;
		 		case 'upgraded!':
					$('#criteriaSuggestionsModal').modal('toggle');
					$('#congratsUpgradedCriteria').modal('show');
					break;
			}
		});
	},
	
	'submit .new-price-form': function(e) {
		e.preventDefault();
		
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var newPriceandLocation = $(e.target).children('#newPriceandLocInput').val();
		
		Meteor.call('newPriceSubmit', collection, reviewId, newPriceandLocation, function(error) {
			if (error) {
				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
					 case 'Sorry! You have to be logged in to submit new price proposals.':
					 	return throwError(TAPi18n.__('review_log_in_price_proposal'));
					 	break;
					 case 'Please limit your review Id to 50 characters.':
					 	return throwError(TAPi18n.__('review_id_too_long'));
					 	break;
					 case 'Please keep your review Id to greater than 0 characters.':
					 	return throwError('review_page_keep_rev_id_more_than_0');
					 	break;
					 case 'Please limit your price proposal to 1100 characters.':
					 	return throwError('review_price_proposal_to_1100');
					 	break;
					 case 'Please keep your price proposal to greater than 0 characters.':
					 	return throwError('review_price_proposal_more_0');
					 	break;
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;
					}
				}
				
				return throwError(error);
			}
			
			$(e.target).children('input[type=text]').val('');
			throwSuccess(TAPi18n.__('success_price_proposal'));
		});
	},
	
	'click .show-more': function(e) {
		e.preventDefault();
		
		var etargetParent = $(e.target).parent('.commentText');
		
		etargetParent.html(this.comment);
		etargetParent.append("<a class='show-less'>" + TAPi18n.__('review_page_show_less') + "</a>");
		$(e.target).detach();
	},
	
	'click .show-less': function(e) {
		e.preventDefault();
		
		var etargetParent = $(e.target).parent('.commentText');
		
		var shorterComment = this.comment.substring(0, 500);

		etargetParent.html(shorterComment);
		etargetParent.append("<a class='show-more'>" + TAPi18n.__('review_page_show_more') + "</a>");
		$(e.target).detach();
	},
	
	'click #likeInfoBox2TOP': function(e) {
		if ($(e.target).hasClass('click-thanks')) {
			$('#likeInfoBox2TOP').detach();
		}
	},
	
	'click #likeInfoBoxTOP': function(e) {
		if ($(e.target).hasClass('click-thanks')) {
			$('#likeInfoBoxTOP').detach();
		}
	},
	
	'click #bhInfoBox': function(e) {
		if ($(e.target).hasClass('click-thanks')) {
			$('#bhInfoBox').detach();
		}
	},
	
	'click #bhInfoBox2': function(e) {
		if ($(e.target).hasClass('click-thanks')) {
			$('#bhInfoBox2').detach();
		}
	},
	
	'click #dQuickVoteInfoBox': function(e) {
		if ($(e.target).hasClass('click-thanks')) {
			$('#dQuickVoteInfoBox').detach();
		}
	},
	
	'click #critDescInfoBox': function(e) {
		if ($(e.target).hasClass('click-thanks')) {
			$('#critDescInfoBox').detach();
		}
	},
	
	'click #inDepthAreaInfoBox': function(e) {
		if ($(e.target).hasClass('click-thanks')) {
			$('#inDepthAreaInfoBox').detach();
		}
	},
	
	'click #bothLackInfoBox': function(e) {
		if ($(e.target).hasClass('click-thanks')) {
			$('#bothLackInfoBox').detach();
		}
	},
	
	'click #sQuickVoteInfoBox': function(e) {
		if ($(e.target).hasClass('click-thanks')) {
			$('#sQuickVoteInfoBox').detach();
		}
	},
	
	'click #likeInfoBox': function(e) {
		if ($(e.target).hasClass('click-thanks')) {
			$('#likeInfoBox').detach();
		}
	},
	
	'click #likeInfoBox2': function(e) {
		if ($(e.target).hasClass('click-thanks')) {
			$('#likeInfoBox2').detach();
		}
	},
	
	'click #aPlusInfoBox': function(e) {
		if ($(e.target).hasClass('click-thanks')) {
			$('#aPlusInfoBox').detach();
		}
	},

	'click .has-more-review-path': function() {
		let actualCommentsLimit;
		if (Router.current().params.commentsLimit) {
			actualCommentsLimit = parseInt(Router.current().params.commentsLimit, 10);
		} else {
			actualCommentsLimit = 5;
		}
		
		if (RSCount1 > RSCount2) {
			if (RSCount1 > actualCommentsLimit) {
				Session.set('hasMoreLessURL', actualCommentsLimit + 3);
				if (!Session.get('hasMoreURLBoolean')) {	
					Session.set('hasMoreURLBoolean', true);
				}
			} else {
				if (actualCommentsLimit - 3 < 1) {
					Session.set('hasMoreLessURL', 1);
				} else {
					Session.set('hasMoreLessURL', actualCommentsLimit - 3);
				}
			
				if (Session.get('hasMoreURLBoolean')) {
					Session.set('hasMoreURLBoolean', false);
				}
			}
		} else {
			if (RSCount2 > actualCommentsLimit) {
				Session.set('hasMoreLessURL', actualCommentsLimit + 3);
				if (!Session.get('hasMoreURLBoolean')) {	
					Session.set('hasMoreURLBoolean', true);
				}
			} else {
				if (actualCommentsLimit - 3 < 1) {
					Session.set('hasMoreLessURL', 1);
				} else {
					Session.set('hasMoreLessURL', actualCommentsLimit - 3);
				}
				
				if (Session.get('hasMoreURLBoolean')) {
					Session.set('hasMoreURLBoolean', false);
				}
			}
		}
	},
	
	'click .has-more-lack-review-path': function() {
		let actualCommentsLimit;
		if (Router.current().params.commentsLimit) {
			actualCommentsLimit = parseInt(Router.current().params.commentsLimit, 10);
		} else {
			actualCommentsLimit = 5;
		}
		
		if (RSCount3 > actualCommentsLimit) {
			Session.set('hasMoreLessLackURL', actualCommentsLimit + 3);
			if (!Session.get('hasMoreLackURLBoolean')) {	
				Session.set('hasMoreLackURLBoolean', true);
			}
		} else {
			if (actualCommentsLimit - 3 < 1) {
				Session.set('hasMoreLessLackURL', 1);
			} else {
				Session.set('hasMoreLessLackURL', actualCommentsLimit - 3);
			}
		
			if (Session.get('hasMoreLackURLBoolean')) {
				Session.set('hasMoreLackURLBoolean', false);
			}
		}
	},
	
	'click .showCommentBox, click .showCommentBoxGlyphicon': function(e) {
		if (!Session.get('creatingCharCount')) {
			Session.set('creatingCharCount', true);
		}
		Session.set('charCount', 1000);
		Session.set('isCommentBoxSummoned', true);
	},
	
	'click #another-search-button': function() {
		Session.set('searchBoxSummonedReview', true);
		
		if (Meteor.user().profile.reviewSearchBoxPref != 'top') { 
			$('html, body').animate({ scrollTop: '+=200px'}, 500);
		}
	},
	
	'click .review-bullhorn': function() {
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var single = this.single;
		
		var checkBHActivation = function () {
			if ($('.review-bullhorn').hasClass('active')) {
				$('.review-bullhorn').removeClass('active');
			} else {
				$('.review-bullhorn').addClass('active');
			}
		};
		
		checkBHActivation();
		
		Meteor.call('bullHornAdd', collection, reviewId, single, function(error, voted) {
			if (error) {
				if (TAPi18n.getLanguage() != 'en') {
					checkBHActivation();
					switch (error.message) {
					 case 'Sorry! You have to be logged in to bullhorn reviews.':
					 	return throwError(TAPi18n.__('bullhorn_log_out'));
					 	break;
					 case 'Please limit your review Id to 50 characters.':
					 	return throwError(TAPi18n.__('review_id_too_long'));
					 	break;
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;
					}
				}
				checkBHActivation();
				return throwError(error);
			}
			
			if (!voted) {
				throwSuccess(TAPi18n.__('review_bullhorn_cancelled_notif'));
			}
			
			if (voted) {
				throwSuccess(TAPi18n.__('review_bullhorned_notif'));
				
				if (Meteor.user().profile.showShareSettings || Meteor.user().profile.showShareSettings == undefined) {
					
					let collection = Router.current().params.category;
					let reviewId = Router.current().params._id;
	
					let bullHornLeftCount = Meteor.call('bullHornLeftCount', collection, reviewId, function(error, result) {
						if (!error) {
							Session.set('bullHornLeftCount', result);
					
							$('#shareDialog').modal('show');
						}
					});
				}
			}
		});
	},
	
	'click .share-dialog-btn': function() {
		if ($('#dont-show-share').is(':checked')) {
			let showShare = false;
			let showShareRec;
			let pref;
			
			Meteor.call('likeSettingsPrefSave', pref, showShare, showShareRec, function (error) {
				if (error) {
					if (TAPi18n.getLanguage() != 'en') {
						switch (error.message) {
						 case 'Please log in to change your account settings.':
						 	return throwError(TAPi18n.__('log_in_change_acct_settings'));
						 	break;
						 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
							return throwError(TAPi18n.__('internal_server_error'));
							break;
						}
					}
				
					return throwError(error);
				}
			
				throwSuccess(TAPi18n.__('review_settings_saved'));
			});
		}
	},
	
	'click .like-dialog-btn': function() {
		if ($('#dont-show-like-share').is(':checked')) {
			let showShareRec = false;
			let showShare;
			let pref;
			
			Meteor.call('likeSettingsPrefSave', pref, showShare, showShareRec, function (error) {
				if (error) {
					if (TAPi18n.getLanguage() != 'en') {
						switch (error.message) {
						 case 'Please log in to change your account settings.':
						 	return throwError(TAPi18n.__('log_in_change_acct_settings'));
						 	break;
						 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
							return throwError(TAPi18n.__('internal_server_error'));
							break;
						}
					}
				
					return throwError(error);
				}
			
				throwSuccess(TAPi18n.__('review_settings_saved'));
			});
		}
	},
	
	'keyup #newCriteriaInput': function() {
		Session.set('keyupCriteriaAdd', true);
	},
		
	'click .arrow-up': function(e) {
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var commentId = this._id;
		var commentsGroup;
		if ($(e.target).parents('.parent').hasClass('comments1')){
			commentsGroup = 'comments1';
		} else if ($(e.target).parents('.parent').hasClass('comments2')){
			commentsGroup = 'comments2';
		} else if ($(e.target).parents('.parent').hasClass('commentsLack')){
			commentsGroup = 'commentsLack';
		};
		
		var checkAUActivation = function() {
			if ($(e.target).is('button')) {
				if ($(e.target).hasClass('active')) {
					$(e.target).removeClass('active');
				} else {
					$(e.target).addClass('active');
				}
			} else {
				if ($(e.target).parent().hasClass('active')) {
					$(e.target).parent().removeClass('active');
				} else {
					$(e.target).parent().addClass('active');
				}
			}
		};
		
		checkAUActivation();
		
		Meteor.call('commentVoteUp', collection, reviewId, commentsGroup, commentId, function(error) {
			if (error) {
				checkAUActivation();
				
				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
					 case 'Sorry! You have to be logged in to grade review snippets.':
					 	return throwError(TAPi18n.__('log_in_to_grade'));
					 	break;
					 case 'Please limit your review Id to 50 characters.':
					 	return throwError(TAPi18n.__('review_id_too_long'));
					 	break;
					 case 'Please limit the snippet id to 50 characters.': 
					 	return throwError(TAPi18n.__('limit_comment_id'));
					 	break;
					 case "If you wish to change your grade, click on your original choice's grade button to cancel that grade and then select your new choice.":
					 	return throwError(TAPi18n.__('already_graded_text'));
					 	break;
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;
					}
				}
				
				return throwError(error);
			}
		});
	},
	
	'click .arrow-down': function(e) {
		var collection = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var commentId = this._id;
		var commentsGroup;
		if ($(e.target).parents('.parent').hasClass('comments1')){
			commentsGroup = 'comments1';
		} else if ($(e.target).parents('.parent').hasClass('comments2')){
			commentsGroup = 'comments2';
		} else if ($(e.target).parents('.parent').hasClass('commentsLack')){
			commentsGroup = 'commentsLack';
		};
		
		var checkADActivation = function() {
			if ($(e.target).is('button')) {

				if ($(e.target).hasClass('active')) {
					$(e.target).removeClass('active');
				} else {
					$(e.target).addClass('active');
				}
			
			} else {
		
				if ($(e.target).parent().hasClass('active')) {
					$(e.target).parent().removeClass('active');
				} else {
					$(e.target).parent().addClass('active');
				}
			
			}
		};
		
		checkADActivation();
		
		Meteor.call('commentVoteDown', collection, reviewId, commentsGroup, commentId, function(error) {
			if (error) {
				checkADActivation();
				
				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
					 case 'Sorry! You have to be logged in to grade review snippets.':
					 	return throwError(TAPi18n.__('log_in_to_grade'));
					 	break;
					 case 'Please limit your review Id to 50 characters.':
					 	return throwError(TAPi18n.__('review_id_too_long'));
					 	break;
					 case 'Please limit the snippet id to 50 characters.': 
					 	return throwError(TAPi18n.__('limit_comment_id'));
					 	break;
					 case "If you wish to change your grade, click on your original choice's grade button to cancel that grade and then select your new choice.":
					 	return throwError(TAPi18n.__('already_graded_text'));
					 	break;
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;
					}
				}
				
				return throwError(error);
			}
		});
	},
	
	'click .glyphicon-edit': function(e) {
		if ($(e.target).parents('.container').find('.edit-table').length > 0) {
			$('.edit-table').detach();
		} else {
			if (TAPi18n.getLanguage() == 'pl') {
				$(e.target).append("<ul class='edit-table'><li class='edit-table-li'><a class='editComment'>Edytuj</a></li><li class='edit-table-li'><a class='deleteComment'>Usuń</a></li></ul>");
			} else {
				$(e.target).append("<ul class='edit-table'><li class='edit-table-li'><a class='editComment'>Edit</a></li><li class='edit-table-li'><a class='deleteComment'>Delete</a></li></ul>");
			}
		}
	},
	
	'click .glyphicon-chevron-down': function(e) {
		$(e.target).removeClass('glyphicon-chevron-down');
		$(e.target).addClass('glyphicon-chevron-up');
	},
	
	'click .glyphicon-chevron-up': function(e) {
		$(e.target).removeClass('glyphicon-chevron-up');
		$(e.target).addClass('glyphicon-chevron-down');
	},
	
	//Content Editor
	'click .editComment': function(e) {
		e.preventDefault();

		if($('.ceDoneButton').length == 0){	
			var text = $(e.target).parents('.edit-glyph').siblings('.commentTextParent');
			originalText = text.find('.commentText').html();
			if (originalText.includes('<a class="show-more"> ...show more</a>', originalText.length - 38)) {
				originalText = this.comment;
			} else if (originalText.includes('<a class="show-less"> show less</a>', originalText.length - 35)) {
				originalText = originalText.substr(0, originalText.length - 35);
			}
			text.find('.commentText').remove();
			text.append("<textarea class='commentText' rows='10'>" + originalText + "</textarea>");
			Session.set('charCount', 1000);
			
			if (TAPi18n.getLanguage() == 'pl') {
				text.append("<a class='ceDoneButton'>Zapisz</a><a class='ceCancelButton'>Anuluj</a>");
			} else {
				text.append("<a class='ceDoneButton'>Done</a><a class='ceCancelButton'>Cancel</a>");
			}
			text.find('.commentText').focus();
		} else {
			throwError(TAPi18n.__('review_edit_one_at_a_time'));
		}
	},

	//Populate Emergency Editing Cache
	'keyup .commentText': function(e) {
		var body = $(e.target);
		
		if (Session.get('keyupId') != this._id) {
			Session.set('keyupId', this._id);
		}
		Session.set('charCount', (1000 - body.val().length));
		if (!Session.get('editingCharCount')) {
			Session.set('editingCharCount', true);
		}
		localStorage.setItem("commentInEdit", body.val());
	},
	
	//set criteria proposal description char count
	'keyup #newCriteriaDescription': function(e) {
		var body = $(e.target);
		
		Session.set('desCharCount', (300 - body.val().length));
	},
	
	//Edit Comment
	'click .ceDoneButton': function(e) {
		e.preventDefault();

		var text = $(e.target).siblings('.commentText');
		var newText = text.val();
		
		var collection = Router.current().params.category;
		
		var reviewId = Router.current().params._id;
		
		var commentId = this._id;
		
		var commentsGroup;
		if ($(e.target).parents('.parent').hasClass('comments1')){
			commentsGroup = 'comments1';
		} else if ($(e.target).parents('.parent').hasClass('comments2')){
			commentsGroup = 'comments2';
		} else if ($(e.target).parents('.parent').hasClass('commentsLack')){
			commentsGroup = 'commentsLack';
		};
		
		Meteor.call('reviewCommentEdit', newText, collection, reviewId, commentId, commentsGroup, function(error, newSavedText) {
			if (error) {
				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
					 case 'Sorry! You have to be logged in to edit a snippet':
					 	return throwError(TAPi18n.__('log_in_to_grade'));
					 	break;
					 case "Sorry. Your snippet couldn't be saved because no text was received. To see your previous snippet, please refresh the page.":
					 	return throwError(TAPi18n.__('no_text_snippet'));
					 	break;
					 case "Please limit your snippet to 1000 characters.":
					 	return throwError(TAPi18n.__('review_page_throw_too_long'));
					 	break;
					 case 'Please limit your review Id to 50 characters.':
					 	return throwError(TAPi18n.__('review_id_too_long'));
					 	break;
					 case 'Please limit the snippet id to 50 characters.': 
					 	return throwError(TAPi18n.__('limit_comment_id'));
					 	break;	
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;
					}
				}
			
				return throwError(error);
			}
			
			Session.set('editingCharCount', false);
			text.detach();
			if (newSavedText.length > 500) {
				var shorterComment = newSavedText.substring(0, 500);
				$(e.target).parent('.commentTextParent').append("<p class='commentText'>" + shorterComment + "<a class=\"show-more\"> ...show more</a></p>");
			} else {
				$(e.target).parent('.commentTextParent').append("<p class='commentText'>" + newSavedText + "</p>");
			}
					
			if($('.ceDoneButton').length == 1){
				$('.ceDoneButton').detach();
				$('.ceCancelButton').detach();
			};
			
			localStorage.removeItem("commentInEdit");
		});
	},
	
	'click .ceCancelButton': function(e) {
		e.preventDefault();
		
		var text = $(e.target).siblings('.commentText');
		
		Session.set('editingCharCount', false);
		text.detach();
		if (originalText.length > 500) {
			var shorterComment = originalText.substring(0, 500);
			$(e.target).parent('.commentTextParent').append("<p class='commentText'>" + shorterComment + "<a class=\"show-more\"> ...show more</a></p>");
		} else {
			$(e.target).parent('.commentTextParent').append("<p class='commentText'>" + originalText + "</p>");
		}
					
		if($('.ceDoneButton').length == 1){
			$('.ceDoneButton').detach();
			$('.ceCancelButton').detach();
		};
	},
	
	//Delete Comment Modal Open
	'click .deleteComment': function(e) {
		e.preventDefault();
		
		deleteCommentObject = this;
		
		if ($(e.target).parents('.parent').hasClass('comments1')){
			deleteCommentObject.commentsGroup = 'comments1';
		} else if ($(e.target).parents('.parent').hasClass('comments2')){
			deleteCommentObject.commentsGroup = 'comments2';
		} else if ($(e.target).parents('.parent').hasClass('commentsLack')){
			deleteCommentObject.commentsGroup = 'commentsLack';
		};
		
		$('#confirmDelete').modal();
	},
	
	//Carry Out Delete Comment
	'click #confirm-delete-yes': function() {
		var collection = Router.current().params.category;
	
		var reviewId = Router.current().params._id;
		var commentsGroup = deleteCommentObject.commentsGroup;
		
		var comment = deleteCommentObject.comment;
		var submitted = deleteCommentObject.submitted;
		var commentId = deleteCommentObject._id;
		
		deleteCommentObject = {};
		
		Meteor.call('reviewCommentDelete', collection, reviewId, commentsGroup, comment, submitted, commentId, function(error) {
			if (error) {
				$('#confirmDelete').modal('toggle');
				
				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
					 case 'Sorry! You have to be logged in to delete a snippet':
					 	return throwError(TAPi18n.__('log_in_to_delete'));
					 	break;
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;
					 default:
					 	return throwError(error);
					}
				}
				
				return throwError(error);
			}
			
			$('#confirmDelete').modal('toggle');
		});
	},
	
	//Cancel Comment Delete
	'click #confirm-delete-cancel': function() {
		deleteCommentObject = {};
	},

	//Populate Emergency Comment Creation Cache
	'keyup #review-comment-box-normal, keyup #review-comment-box-x-small': function(e) {
		var body = $(e.target);

		Session.set('charCount', (1000 - body.val().length));
		localStorage.setItem("commentInProgress", body.val());
	},
	
	//Insert Comment
	"submit .comment-form": function(e) {
		e.preventDefault();
		
		var body = $(e.target).find('[name=body]');
		
		if(body.val() == '') {
			return throwError(TAPi18n.__('review_page_throw_no_text'));
		};
		
		var bareComment = {
			comment: body.val()
		};
		
		if (bareComment.comment.length > 1000) {
			return throwError(TAPi18n.__('review_page_throw_too_long'));
		}
		
		var collection = Router.current().params.category;

		var reviewId = Router.current().params._id;
		
		var commentsGroup;
		if ($(e.target).prev().prev().hasClass('comments1')){
			commentsGroup = 'comments1';
		} else if ($(e.target).prev().prev().hasClass('comments2')){
			commentsGroup = 'comments2';
		} else if ($(e.target).prev().prev().hasClass('commentsLack')) {
			commentsGroup = 'commentsLack';
		};
		
		Meteor.call('reviewCommentInsert', bareComment, collection, reviewId, commentsGroup, function(error) {
			if (error) {
				if (TAPi18n.getLanguage() != 'en') {
					switch(error.message) {
						case 'Sorry! You have to be logged in to submit a snippet.':
							throwError(TAPi18n.__('log_in_to_submit_snippet')); 
							break;
						case 'Please limit your snippet to 1000 characters.': 
							throwError(TAPi18n.__('review_page_throw_too_long'));
							break;
						case "Sorry, your snippet couldn't be saved because no text was received. To see your previous snippet, please refresh the page.":
							throwError(TAPi18n.__('no_text_comment'));
						case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
							return throwError(TAPi18n.__('internal_server_error'));
							break;
						default: 
							return throwError(error);
					}
				}
				
				return throwError(error);
			}
			
			Session.set('charCount', 1000);
			Session.set('newComment', false);
			Session.set('newComment', true);
		});
		
		body.val('');
		localStorage.removeItem("commentInProgress");
	},
	
	'click .flagComment': function(e) {
		e.preventDefault();
		
		flagCommentObject = this;
		
		if ($(e.target).parents('.parent').hasClass('comments1')){
			flagCommentObject.commentsGroup = 'comments1';
		} else if ($(e.target).parents('.parent').hasClass('comments2')){
			flagCommentObject.commentsGroup = 'comments2';
		} else if ($(e.target).parents('.parent').hasClass('commentsLack')){
			flagCommentObject.commentsGroup = 'commentsLack';
		};

		$('#flagCommentModal').modal();
	},
	
	//Populate Emergency Comment Flag Creation Cache
	'keyup #flagCommentExplanation': function(e) {
		var body = $(e.target);
		
		localStorage.setItem("flagCommentInProgress", body.val());
	},
	
	'click #flagCommentSubmit': function() {
		var flagCommentExplanation = $('#flagCommentExplanation').val();
		
		var category = Router.current().params.category;
		var reviewId = Router.current().params._id;
		var flagComment = flagCommentObject.comment;
		var flagCommentsGroup = flagCommentObject.commentsGroup;
		var flagCommentId = flagCommentObject._id;
		
		flagCommentObject = {};
		
		Meteor.call('flagCommentInsert', category, reviewId, flagCommentExplanation, flagComment, flagCommentsGroup, flagCommentId, function(error) {
			if (error) {
				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
					 case 'Sorry! You have to be logged in to submit a flag.':
					 	return throwError(TAPi18n.__('flag_log_out'));
					 	break;
					 case "Please shorten your explanation to less than 10,000 characters.":
					 	return throwError(TAPi18n.__('shorten_flag'));
					 	break;
					 case "Sorry. Your flag couldn't be accepted because no text was received. Please submit a flag with text.":
					 	return throwError(TAPi18n.__('flag_no_text'));
					 	break;
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;
					 default:
					 	return throwError(error);
					}
				}
			
				return throwError(error);				
			}
			
			$('#flagCommentModal').modal('toggle');
			$('#flagCommentExplanation').val('');
			$('#flagAnswerModal').modal();
			localStorage.removeItem("flagCommentInProgress");
		});
	},
	
	//Cancel Comment Flag
	'click #comment-flag-cancel': function() {
		flagCommentObject = {};
	},
	
	//Populate Emergency Review Flag Creation Cache
	'keyup #flagExplanation': function(e) {
		var body = $(e.target);
		
		localStorage.setItem("flagReviewInProgress", body.val());
	},
	
	'click #flagSubmit': function() {
		var flagExplanation = $('#flagExplanation').val();
		var category = Router.current().params.category;
		var reviewId = Router.current().params._id;
		
		Meteor.call('flagInsert', flagExplanation, category, reviewId, function(error) {
			if (error) {
				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
					 case 'Sorry! You have to be logged in to submit a flag.':
					 	return throwError(TAPi18n.__('flag_log_out'));
					 	break;
					 case "Please shorten your explanation to less than 10,000 characters.":
					 	return throwError(TAPi18n.__('shorten_flag'));
					 	break;
					 case "Sorry. Your flag couldn't be accepted because no text was received. Please submit a flag with text.":
					 	return throwError(TAPi18n.__('flag_no_text'));
					 	break;
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;
		 			 default:
						return throwError(error);
					}
				}
			
				return throwError(error);				
			}
			
			$('#flagModal').modal('toggle');
			$('#flagExplanation').val('');
			$('#flagAnswerModal').modal();
			localStorage.removeItem("flagReviewInProgress");
		});
	}
});

ShareIt.configure({
     sites: {
         'facebook': {
             'appId': '368277170191969'
         }
     }
});
