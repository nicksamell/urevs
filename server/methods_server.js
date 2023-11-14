//DDP Rate Limiter
//shout out to the MDG - Meteor Guide
//if (Meteor.isServer) {
	const one_sec_methods = [
		'reviewCommentInsert',
		'bullHornAdd',
		'revLike',
		'criteriaVote',
		'criteriaRate',
		'commentVoteUp',
		'commentVoteDown',
		'reviewCommentDelete',
		'requestAccountDelete',
		'cancelAccountDelete',
		'criteriaSuggestionVote',
		'countViews'
	];

	var methodRuleOneSec = {
		name(name) {
			return _.contains(one_sec_methods, name);
		},
	
		//rate limit per connection id
		connectionId() { return true; }
	};

	//Only allow 1 operation per connection per second for sensitive methods - methods which cannot afford duplicates
	DDPRateLimiter.addRule(methodRuleOneSec, 1, 1000);

	const search_landing_methods = [
		'spellCheckNecessaryMethod',
		'spellCheckSuggestionsMethod',
		'hasMoreSearchMethod'
	];

	var methodRule1 = {
		name(name) {
			return _.contains(search_landing_methods, name);
		},
	
		//rate limit per connection id
		connectionId() { return true; }
	};

	//Only allow 5 operations per connection per second
	DDPRateLimiter.addRule(methodRule1, 5, 1000);

	const account_page_methods = [
		'deNotifyBullHornReview',
		'proPicSave',
		'userMessageRemove',
		'noYoutube',
		'likeSettingsPrefSave',
		'tubeRequestSend',
		'userLanguageSave'
	];

	var methodRule2 = {
		name(name) {
			return _.contains(account_page_methods, name);
		},
	
		//rate limit per connection id
		connectionId() { return true; }
	};

	//Only allow 5 operations per connection per second
	DDPRateLimiter.addRule(methodRule2, 5, 1000);



	const newest_page_methods = [
		'hasMoreNewestMethod'
	];

	var methodRule3 = {
		name(name) {
			return _.contains(newest_page_methods, name);
		},
	
		//rate limit per connection id
		connectionId() { return true; }
	};

	//Only allow 5 operations per connection per second
	DDPRateLimiter.addRule(methodRule3, 5, 1000);



	const trending_page_methods = [
		'hasMoreTrendingMethod'
	];

	var methodRule4 = {
		name(name) {
			return _.contains(trending_page_methods, name);
		},
	
		//rate limit per connection id
		connectionId() { return true; }
	};

	//Only allow 5 operations per connection per second
	DDPRateLimiter.addRule(methodRule4, 5, 1000);



	const review_category_form_methods = [
		'reviewInsert',
		'newCategoryProposalInsert'
	];

	var methodRule5 = {
		name(name) {
			return _.contains(review_category_form_methods, name);
		},
	
		//rate limit per connection id
		connectionId() { return true; }
	};

	//Only allow 5 operations per connection per second
	DDPRateLimiter.addRule(methodRule5, 5, 1000);



	const review_page_methods = [
		'getReviewSEO',
		'isHighlightedBullHorn',
		//'isHorn',
		'RSCountMethod1',
		'RSCountMethod2',
		'hasMoreLackMethod',
		//'checkOwner',
		//'getAuthorName',
		'isHighlightedLike',
		//'whichHighlightedCompBtn',
		//'isHighlightedUpVote',
		//'isHighlightedDownVote',
		//'commentProPic',
		'reviewCommentEdit',
		'isYoutubeLinkMethod',
		'getYoutubeLink',
		'hasMoreLackCount',
		'bullHornLeftCount',
		'noReview',
		'isHighlightedSuggestionVoteBtn',
		'isMaxSugReached',
		'newCriteriaSubmit',
		'isInTrending',
		'newPriceSubmit',
		'lastRating'
	];

	var methodRule6 = {
		name(name) {
			return _.contains(review_page_methods, name);
		},
	
		//rate limit per connection id
		connectionId() { return true; }
	};

	//Only allow 5 operations per connection per second
	DDPRateLimiter.addRule(methodRule6, 10, 1000);



	const user_feedback_methods = [
		'suggestionInsert',
		'flagCommentInsert',
		'flagInsert'
	];

	//Only allow 5 operations per connection per second
	DDPRateLimiter.addRule({
		name(name) {
			return _.contains(user_feedback_methods, name);
		},
	
		//rate limit per connection id
		connectionId() { return true; }
	}, 5, 1000);
	
	
	
	const landing_page_methods = [
		'deleteNotificationAlert',
		'IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement',
		'a_12_09_2017_IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement',
		'suggestionsMethod'
	];

	//Only allow 5 operations per connection per second
	DDPRateLimiter.addRule({
		name(name) {
			return _.contains(landing_page_methods, name);
		},
	
		//rate limit per connection id
		connectionId() { return true; }
	}, 5, 1000);
//}

Meteor.methods({
	//Account Page
	tubeRequestSend: function(tubeInput) {
		check(tubeInput, String);
		
		let user = Meteor.user();
		
		if (!user) {
			throw new Meteor.Error("Logged-Out", "Please log in to change your account settings.");
		}
		
		if (tubeInput === '') {
			throw new Meteor.Error("No Text", "Please enter a youtube channel id.");
		}
		
		if (tubeInput.length > 100) {
			throw new Meteor.Error("Too Long", "Please enter a valid youtube channel id.");
		}
		
		Meteor.users.update({_id: user._id},{$set: {'profile.youtubeSettings': true, 'profile.youtubeApproved': false, 'profile.youtubeLink': 'null'}}, function(error){
			if (error) {
				console.log('tubeRequestSend - ' + error);
				throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
			}
		});
		
		let request = {
			channelId: tubeInput,
			dateSubmitted: new Date(),
			userId: user._id,
			username: user.profile.name
		}
		
		YoutubeRequests.insert(request);
		
		Meteor.users.update({_id: 'coftxS5cw7XjcfTNd'}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "Youtube Request - " + request.channelId}}});
	},
	
	requestAccountDelete: function(whyMessage) {
		check(whyMessage, String);
		
		if (whyMessage.length > 10000) {
			throw new Meteor.Error("Too Long", "Your detailed response is appreciated. However, there is a limit of 10000 characters. If you would like to write a longer one, please send an e-mail to support@urevs.com");
		}
		
		let user = Meteor.user();
		
		if (!user) {
			throw new Meteor.Error("Logged-Out", "Please log in to delete your account.");
		}
		
		Meteor.users.update({_id: user._id},{$set: {'profile.deleteActive': true}}, function(error){
			if (error) {
				console.log('requestAccountDelete - ' + error);
				throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
			}
		});
		
		AccountDeleteRequests.insert({
			messageId: Random.id(), 
			date: new Date(), 
			userId: user._id, 
			messageText: "Account Delete - " + user._id + " why - " + whyMessage
		});
		
		Meteor.users.update({_id: 'coftxS5cw7XjcfTNd'}, {$push: {'profile.messages': {messageId: Random.id(), date: new Date(), userId: user._id, messageText: "Account Delete - " + user._id + " why - " + whyMessage}}});
	},
	
	cancelAccountDelete: function() {
		let user = Meteor.user();
		
		if (!user) {
			throw new Meteor.Error("Logged-Out", "Great to see you back! Please log in to cancel deletion of your account, if you had requested it before.");
		}
		
		Meteor.users.update({_id: user._id},{$set: {'profile.deleteActive': false}}, function(error){
			if (error) {
				console.log('cancelAccountDelete - ' + error);
				throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
			}
		});
		
		Meteor.users.update({_id: 'coftxS5cw7XjcfTNd'}, {$push: {'profile.messages': {messageId: Random.id(), date: new Date(), userId: user._id, messageText: "CANCEL Account Delete - " + user._id}}});
	},
	
	//Search
	spellCheckNecessaryMethod: function(searchString1, searchString2, typeFilter, range1, range2, currentLangLabel) {
		check(searchString1, String);
		check(searchString2, String);
		check(typeFilter, String);
		check(range1, Number);
		check(range2, Number);
		check(currentLangLabel, String);
		
		if (typeFilter === 'single' || typeFilter === 'comparison' || typeFilter === 'all') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('spellCheckNecessaryMethod - typeFilter misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (searchString1.length > 100 || searchString2.length > 100) {
			throw new Meteor.Error("Too long", "Please limit your search entry to 100 characters.");
 		}
		
		if (range1 > 10000) {
			range1 = 10000;
		} else if (range1 < 0) {
			range1 = 0;
		}
		
		if (range2 > 10000) {
			range2 = 10000;
		} else if (range2 < 0) {
			range2 = 0;
		}
	
		if (range1 > range2) {
			throw new Meteor.Error("Please enter your range from lowest to highest."); 
		}

		///search 'Methods'
		if (searchString1 != 'null' && searchString2 != 'null') {

			if (typeFilter === 'all') {
				if (SearchIndex.find({revTitle1: searchString1, revTitle2: searchString2, price1: {$gte: range1}, price1: {$lte: range2}, price2: {$gte: range1}, price2: {$lte: range2}, language: currentLangLabel}, {score: {$meta: "textScore"}}).fetch().length > 0) {
					return true;
				}
			} else if (typeFilter === 'single') {
				if (SearchIndex.find({'single': true, revTitle1: searchString1, price1: {$gte: range1}, price1: {$lte: range2}, language: currentLangLabel}, {score: {$meta: "textScore"}}).fetch().length > 0) {
					return true;
				}
			} else if (typeFilter === 'comparison') {
				if (SearchIndex.find({'single': false, revTitle1: searchString1, revTitle2: searchString2, price1: {$gte: range1}, price1: {$lte: range2}, price2: {$gte: range1}, price2: {$lte: range2}, language: currentLangLabel}, {score: {$meta: "textScore"}}).fetch().length > 0) {
					return true;
				}
			}
		/// now searchSingle 'Methods'
		} else if (searchString1 === 'null' || searchString2 === 'null') {
			if (searchString1 != 'null') {

				if (typeFilter === 'all') {
					if (SearchIndex.find({revTitle1: searchString1, revTitle2: searchString2, price1: {$gte: range1}, price1: {$lte: range2}, price2: {$gte: range1}, price2: {$lte: range2}, language: currentLangLabel}, {score: {$meta: "textScore"}}).fetch().length > 0) {
						return true;
					}
				} else if (typeFilter === 'single') {
					if (SearchIndex.find({'single': true, revTitle1: searchString1, price1: {$gte: range1}, price1: {$lte: range2}, language: currentLangLabel}, {score: {$meta: "textScore"}}).fetch().length > 0) {
						return true;
					}
				} else if (typeFilter === 'comparison') {
					if (SearchIndex.find({'single': false, revTitle1: searchString1, revTitle2: searchString2, price1: {$gte: range1}, price1: {$lte: range2}, price2: {$gte: range1}, price2: {$lte: range2}, language: currentLangLabel}, {score: {$meta: "textScore"}}).fetch().length > 0) {
						return true;
					}
				}
			} else {

				if (typeFilter === 'all') {
					if (SearchIndex.find({revTitle1: searchString1, revTitle2: searchString2, price1: {$gte: range1}, price1: {$lte: range2}, price2: {$gte: range1}, price2: {$lte: range2}, language: currentLangLabel}, {score: {$meta: "textScore"}}).fetch().length > 0) {
						return true;
					}
				} else if (typeFilter === 'single') {
					if (SearchIndex.find({'single': true, revTitle1: searchString1, price1: {$gte: range1}, price1: {$lte: range2}, language: currentLangLabel}, {score: {$meta: "textScore"}}).fetch().length > 0) {
						return true;
					}
				} else if (typeFilter === 'comparison') {
					if (SearchIndex.find({'single': false, revTitle1: searchString1, revTitle2: searchString2, price1: {$gte: range1}, price1: {$lte: range2}, price2: {$gte: range1}, price2: {$lte: range2}, language: currentLangLabel}, {score: {$meta: "textScore"}}).fetch().length > 0) {
						return true;
					}
				}
			}
		}
	},

	//Review Insert Methods
	checkReviewExists: function(reviewAttributes) {
		if(reviewAttributes.single) {
			check(reviewAttributes, {
				single: true,
				language: String,
				category: String,
				productName1: String
			});
		} else {
			check(reviewAttributes, {
				single: false,
				language: String,
				category: String,
				productName1: String,
				productName2: String
			});
		}
		
		if (reviewAttributes.language === 'en' || reviewAttributes.language === 'pl') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('reviewInsert - lang misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (reviewAttributes.category === 'camerasreviews' || reviewAttributes.category === 'phonesreviews' || reviewAttributes.category === 'computersreviews' || reviewAttributes.category === 'tvsreviews' || reviewAttributes.category === 'consolesreviews' || reviewAttributes.category === 'gamesreviews' || reviewAttributes.category === 'none') {
			if (reviewAttributes.category === 'none') {
				throw new Meteor.Error("No Category Chosen", "Please choose an appropriate category for this review.");
			}
			//else proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('reviewInsert - category misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if(reviewAttributes.single) {
			if (!reviewAttributes.productName1.replace(/\s/g, '').length ||  		 		
				  reviewAttributes.productName1 == '') {
				throw new Meteor.Error("Incomplete Form", "Please fill in all required form fields to create a new review.");
			}
		} else {
			if (!reviewAttributes.productName1.replace(/\s/g, '').length ||
			 	 !reviewAttributes.productName2.replace(/\s/g, '').length || 
			 	  reviewAttributes.productName1 == '' ||
			 	  reviewAttributes.productName2 == '') {
				throw new Meteor.Error("Incomplete Form", "Please fill in all required form fields to create a new review.");
			}
		}
		
		var stringCapitalize = function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		};
		
		var collection = reviewAttributes.category;
		collection = collection.toLowerCase();

		if(reviewAttributes.single){
			var regexpr1 = reviewAttributes.productName1;

			//eliminate all spaces
			var clean1 = regexpr1.replace(/ /gi, "");

			var finalreg = '\\s*';
			var reg1 = clean1.match(/.{0,1}/g);
			finalreg += reg1.join('\\s*');

			var duplicateReview = Mongo.Collection.get(collection).findOne({
				single: true,
				language: reviewAttributes.language,
				productName1: { $regex: finalreg, $options: 'i' }
			});
		} else {
			var regexpr1 = reviewAttributes.productName1;
			var regexpr2 = reviewAttributes.productName2;
			
			//eliminate all spaces
			var clean1 = regexpr1.replace(/ /gi, "");

			var finalreg1 = '\\s*';
			var reg1 = clean1.match(/.{0,1}/g);
			finalreg1 += reg1.join('\\s*');
			
			var clean2 = regexpr2.replace(/ /gi, "");

			var finalreg2 = '\\s*';
			var reg2 = clean2.match(/.{0,1}/g);
			finalreg2 += reg2.join('\\s*');
			
			var duplicateReview = Mongo.Collection.get(reviewAttributes.category).findOne({
				single: false,
				language: reviewAttributes.language,
				productName1: { $regex: finalreg1, $options: 'i' },
				productName2: { $regex: finalreg2, $options: 'i' }
			});
			
			if (!duplicateReview) {
				duplicateReview = Mongo.Collection.get(reviewAttributes.category).findOne({
					single: false,
					language: reviewAttributes.language,
					productName1: { $regex: finalreg2, $options: 'i' },
					productName2: { $regex: finalreg1, $options: 'i' }
				});
			}
		}
		
		if (duplicateReview) {
			return {
				reviewExists: true,
				_id: duplicateReview._id
			}
		} else {
			return {
				reviewExists: false,
				_id: null
			}
		}
	},
	
	reviewInsert: function(reviewAttributes) {
		if(reviewAttributes.single) {
			check(reviewAttributes, {
				single: true,
				language: String,
				category: String,
				productName1: String,
				picUrl1: String,
				picSource1: String,
				product1Price: Match.Maybe(Number),
				product1PricePlaceLink: String
			});
		} else {
			check(reviewAttributes, {
				single: false,
				language: String,
				category: String,
				productName1: String,
				productName2: String,
				picUrl1: String,
				picUrl2: String,
				picSource1: String,
				picSource2: String,
				product1Price: Match.Maybe(Number),
				product1PricePlaceLink: String,
				product2Price: Match.Maybe(Number),
				product2PricePlaceLink: String
			});
		}
		
		var now = new Date();
		var todayDate = now.getDate() + '-' + now.getMonth() + '-' + now.getFullYear();
		
		if (reviewAttributes.category === 'camerasreviews' || reviewAttributes.category === 'phonesreviews' || reviewAttributes.category === 'computersreviews' || reviewAttributes.category === 'tvsreviews' || reviewAttributes.category === 'consolesreviews' || reviewAttributes.category === 'gamesreviews' || reviewAttributes.category === 'none') {
			if (reviewAttributes.category === 'none') {
				throw new Meteor.Error("No Category Chosen", "Please choose an appropriate category for this review.");
			}
			//else proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('reviewInsert - category misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (reviewAttributes.language === 'en' || reviewAttributes.language === 'pl') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('reviewInsert - lang misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if(reviewAttributes.single) {
			if (!reviewAttributes.productName1.replace(/\s/g, '').length ||  		 		
				  reviewAttributes.productName1 == '') {
				throw new Meteor.Error("Incomplete Form", "Please fill in all required form fields to create a new review.");
			}
		} else {
			if (!reviewAttributes.productName1.replace(/\s/g, '').length ||
			 	 !reviewAttributes.productName2.replace(/\s/g, '').length || 
			 	  reviewAttributes.productName1 == '' ||
			 	  reviewAttributes.productName2 == '') {
				throw new Meteor.Error("Incomplete Form", "Please fill in all required form fields to create a new review.");
			}
		}
		
		var product1PricePlaceName;
		
		var product2PricePlaceName;
		
		if(reviewAttributes.single) {
			if (reviewAttributes.productName1.replace(/\s/g, '').length > 50) {
				throw new Meteor.Error("Too Long", "Please enter a product name less than 50 characters long.");
			}
			
			if (reviewAttributes.picUrl1.replace(/\s/g, '').length > 1000) {
				throw new Meteor.Error("Too Long", "Please enter an image url less than 1000 characters long.");
			}
			
			if (reviewAttributes.picUrl1.replace(/\s/g, '').length == 0) {
				reviewAttributes.picUrl1 = 'pending_approval.png';
			}
			
			if (reviewAttributes.picSource1.replace(/\s/g, '').length > 1000) {
				throw new Meteor.Error("Too Long", "Please enter a source url less than 1000 characters long.");
			}
			
			if (reviewAttributes.picSource1.replace(/\s/g, '').length == 0) {
				reviewAttributes.picSource1 = '';
			}
			
			if (reviewAttributes.product1Price < 0) {
				throw new Meteor.Error("Not Positive", "Please enter a non-negative price.");
			}
			
			if (reviewAttributes.product1Price > 10000) {
				throw new Meteor.Error("Too Long", "Please enter a price less than 10001.");
			}
			
			if (reviewAttributes.product1PricePlaceLink.replace(/\s/g, '').length > 1000) {
				throw new Meteor.Error("Too Long", "Please enter a url less than 1000 characters long.");
			}
			
			if (reviewAttributes.product1Price == undefined) {
				reviewAttributes.product1Price = 0;
			} else {
				//leave the reviewAttributes.product1Price as is
			}
			
			if (reviewAttributes.product1PricePlaceLink.replace(/\s/g, '').length < 1) {
				product1PricePlaceName = "No place found yet";
				reviewAttributes.product1PricePlaceLink = "";
			} else {
				product1PricePlaceName = reviewAttributes.product1PricePlaceLink;
				reviewAttributes.product1PricePlaceLink = "";
				//later replace individually if need be
			}
		} else {
			if (reviewAttributes.productName1.replace(/\s/g, '').length > 50 ||
			 		reviewAttributes.productName2.replace(/\s/g, '').length > 50) {
				throw new Meteor.Error("Too Long", "Please enter a product name less than 50 characters long.");
			}
			
			if (reviewAttributes.picUrl1.replace(/\s/g, '').length > 1000 ||
			 		reviewAttributes.picUrl2.replace(/\s/g, '').length > 1000) {
	 			throw new Meteor.Error("Too Long", "Please enter an image url less than 1000 characters long.");
	 		}
	 		
	 		if (reviewAttributes.picUrl1.replace(/\s/g, '').length == 0) {
				reviewAttributes.picUrl1 = 'pending_approval.png';
			}
			
			if (reviewAttributes.picUrl2.replace(/\s/g, '').length == 0) {
				reviewAttributes.picUrl2 = 'pending_approval.png';
			}
			
			if (reviewAttributes.picSource1.replace(/\s/g, '').length > 1000) {
				throw new Meteor.Error("Too Long", "Please enter a source url less than 1000 characters long.");
			}
			
			if (reviewAttributes.picSource2.replace(/\s/g, '').length > 1000) {
				throw new Meteor.Error("Too Long", "Please enter a source url less than 1000 characters long.");
			}
			
			if (reviewAttributes.picSource1.replace(/\s/g, '').length == 0) {
				reviewAttributes.picSource1 = '';
			}
			
			if (reviewAttributes.picSource2.replace(/\s/g, '').length == 0) {
				reviewAttributes.picSource2 = '';
			}
	 		
	 		if (reviewAttributes.product1Price < 0) {
				throw new Meteor.Error("Not Positive", "Please enter a non-negative price.");
			}
	 		
	 		if (reviewAttributes.product1Price > 10000) {
				throw new Meteor.Error("Too Long", "Please enter a price less than 10001.");
			}
			
			if (reviewAttributes.product1PricePlaceLink.replace(/\s/g, '').length > 1000) {
				throw new Meteor.Error("Too Long", "Please enter a url less than 1000 characters long.");
			}
			
			if (reviewAttributes.product2Price < 0) {
				throw new Meteor.Error("Not Positive", "Please enter a non-negative price.");
			}
			
			if (reviewAttributes.product2Price > 10000) {
				throw new Meteor.Error("Too Long", "Please enter a price less than 10001.");
			}
			
			if (reviewAttributes.product2PricePlaceLink.replace(/\s/g, '').length > 1000) {
				throw new Meteor.Error("Too Long", "Please enter a url less than 1000 characters long.");
			}
			
			if (reviewAttributes.product1Price == undefined) {
				reviewAttributes.product1Price = 0;
			} else {
				//leave the reviewAttributes.product1Price as is
			}
			
			if (reviewAttributes.product1PricePlaceLink.replace(/\s/g, '').length < 1) {
				product1PricePlaceName = "No place found yet";
				reviewAttributes.product1PricePlaceLink = "";
			} else {
				product1PricePlaceName = reviewAttributes.product1PricePlaceLink;
				reviewAttributes.product1PricePlaceLink = "";
				//later replace individually if need be
			}
			
			if (reviewAttributes.product2Price == undefined) {
				reviewAttributes.product2Price = 0;
			} else {
				//leave the reviewAttributes.product2Price as is
			}
			
			if (reviewAttributes.product2PricePlaceLink.replace(/\s/g, '').length < 1) {
				product2PricePlaceName = "No place found yet";
				reviewAttributes.product2PricePlaceLink = "";
			} else {
				product2PricePlaceName = reviewAttributes.product2PricePlaceLink;
				reviewAttributes.product2PricePlaceLink = "";
				//later replace individually if need be
			}
		}
		
		//keep redundant duplicate check (also present in checkReviewExists method) just in case someone wants to enter in a duplicate review
		var stringCapitalize = function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		};
		
		var collection = reviewAttributes.category;
		collection = collection.toLowerCase();

		if(reviewAttributes.single){
			var regexpr1 = reviewAttributes.productName1;

			//eliminate all spaces
			var clean1 = regexpr1.replace(/ /gi, "");

			var finalreg = '\\s*';
			var reg1 = clean1.match(/.{0,1}/g);
			finalreg += reg1.join('\\s*');

			var duplicateReview = Mongo.Collection.get(collection).findOne({
				single: true,
				language: reviewAttributes.language,
				productName1: { $regex: finalreg, $options: 'i' }
			});
		} else {
			var regexpr1 = reviewAttributes.productName1;
			var regexpr2 = reviewAttributes.productName2;
			
			//eliminate all spaces
			var clean1 = regexpr1.replace(/ /gi, "");

			var finalreg1 = '\\s*';
			var reg1 = clean1.match(/.{0,1}/g);
			finalreg1 += reg1.join('\\s*');
			
			var clean2 = regexpr2.replace(/ /gi, "");

			var finalreg2 = '\\s*';
			var reg2 = clean2.match(/.{0,1}/g);
			finalreg2 += reg2.join('\\s*');
			
			if (finalreg1 == finalreg2) {
				throw new Meteor.Error("Identical Products", "Please submit two different products for a comparison review.");
			}
			
			var duplicateReview = Mongo.Collection.get(reviewAttributes.category).findOne({
				single: false,
				language: reviewAttributes.language,
				productName1: { $regex: finalreg1, $options: 'i' },
				productName2: { $regex: finalreg2, $options: 'i' }
			});
			
			if (!duplicateReview) {
				duplicateReview = Mongo.Collection.get(reviewAttributes.category).findOne({
					single: false,
					language: reviewAttributes.language,
					productName1: { $regex: finalreg2, $options: 'i' },
					productName2: { $regex: finalreg1, $options: 'i' }
				});
			}
		}

		if (duplicateReview) {
			return {
				reviewExists: true,
				_id: duplicateReview._id
			}
		}
		
		//sanitize input by deleting innocent superfluous spaces
		if (reviewAttributes.single) {
			reviewAttributes.productName1 = reviewAttributes.productName1.trim();
			reviewAttributes.productName1 = stringCapitalize(reviewAttributes.productName1);
		} else {
			reviewAttributes.productName1 = reviewAttributes.productName1.trim();
			reviewAttributes.productName1 = stringCapitalize(reviewAttributes.productName1);
			
			reviewAttributes.productName2 = reviewAttributes.productName2.trim();
			reviewAttributes.productName2 = stringCapitalize(reviewAttributes.productName2);
		}

		if (reviewAttributes.single) {
			var review = _.extend(reviewAttributes, {
				submitted: now,
				likes1: 0,
				likes1Users: [],
				hornCount: 0,
				hornCountUsers: [],
				product1PricePlaceName : product1PricePlaceName,
				priceNotChecked: true,
				criteriaSuggestions: []
			});
			
			switch (reviewAttributes.category) {
				 case 'camerasreviews':
				 	review = _.extend(reviewAttributes, {
						comparisonCriteria: [
							{
								_id: Random.id(),
								compCriteriaName: "Quality of Picture",
								compCriteriaDescription: "How well the raw picture or video captured looks.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Hardware Features",
								compCriteriaDescription: "The various features already installed on the camera such as default lenses, shutter speed, screen capable of flipping into \"selfie\" mode, and input slots (like for memory cards, usb, etc).",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Software Features",
								compCriteriaDescription: "The various features of the programming already installed on the camera which help film makers and photographers create their work such as autofocus, face tracking, and night-time mode.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Addon Features",
								compCriteriaDescription: "The variety of extra hardware or software that is compatible with the camera. Some examples can include a microphone, tripod stands, and lenses.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							}
						]
					});
					break;
				 case 'phonesreviews':
				 	review = _.extend(reviewAttributes, {
						comparisonCriteria: [
							{
								_id: Random.id(),
								compCriteriaName: "Display",
								compCriteriaDescription: "How clear the picture and graphics look while using the device.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Performance",
								compCriteriaDescription: "How efficiently the device responds to a user's commands. This can include whether the device display \"freezes\" when changing between apps or when opening one up.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Speaker Audio Quality",
								compCriteriaDescription: "How well the device emits sound when music or video is playing without headphones plugged in.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Battery Life",
								compCriteriaDescription: "How long the battery lasts under average user daytime usage.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Addon Features",
								compCriteriaDescription: "Extra hardware or software that is compatible with the device. Examples can include a portable projector attachment, credit card reader, headphones, etc.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							}
						]
					});
					break;
				 case 'computersreviews':
				 	review = _.extend(reviewAttributes, {
						comparisonCriteria: [
							{
								_id: Random.id(),
								compCriteriaName: "Display",
								compCriteriaDescription: "How clear and smooth the graphics look on the monitor display.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Responsiveness/Performance",
								compCriteriaDescription: "How quickly the computer reacts to your inputs like when clicking on an icon to open up a program or switching between two programs. This also includes how well the computer's native programs run.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "User Input Accessability",
								compCriteriaDescription: "How well the computer is fitted for special user input. For example, does it have a cd drive? Does it have an etherent port? Does it have an hdmi port?",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Speaker Audio Quality",
								compCriteriaDescription: "How well the computer emits sound when music or video is playing without headphones plugged in.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Memory/Space",
								compCriteriaDescription: "How many apps, programs, and data the computer can store and continue to function well.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							}
						]
					});
					break;
				 case 'tvsreviews':
				 	review = _.extend(reviewAttributes, {
						comparisonCriteria: [
							{
								_id: Random.id(),
								compCriteriaName: "Accessory Features",
								compCriteriaDescription: "The quality and amount of controls available on remotes that come with the tv or are otherwise compatible with it. This can also include, for example, voice command capability.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "User Input Accessability",
								compCriteriaDescription: "How well the tv is fitted for user input. For example, does it have hdmi ports? Does it have usb ports? Perhaps ports for older technologies if you're looking for that?",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Display",
								compCriteriaDescription: "The picture quality of the movies, shows, and photos you are showing on the tv.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Glare",
								compCriteriaDescription: "How well does the tv filter the lighting in your room?",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Speaker Audio Quality",
								compCriteriaDescription: "How well the tv's built-in-speakers emit sound when movies, shows, or music are playing.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "User Interface",
								compCriteriaDescription: "How well built and easy to use are the tv's on-screen controls, whether you're searching for a channel in the guide or browsing the available apps on the tv.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Software Features",
								compCriteriaDescription: "How well the tv stands in terms of the variety and quality of user customizable features it offers. These could include classic ones such as contrast or brightness as well as more modern ones like dynamic contrast and sound tuning.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							}
						]
					});
					break;
				 case 'consolesreviews':
				 	review = _.extend(reviewAttributes, {
						comparisonCriteria: [
							{
								_id: Random.id(),
								compCriteriaName: "Controller",
								compCriteriaDescription: "The quality of the comfort of the controller in your hand and the placement of the control buttons.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Performance",
								compCriteriaDescription: "How well games run on the console or vr set. This can include such metrics as frame rate and load time.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Graphics",
								compCriteriaDescription: "The clarity and smoothness of picture you get while experiencing play on the console or vr set.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Game Library",
								compCriteriaDescription: "This involves the variety, quantity, and types of games avilable for the console or vr set.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "User Interface",
								compCriteriaDescription: "How well built and easy to use are the console's on-screen controls, whether you're searching for a channel in the guide or browsing the available apps on the tv.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							}
						]
					});
				 	break;
				 case 'gamesreviews':
				 	review = _.extend(reviewAttributes, {
						comparisonCriteria: [
							{
								_id: Random.id(),
								compCriteriaName: "Graphics",
								compCriteriaDescription: "The clarity and smoothness of picture you get while playing the game.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Gameplay Mechanics",
								compCriteriaDescription: "How well you are allowed to control your character, how well the environment responds to your actions, and how well these factors face up to your expectations.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Story/Premise",
								compCriteriaDescription: "The story you, as the player, are taken through or, if the game does not depend strongly on a story, the background or premise on which the game is built. Whether it is a story or just a premise, this is the reason or the goal that you aspire to in the game.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Multiplayer",
								compCriteriaDescription: "How well the game's platform lends itself to a fun interactive experience with numerous players online. This may include, among other factors, the quality of maps in which gameplay takes place.",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Soundtrack",
								compCriteriaDescription: "How well the music played during gameplay complements the experience. For example, does it help motivate when it needs to? Does it help set the mood when it needs to?",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							},
							{
								_id: Random.id(),
								compCriteriaName: "Level of Difficulty",
								compCriteriaDescription: "How the level of difficulty affects your experience. Is it too hard? Just right? Can you customize difficulty settings?",
								submitted: now,
								compCriteriaRatingSum: 0,
								compCriteriaRatesTotal: 0,
								compCriteriaRatesUsers: []
							}
						]
					});
				 	break;
			}
		} else {
			var review = _.extend(reviewAttributes, {
				submitted: now,
				likes1: 0,
				likes2: 0,
				likes1Users: [],
				likes2Users: [],
				hornCount: 0,
				hornCountUsers: [],
				product1PricePlaceName : product1PricePlaceName,
				product2PricePlaceName : product2PricePlaceName,
				priceNotChecked: true,
				criteriaSuggestions: []
			});
			
			switch (reviewAttributes.category) {
				 case 'camerasreviews':
				 	review = _.extend(reviewAttributes, {
						comparisonCriteria: [
							{
								_id: Random.id(),
								compCriteriaName: "Quality of Picture",
								compCriteriaDescription: "How well the raw picture or video captured looks.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Hardware Features",
								compCriteriaDescription: "The various features already installed on the camera such as default lenses, shutter speed, screen capable of flipping into \"selfie\" mode, and input slots (like for memory cards, usb, etc).",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Software Features",
								compCriteriaDescription: "The various features of the programming already installed on the camera which help film makers and photographers create their work such as autofocus, face tracking, and night-time mode.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Addon Features",
								compCriteriaDescription: "The variety of extra hardware or software that is compatible with the camera. Some examples can include a microphone, tripod stands, and lenses.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							}
						]
					});
					break;
				 case 'phonesreviews':
				 	review = _.extend(reviewAttributes, {
						comparisonCriteria: [
							{
								_id: Random.id(),
								compCriteriaName: "Display",
								compCriteriaDescription: "How clear the picture and graphics look while using the device.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Performance",
								compCriteriaDescription: "How efficiently the device responds to a user's commands. This can include whether the device display \"freezes\" when changing between apps or when opening one up.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Speaker Audio Quality",
								compCriteriaDescription: "How well the device emits sound when music or video is playing without headphones plugged in.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Battery Life",
								compCriteriaDescription: "How long the battery lasts under average user daytime usage.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Addon Features",
								compCriteriaDescription: "Extra hardware or software that is compatible with the device. Examples can include a portable projector attachment, credit card reader, headphones, etc.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							}
						]
					});
					break;
				 case 'computersreviews':
				 	review = _.extend(reviewAttributes, {
						comparisonCriteria: [
							{
								_id: Random.id(),
								compCriteriaName: "Display",
								compCriteriaDescription: "How clear and smooth the graphics look on the monitor display.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Responsiveness/Performance",
								compCriteriaDescription: "How quickly the computer reacts to your inputs like when clicking on an icon to open up a program or switching between two programs. This also includes how well the computer's native programs run.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "User Input Accessability",
								compCriteriaDescription: "How well the computer is fitted for special user input. For example, does it have a cd drive? Does it have an etherent port? Does it have an hdmi port?",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Speaker Audio Quality",
								compCriteriaDescription: "How well the computer emits sound when music or video is playing without headphones plugged in.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Memory/Space",
								compCriteriaDescription: "How many apps, programs, and data the computer can store and continue to function well.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							}
						]
					});
					break;
				 case 'tvsreviews':
				 	review = _.extend(reviewAttributes, {
						comparisonCriteria: [
							{
								_id: Random.id(),
								compCriteriaName: "Accessory Features",
								compCriteriaDescription: "The quality and amount of controls available on remotes that come with the tv or are otherwise compatible with it. This can also include, for example, voice command capability.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "User Input Accessability",
								compCriteriaDescription: "How well the tv is fitted for user input. For example, does it have hdmi ports? Does it have usb ports? Perhaps ports for older technologies if you're looking for that?",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Display",
								compCriteriaDescription: "The picture quality of the movies, shows, and photos you are showing on the tv.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Glare",
								compCriteriaDescription: "How well does the tv filter the lighting in your room?",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Speaker Audio Quality",
								compCriteriaDescription: "How well the tv's built-in-speakers emit sound when movies, shows, or music are playing.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "User Interface",
								compCriteriaDescription: "How well built and easy to use are the tv's on-screen controls, whether you're searching for a channel in the guide or browsing the available apps on the tv.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Software Features",
								compCriteriaDescription: "How well the tv stands in terms of the variety and quality of user customizable features it offers. These could include classic ones such as contrast or brightness as well as more modern ones like dynamic contrast and sound tuning.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							}
						]
					});
					break;
				 case 'consolesreviews':
				 	review = _.extend(reviewAttributes, {
						comparisonCriteria: [
							{
								_id: Random.id(),
								compCriteriaName: "Controller",
								compCriteriaDescription: "The quality of the comfort of the controller in your hand and the placement of the control buttons.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Performance",
								compCriteriaDescription: "How well games run on the console or vr set. This can include such metrics as frame rate and load time.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Graphics",
								compCriteriaDescription: "The clarity and smoothness of picture you get while experiencing play on the console or vr set.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Game Library",
								compCriteriaDescription: "This involves the variety, quantity, and types of games avilable for the console or vr set.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "User Interface",
								compCriteriaDescription: "How well built and easy to use are the console's on-screen controls, whether you're searching for a channel in the guide or browsing the available apps on the tv.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							}
						]
					});
				 	break;
				 case 'gamesreviews':
				 	review = _.extend(reviewAttributes, {
						comparisonCriteria: [
							{
								_id: Random.id(),
								compCriteriaName: "Graphics",
								compCriteriaDescription: "The clarity and smoothness of picture you get while playing the game.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Gameplay Mechanics",
								compCriteriaDescription: "How well you are allowed to control your character, how well the environment responds to your actions, and how well these factors face up to your expectations.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Story/Premise",
								compCriteriaDescription: "The story you, as the player, are taken through or, if the game does not depend strongly on a story, the background or premise on which the game is built. Whether it is a story or just a premise, this is the reason or the goal that you aspire to in the game.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Multiplayer",
								compCriteriaDescription: "How well the game's platform lends itself to a fun interactive experience with numerous players online. This may include, among other factors, the quality of maps in which gameplay takes place.",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Soundtrack",
								compCriteriaDescription: "How well the music played during gameplay complements the experience. For example, does it help motivate when it needs to? Does it help set the mood when it needs to?",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							},
							{
								_id: Random.id(),
								compCriteriaName: "Level of Difficulty",
								compCriteriaDescription: "How the level of difficulty affects your experience. Is it too hard? Just right? Can you customize difficulty settings?",
								submitted: now,
								compCriteriaVotes1: 0,
								compCriteriaVotes2: 0,
								compCriteriaVotes1Users: [],
								compCriteriaVotes2Users: [],
								compCritPicUrl1: reviewAttributes.picUrl1,
								compCritPicUrl2: reviewAttributes.picUrl2
							}
						]
					});
					break;
				}
			}

		var reviewId = Mongo.Collection.get(collection).insert(review);
		
		var collectionComments = collection + 'comments';
		Mongo.Collection.get(collectionComments).insert({
			_id: reviewId, 
			comments1: [],
			comments2: [],
			commentsLack: []
		});
		
		if(reviewAttributes.single){
			var spellCheckQuery = {};
			spellCheckQuery['reviewId'] = reviewId;
			spellCheckQuery['revTitleBit'] = reviewAttributes.productName1;
			spellCheckQuery['language'] = reviewAttributes.language;
			spellCheckQuery['price1'] = reviewAttributes.product1Price;
			spellCheckQuery['price2'] = reviewAttributes.product1Price;
			//price1 and price2 exist for search purposes and are to remain the same in individual spellcheck documents
			
			SpellCheck.insert(spellCheckQuery);
		} else {
			var spellCheckQuery1 = {};
			spellCheckQuery1['reviewId'] = reviewId;
			spellCheckQuery1['revTitleBit'] = reviewAttributes.productName1;
			spellCheckQuery1['language'] = reviewAttributes.language;
			spellCheckQuery1['price1'] = reviewAttributes.product1Price;
			spellCheckQuery1['price2'] = reviewAttributes.product1Price;
			//price1 and price2 exist for search purposes and are to remain the same in individual spellcheck documents
			var spellCheckQuery2 = {};
			spellCheckQuery2['reviewId'] = reviewId;
			spellCheckQuery2['revTitleBit'] = reviewAttributes.productName2;
			spellCheckQuery2['language'] = reviewAttributes.language;
			spellCheckQuery2['price1'] = reviewAttributes.product2Price;
			spellCheckQuery2['price2'] = reviewAttributes.product2Price;
			//price1 and price2 exist for search purposes and are to remain the same in individual spellcheck documents
			
			SpellCheck.insert(spellCheckQuery1);
			SpellCheck.insert(spellCheckQuery2);
		}
		
		var searchIndexQuery;

		if(reviewAttributes.single){
			searchIndexQuery = {};
			searchIndexQuery['_id'] = reviewId;
			searchIndexQuery['single'] = true;
			searchIndexQuery['language'] = reviewAttributes.language,
			searchIndexQuery['revTitle1'] = reviewAttributes.productName1;
			searchIndexQuery['category'] = collection;
			searchIndexQuery['revPicUrl1'] = reviewAttributes.picUrl1;
			searchIndexQuery['submitted'] = now;
			searchIndexQuery['likes1'] = 0;
			searchIndexQuery['likes2'] = 0;
			//the likes2 key within single review documents in the search index is never changing - no method exists to accomplish that. it only exists for sorting purposes in search results
			searchIndexQuery['trendingCount'] = 0;
			searchIndexQuery['trendingUpdate'] = todayDate;
			searchIndexQuery['hornCount'] = 0;
			searchIndexQuery['price1'] = reviewAttributes.product1Price;
			searchIndexQuery['price2'] = reviewAttributes.product1Price;
			//price1 and price2 exist for search purposes and are to remain the same in single
			
			SearchIndex.insert(searchIndexQuery);
		} else {
			searchIndexQuery = {};
			searchIndexQuery['_id'] = reviewId;
			searchIndexQuery['single'] = false;
			searchIndexQuery['language'] = reviewAttributes.language,
			searchIndexQuery['revTitle1'] = reviewAttributes.productName1;
			searchIndexQuery['revTitle2'] = reviewAttributes.productName2;
			searchIndexQuery['category'] = collection;
			searchIndexQuery['revPicUrl1'] = reviewAttributes.picUrl1;
			searchIndexQuery['revPicUrl2'] = reviewAttributes.picUrl2;
			searchIndexQuery['submitted'] = now;
			searchIndexQuery['likes1'] = 0;
			searchIndexQuery['likes2'] = 0;
			searchIndexQuery['trendingCount'] = 0;
			searchIndexQuery['trendingUpdate'] = now.getDate() + '-' + now.getMonth() + '-' + now.getFullYear();
			searchIndexQuery['hornCount'] = 0;
			searchIndexQuery['price1'] = reviewAttributes.product1Price;
			searchIndexQuery['price2'] = reviewAttributes.product2Price;
			
			SearchIndex.insert(searchIndexQuery);
		}

		if (reviewAttributes.single) {
			Meteor.users.update({_id: 'coftxS5cw7XjcfTNd'}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "New Review - " + reviewId + ' - ' + reviewAttributes.single + ' - ' + reviewAttributes.category + ' - ' + reviewAttributes.productName1 + ' - ' + reviewAttributes.picUrl1}}});
		} else {
			Meteor.users.update({_id: 'coftxS5cw7XjcfTNd'}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "New Review - " + reviewId + ' - ' + reviewAttributes.single + ' - ' + reviewAttributes.category + ' - ' + reviewAttributes.productName1 + ' - ' + reviewAttributes.productName2 + ' - ' + reviewAttributes.picUrl1 + ' - ' + reviewAttributes.picUrl2}}});
		}

		return {
			_id: reviewId
		};
	},
	
	//Trending Page Methods
	
	hasMoreTrendingMethod: function(language, trendingPostsLimit) {
		check(language, String);
		check(trendingPostsLimit, Number);
		
		if (language === 'en' || language === 'pl') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('hasMoreTrendingMethod - lang misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		let trendingCollection;

		let date = new Date();
		date = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();

		if(Meteor.user() && Meteor.user().profile.trendingPreferences) {
			//let finalUserPrefs = [];
			//artifact from development features

			/*for(var i=0; i < Meteor.user().profile.trendingPreferences.length; i++){
				finalUserPrefs.push(Meteor.user().profile.trendingPreferences[i]);
			}*/
			
			let query = {};
			query['$query'] = {};
			//query['$query']['category'] = {};  
			//query['$query']['category']['$in'] = finalUserPrefs;
			query['$query']['trendingUpdate'] = date;
			query['$query']['trendingCount'] = {};
			query['$query']['trendingCount']['$gte'] = 5;
			query['$query']['language'] = language;
			
			let options = {};
			options['sort'] = {};
			options['sort']['trendingCount'] = -1;

			trendingCollectionLength = SearchIndex.find(query).fetch().length;
			
			if (trendingPostsLimit < trendingCollectionLength) {
				return true;
				//indicate that more posts exist
			} else {
				return false;
			}
		} else {
			let query = {};
			query['$query'] = {};
			query['$query']['trendingUpdate'] = date;
			query['$query']['trendingCount'] = {};
			query['$query']['trendingCount']['$gte'] = 5;
			query['$query']['language'] = language;
			
			let options = {};
			options['sort'] = {};
			options['sort']['trendingCount'] = -1;
			
			trendingCollectionLength = SearchIndex.find(query).fetch().length;

			if (trendingPostsLimit < trendingCollectionLength) {
				return true;
				//indicate that more posts exist
			} else {
				return false;
			}
		}
	},
	
	//Review Page Methods
	
	isMaxSugReached: function(collection, reviewId) {
		check(collection, String);
		check(reviewId, String);
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid malevolent action but assume innocence
			console.log('isMaxSugReached - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
		
		var review = Mongo.Collection.get(collection).find({_id: reviewId}).fetch();
		
		if (review[0]['criteriaSuggestions'].length > 19) {
			return true;
		}
	},
	
	newCriteriaSubmit: function(collection, reviewId, newCriteria, newCriteriaDescription) {
		check(collection, String);
		check(reviewId, String);
		check(newCriteria, String);
		check(newCriteriaDescription, String);
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid malevolent action but assume innocence
			console.log('newCriteriaSubmit - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if(!Meteor.user()) {
			throw new Meteor.Error("Logged-Out", "Sorry! You have to be logged in to suggest a new criteria.");
		}
		
		var review = Mongo.Collection.get(collection).find({_id: reviewId}).fetch();
		
		if (review[0]['criteriaSuggestions'].length > 19) {
			throw new Meteor.Error("Max Exceeded", "Sorry! The maximum number of criteria suggestions allowed has been reached.");
		}
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
 		
 		if (reviewId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your review Id to greater than 0 characters.");
 		}
 		//to secure against a database-wide update
		
		if (newCriteria.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your criteria suggestion to 50 characters.");
		}

		if (!newCriteria.replace(/\s/g, '').length || 
		 		newCriteria === '' ) {
			throw new Meteor.Error("Incomplete Form", "Sorry - your suggestion couldn't be saved because no criteria text was received. Please submit a criteria suggestion with full content.");
		}
		
		if (newCriteriaDescription.length > 300) {
			throw new Meteor.Error("Too long", "Please limit your criteria description to 300 characters.");
		}

		if (!newCriteriaDescription.replace(/\s/g, '').length || 
		 		newCriteriaDescription === '' ) {
			throw new Meteor.Error("Incomplete Form", "Sorry - your suggestion couldn't be saved because no description text was received. Please submit a criteria suggestion with a description.");
		}
		
		var submitted = new Date();
		
		var user = Meteor.user();
		
		var criteriaSet = {
			criteriaSuggestion: newCriteria,
			criteriaDescription: newCriteriaDescription,
			userId: user._id,
			submitted: submitted,
			_id: Random.id(),
			upvotes: 0,
			upvoteUsers: []
		};
		
		var set = {};
		set['criteriaSuggestions'] = criteriaSet;
		 
		Mongo.Collection.get(collection).update({_id: reviewId}, {$push: set});
	},
	
	isHighlightedBullHorn: function(collection, reviewId, userStatus) {
		check(collection, String);
		check(reviewId, String);
		check(userStatus, Match.Maybe(String));
		//userStatus only used to force reactivity. not utilized anywhere in code
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid malevolent action but assume innocence
			console.log('isHighlightedBullHorn - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		let user = this.userId;
		
		if (!user) {
			return;
		} //return to avoid unnecessary errors
		
		let querySelector = {};
		let querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;
		
		let review = Mongo.Collection.get(collection).find(querySelector).fetch();

		let hornCountUsersArray = review[0]['hornCountUsers'];
	
		for (var i = 0; i < hornCountUsersArray.length; i++) {
			if (hornCountUsersArray[i] == user) {
				return 'active'; //signifies active vote button
			}
		}
		
		return;
		//if no user found, return nothing
	},
	
	isInTrending: function(currentLangLabel, reviewId) {
		check(currentLangLabel, String);
		check(reviewId, String);
		
		if (currentLangLabel === 'en' || currentLangLabel === 'pl') {
			//proceed
		} else {
			//else exit to avoid malevolent action but assume innocence
			console.log('isInTrending - lang misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the review Id entry to 50 characters.");
 		}
	
		let date = new Date();
		date = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
	
		let query = {};
		query['$query'] = {};
		query['$query']['language'] = currentLangLabel;
		query['$query']['hornDay'] = date;
		
		let searchindex = SearchIndex.find(query).fetch();
		
		for (var i = 0; i < searchindex.length; i++) {
			if (searchindex[i]['_id'] == reviewId) {
				return true;
			}
		}
	},
	
	getAuthorName: function(commentId, commentsGroup, collection, reviewId) {
		check(commentId, String);
		check(commentsGroup, String);
		check(collection, String);
		check(reviewId, String);
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid malevolent action but assume innocence
			console.log('getAuthorName - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (commentId === '' || reviewId === '') {
			return;
		} //to avoid unnecessary operations
		
		if (commentId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the snippet Id entry to 50 characters.");
 		}
 		
 		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the review Id entry to 50 characters.");
 		}
		
		if (commentsGroup === 'comments1' || commentsGroup === 'comments2' || commentsGroup === 'commentsLack') {
			//proceed
		} else {
			//else exit to avoid malevolent action but assume innocence
			console.log('getAuthorName - commentsGroup misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		collection += 'comments';
		
		var querySelector = {};
		var querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;
		
		var projection = {};
		projection['fields'] = {};
		projection['fields'][commentsGroup] = {};
		projection['fields'][commentsGroup]['$elemMatch'] = {};
		projection['fields'][commentsGroup]['$elemMatch']['_id'] = commentId;
		
		var variable = Mongo.Collection.get(collection).find(querySelector, projection).fetch();

		var userIdFound = variable[0][commentsGroup][0]['userId'];
		
		return Meteor.users.find({_id: userIdFound}).fetch()[0]['profile']['name'];
	},
	
	checkOwner: function(commentId, commentsGroup, collection, reviewId, userStatus) {
		check(commentId, String);
		check(commentsGroup, String);
		check(collection, String);
		check(reviewId, String);
		check(userStatus, Match.Maybe(String));
		//userStatus only used to force reactivity. not utilized anywhere in code
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unecessary errors
			console.log('checkOwner - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (commentId === '' || reviewId === '') {
			return;
		} //to avoid unnecessary operations
		
		if (commentId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the snippet Id entry to 50 characters.");
 		}
 		
 		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the review Id entry to 50 characters.");
 		}
		
		if (commentsGroup === 'comments1' || commentsGroup === 'comments2' || commentsGroup === 'commentsLack') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('checkOwner - commentsGroup misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		var userId = this.userId;
		
		if(!userId) {
			return false;
		} //return to avoid unnecessary errors
		
		collection += 'comments';
		
		var querySelector = {};
		var querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;
		
		var projection = {};
		projection['fields'] = {};
		projection['fields'][commentsGroup] = {};
		projection['fields'][commentsGroup]['$elemMatch'] = {};
		projection['fields'][commentsGroup]['$elemMatch']['_id'] = commentId;
		
		var variable = Mongo.Collection.get(collection).find(querySelector, projection).fetch();
		
		if (userId === variable[0][commentsGroup][0]['userId']) {
			return true;
		} else {
			return false;
		}
	},
	
	bullHornAdd: function(collection, reviewId, single) {
		check(collection, String);
		check(reviewId, String);
		check(single, Boolean);

		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('bullHornAdd - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible

		let user = this.userId;
		
		if (!user) {
			throw new Meteor.Error("Logged-Out", "Sorry! You have to be logged in to bullhorn reviews.");
		}

		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
 		
 		if (reviewId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your review Id to greater than 0 characters.");
 		}

		let querySelector = {};
		let querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;
		
		let increment = {};
		increment['hornCount'] = {};
		increment['hornCount'] = 1;
	
		let decrement = {};
		decrement['hornCount'] = {};
		decrement['hornCount'] = -1;

		let review = Mongo.Collection.get(collection).find(querySelector).fetch();
		
		let projection = {};
		let hornGroup = 'hornCountUsers';
		projection[hornGroup] = {};
		projection[hornGroup] = user;

		let hornUsersArray = review[0]['hornCountUsers'];

		let today = new Date();

		let todayDate = today.getDate() + '-' + today.getMonth() + '-' + today.getFullYear();

		for (var i = 0; i < hornUsersArray.length; i++) {
			if (hornUsersArray[i] === user) {
				Mongo.Collection.get(collection).update(querySelector, {$pull: projection});
				//remove user from voting record
		
				if (review[0]['hornCount'] >= 1) {
					Mongo.Collection.get(collection).update(querySelector, {$inc: decrement});
					//decrement horn votes but don't let hornCount go below 0
				
					SearchIndex.update(querySelector, {$inc: decrement});
					//decrement horn votes in the search index but don't let hornCount go below 0
				}
				
				Meteor.users.update({_id: user}, {$pull: {'profile.bullHornReviews': {_id: reviewId}}}, function(error) {
					if (error) {
						console.log('bullHornAdd - ' + error);
						throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
					}
				});
				//pull the review from the user's horn panel

				return false; //signifies neutral bullhorn button and exits for loop (to not waste resources) 
				//and method (to prevent vote addition protocol from running)
			}
		}

		//if user cannot be found, allow vote

			//But, first set up for account page bullhorn panel addition
				let searchIndexReview = SearchIndex.find({_id: reviewId}).fetch();

				let searchIndexReviewBullHorn;
		
				if (single) {
					searchIndexReviewBullHorn = {
						single: true,
						revTitle1: searchIndexReview[0]['revTitle1'],
						revPicUrl1: searchIndexReview[0]['revPicUrl1'],
						category: searchIndexReview[0]['category'],
						_id: searchIndexReview[0]['_id'],
						hasNotifications: false
					}
				} else {
					searchIndexReviewBullHorn = {
						single: false,
						revTitle1: searchIndexReview[0]['revTitle1'],
						revTitle2: searchIndexReview[0]['revTitle2'],
						revPicUrl1: searchIndexReview[0]['revPicUrl1'],
						revPicUrl2: searchIndexReview[0]['revPicUrl2'],
						category: searchIndexReview[0]['category'],
						_id: searchIndexReview[0]['_id'],
						hasNotifications: false
					}
				}

				Mongo.Collection.get(collection).update(querySelector, {$push: projection});
				//record user as having voted
				
				if (review[0]['hornCount'] < 5) {
					//increment horn votes but only if current count is below upper limit...
							
					Mongo.Collection.get(collection).update(querySelector, {$inc: increment});
					//increment horn votes
			
					SearchIndex.update(querySelector, {$inc: increment});
					//increment horn votes in the search index
				} else {
					//else the hornCount must be at 5 and the next horn vote would be 6, crossing the mark 
					//necessary to qualify for trending. To avoid unnecessary operations, skip the horn vote 
					//inc to 6 (since it would be reset anyway) and instead place trending qualifications
					
					SearchIndex.update(querySelector, {$set: {'hornDay': todayDate, 'hornTime': today, 'hornCount': 0}});
					//hornTime set to keep constantly popular posts on top
					Mongo.Collection.get(collection).update(querySelector, {$set: {'hornCount': 0}});
				}
				
				Meteor.users.update({_id: user}, {$push: {'profile.bullHornReviews': searchIndexReviewBullHorn}}, function(error) {
					if (error) {
						console.log('bullHornAdd - ' + error);
						throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
					}
				});
				//push the review into the user's horn panel for future following

				return true; //signifies highlighted bullhorn button
	},
	
	lastRating: function(collection, reviewId, criteriaId, userStatus) {
		check(collection, String);
		check(reviewId, String);
		check(criteriaId, String);
		check(userStatus, Match.Maybe(String));
		//userStatus only used to force reactivity. not utilized anywhere in code
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('lastRating - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		var user = this.userId;
		
		if(!user) {
			return;
		} //return to avoid unnecessary errors
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
 		
 		if (criteriaId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the criteria Id entry to 50 characters.");
 		}
 		
 		var querySelector = {};
		var querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;
		var querySelectorThirdField;
		querySelectorThirdField = 'comparisonCriteria._id';
		querySelector[querySelectorThirdField] = criteriaId;
		
		var Collection = Mongo.Collection.get(collection).find(querySelector).fetch();

		var criteriaCollection = Collection[0]['comparisonCriteria'];
		
		for (var i = 0; i < criteriaCollection.length; i++) {
			if (criteriaCollection[i]['_id'] === criteriaId) {
				var no = i;
			}
		};
	
		//proceed with rating find
		var criteriaRatesUsersArray = Collection[0]['comparisonCriteria'][no]['compCriteriaRatesUsers'];

		for (var i = 0; i < criteriaRatesUsersArray.length; i++) {
			if (criteriaRatesUsersArray[i]['user'] === user) {
				return criteriaRatesUsersArray[i]['lastRate'];
			}
		}
	},
	
	revLike: function(collection, reviewId, single, likes) {
		check(collection, String);
		check(reviewId, String);
		check(single, Boolean);
		check(likes, String);
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('revLike - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (likes === 'likes1' || likes === 'likes2') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('revLike - likes misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		
		var user = this.userId;
		
		if (!user) {
			throw new Meteor.Error("Logged-Out", "Sorry! You have to be logged in to indicate recommendations on reviews.");
		}
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
		
		if (reviewId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your review Id to greater than 0 characters.");
 		}
		
		var querySelector = {};
		var querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;
		
		var increment = {};
		increment[likes] = {};
		increment[likes] = 1;
	
		var decrement = {};
		decrement[likes] = {};
		decrement[likes] = -1;
	
		var review = Mongo.Collection.get(collection).find(querySelector).fetch();

		var likesUsersArray;
		
		var submitted = new Date();
		
		var siReview = SearchIndex.find({_id: reviewId}).fetch();
		var siDate = submitted.getDate() + '-' + submitted.getMonth() + '-' + submitted.getFullYear();
		
		if (single) {
			var projection = {};
			var likesGroup = 'likes1Users';
			projection[likesGroup] = {};
			projection[likesGroup] = user;
		
			likesUsersArray = review[0]['likes1Users'];
			
			for (var i = 0; i < likesUsersArray.length; i++) {
				if (likesUsersArray[i] === user) {
					if (siReview[0]['trendingUpdate'] === siDate) {
						if (siReview[0]['trendingCount'] == 0) {
							//do not push below 0 - proceed further
						} else {
							SearchIndex.update({_id: reviewId}, { $inc: { 'trendingCount': -1}});
						}
					} else {
						SearchIndex.update({_id: reviewId}, { $set: {'trendingUpdate': siDate, 'trendingCount': 0} });
					};
					//to prevent spamming abuse to get onto trending page
					
					Mongo.Collection.get(collection).update(querySelector, {$pull: projection});
					//remove user from voting record
			
					Mongo.Collection.get(collection).update(querySelector, {$inc: decrement});
					//decrement likes
				
					SearchIndex.update(querySelector, {$inc: decrement});
					//decrement likes in the search index
					
				return false; //signifies neutral like button and exits for loop (to not waste resources) and
				//method to prevent unnecessary operations
				} 
			}
	
			//if user cannot be found, allow vote
	
					Mongo.Collection.get(collection).update(querySelector, {$push: projection});
					//record user as having voted
			
					Mongo.Collection.get(collection).update(querySelector, {$inc: increment});
					//increment likes
				
					SearchIndex.update(querySelector, {$inc: increment});
					//increment likes in the search index
	
					if (siReview[0]['trendingUpdate'] === siDate) {
						SearchIndex.update({_id: reviewId}, { $inc: { 'trendingCount': 1}});
					} else {
						SearchIndex.update({_id: reviewId}, { $set: {'trendingUpdate': siDate, 'trendingCount': 1} });
					};
					//include for trending activity
	
					return true; //signifies highlighted upvote button and exits method to prevent 
					//unnecessary operations
					
		} else {

			var projection = {};
			var likesGroup;
			if (likes === 'likes1') {
				likesGroup = 'likes1Users';
			} else if (likes === 'likes2') {
				likesGroup = 'likes2Users';
			}
			projection[likesGroup] = {};
			projection[likesGroup] = user;
	
			if (likes === 'likes1') {
				likesUsersArray = review[0]['likes2Users'];
			} else if (likes === 'likes2') {
				likesUsersArray = review[0]['likes1Users'];
			}
			//set up to see if user has already indicated a recommendation preference

			for (var i = 0; i < likesUsersArray.length; i++) {
				if (likesUsersArray[i] === user) {
					throw new Meteor.Error("You've already voted", "If you wish to change your recommendation, click on your original choice's recommend button to cancel that vote and then vote for your new choice.");
				}
			}
			//check if in other array. If not, proceed. Otherwise, exit with error.
		
			if (likes === 'likes1') {
				likesUsersArray = review[0]['likes1Users'];
			} else if (likes === 'likes2') {
				likesUsersArray = review[0]['likes2Users'];
			}
			//switch back for the rest of the method
		
			for (var i = 0; i < likesUsersArray.length; i++) {
				if (likesUsersArray[i] === user) {
					if (siReview[0]['trendingUpdate'] === siDate) {
						if (siReview[0]['trendingCount'] == 0) {
							//do not push below 0 - proceed further
						} else {
							SearchIndex.update({_id: reviewId}, { $inc: { 'trendingCount': -1}});
						}
					} else {
						SearchIndex.update({_id: reviewId}, { $set: {'trendingUpdate': siDate, 'trendingCount': 0} });
					};
					//to prevent spamming abuse to get onto trending page
					
					Mongo.Collection.get(collection).update(querySelector, {$pull: projection});
					//remove user from voting record
			
					Mongo.Collection.get(collection).update(querySelector, {$inc: decrement});
					//decrement likes
				
					SearchIndex.update(querySelector, {$inc: decrement});
					//decrement likes in the search index
								
				return false; //signifies neutral like button and exits method to prevent 
				//unnecessary operations
				} 
			}
	
			//if user cannot be found, allow vote
	
					Mongo.Collection.get(collection).update(querySelector, {$push: projection});
					//record user as having voted
			
					Mongo.Collection.get(collection).update(querySelector, {$inc: increment});
					//increment likes
				
					SearchIndex.update(querySelector, {$inc: increment});
					//increment likes in the search index

					if (siReview[0]['trendingUpdate'] === siDate) {
						SearchIndex.update({_id: reviewId}, { $inc: { 'trendingCount': 1}});
					} else {
						SearchIndex.update({_id: reviewId}, { $set: {'trendingUpdate': siDate, 'trendingCount': 1} });
					};
					//include for trending activity

					return true; //signifies highlighted upvote button and exits method to prevent 
					//unnecessary operations
		}
	},
	
	isHighlightedLike: function(collection, reviewId, single, userStatus) {
		check(collection, String);
		check(reviewId, String);
		check(single, Boolean);
		check(userStatus, Match.Maybe(String));
		//userStatus only used to force reactivity. not utilized anywhere in code
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('isHighlightedLike - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		var user = this.userId;
		
		if(!user) {
			return;
		} //return to avoid unnecessary errors
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
		
		var querySelector = {};
		var querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;
		
		var review = Mongo.Collection.get(collection).find(querySelector).fetch();
		
		if (single) {
		
			var likesUsers1Array = review[0]['likes1Users'];

			for (var i = 0; i < likesUsers1Array.length; i++) {
				if (likesUsers1Array[i] === user) {
					return 'likes1'; //signifies active vote button
				}
			}

			return;
			//if no user found, return nothing
			
		} else {
		
			var likesUsers1Array = review[0]['likes1Users'];
		
			var likesUsers2Array = review[0]['likes2Users'];
		
		
			for (var i = 0; i < likesUsers1Array.length; i++) {
				if (likesUsers1Array[i] === user) {
					return 'likes1'; //signifies active vote button
				}
			}
		
			for (var i = 0; i < likesUsers2Array.length; i++) {
				if (likesUsers2Array[i] === user) {
					return 'likes2'; //signifies active vote button
				}
			}
			
			return;
			//if no user found, return nothing
						
		}
	},
	
	whichHighlightedCompBtn: function(collection, reviewId, criteriaId, userStatus) {
		check(collection, String);
		check(reviewId, String);
		check(criteriaId, String);
		check(userStatus, Match.Maybe(String));
		//userStatus only used to force reactivity. not utilized anywhere in code

		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('whichHighlightedCompBtn - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible

		if (reviewId === '' || criteriaId === '') {
			return;
		} //to avoid unnecessary operations

		var user = this.userId;
		
		if(!user) {
			return;
		} //return to avoid unnecessary errors
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
		
		if (criteriaId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the criteria Id entry to 50 characters.");
 		}
 		
		var querySelector = {};
		var querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;
		var querySelectorThirdField;
		querySelectorThirdField = 'comparisonCriteria._id';
		querySelector[querySelectorThirdField] = criteriaId;
		
		var projection = {};
		var cGroup;
		cGroup = 'comparisonCriteria.$.compCriteriaVotes1Users'; 
		projection[cGroup] = {};
		projection[cGroup] = user;

		var fetchedCollection = Mongo.Collection.get(collection).find(querySelector).fetch();

		var criteriaCollection = fetchedCollection[0]['comparisonCriteria'];
		
		for (var i = 0; i < criteriaCollection.length ; i++) {
			if (criteriaCollection[i]['_id'] === criteriaId) {
				var no = i;
			}			
		}
		
		var criteria1UsersArray = fetchedCollection[0]['comparisonCriteria'][no]['compCriteriaVotes1Users'];

		for (var i = 0; i < criteria1UsersArray.length; i++) {
			if (criteria1UsersArray[i] === user) {
				return true; //signifies active left product vote button
			}
		}
		
		
		//otherwise, if no user found, search the other product's user array
		
		projection = {};
		cGroup = 'comparisonCriteria.$.compCriteriaVotes2Users'; 
		projection[cGroup] = {};
		projection[cGroup] = user;

		var fetchedCollection = Mongo.Collection.get(collection).find(querySelector).fetch();

		var criteriaCollection = fetchedCollection[0]['comparisonCriteria'];
		
		for (var i = 0; i < criteriaCollection.length ; i++) {
			if (criteriaCollection[i]['_id'] === criteriaId) {
				var no = i;
			}			
		}
		
		var criteria2UsersArray = fetchedCollection[0]['comparisonCriteria'][no]['compCriteriaVotes2Users'];

		for (var i = 0; i < criteria2UsersArray.length; i++) {
			if (criteria2UsersArray[i] === user) {
				return false; //signifies active right product vote button
			}
		}
		
				return;
				//if no user found, return nothing			
	},
	
	criteriaVote: function(collection, reviewId, criteriaId, criteria1Boolean) {
		check(collection, String);
		check(reviewId, String);
		check(criteriaId, String);
		check(criteria1Boolean, Boolean);
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('criteriaVote - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		var user = this.userId;
		
		if (!user) {
			throw new Meteor.Error("Logged-Out", "Sorry! You have to be logged in to vote on products.");
		}
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
 		
 		if (criteriaId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the criteria id to 50 characters.");
 		}
 		
 		if (reviewId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your review Id to greater than 0 characters.");
 		}
 		
 		if (criteriaId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your criteria Id to greater than 0 characters.");
 		}
 		
 		var submitted = new Date();
		
		var siReview = SearchIndex.find({_id: reviewId}).fetch();
		var siDate = submitted.getDate() + '-' + submitted.getMonth() + '-' + submitted.getFullYear();
		
		var querySelector = {};
		var querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;
		var querySelectorThirdField;
		querySelectorThirdField = 'comparisonCriteria._id';
		querySelector[querySelectorThirdField] = criteriaId;
		
		
		if (criteria1Boolean) {
			var projection = {};
			var cGroup;
			cGroup = 'comparisonCriteria.$.compCriteriaVotes1Users';
			projection[cGroup] = {};
			projection[cGroup] = user;

			var increment = {};
			var cGroupVotes;
			cGroupVotes = 'comparisonCriteria.$.compCriteriaVotes1';
			increment[cGroupVotes] = {};
			increment[cGroupVotes] = 1;
		
			var decrement = {};
			decrement[cGroupVotes] = {};
			decrement[cGroupVotes] = -1;
			
			var Collection = Mongo.Collection.get(collection).find(querySelector).fetch();

			var criteriaCollection = Collection[0]['comparisonCriteria'];
			
			for (var i = 0; i < criteriaCollection.length; i++) {
				if (criteriaCollection[i]['_id'] === criteriaId) {
					var no = i;
				}			
			};

			//Check to see if user has already voted in this criteria
			var criteria2UsersArray = Collection[0]['comparisonCriteria'][no]['compCriteriaVotes2Users'];
		
			for (var i = 0; i < criteria2UsersArray.length; i++) {
				if (criteria2UsersArray[i] === user) {
					throw new Meteor.Error("You've already voted on this criteria", "If you wish to change your vote, click on your original choice's vote button to cancel that vote and then select your new choice.");
				}
			}
		
			//proceed with voting administration
			var criteria1UsersArray = Collection[0]['comparisonCriteria'][no]['compCriteriaVotes1Users'];

			for (var i = 0; i < criteria1UsersArray.length; i++) {
				if (criteria1UsersArray[i] === user) {
					if (siReview[0]['trendingUpdate'] === siDate) {
						if (siReview[0]['trendingCount'] == 0) {
							//do not push below 0 - proceed further
						} else {
							SearchIndex.update({_id: reviewId}, { $inc: { 'trendingCount': -1}});
						}
					} else {
						SearchIndex.update({_id: reviewId}, { $set: {'trendingUpdate': siDate, 'trendingCount': 0} });
					};
					//to prevent spamming abuse to get onto trending page
					
					Mongo.Collection.get(collection).update(querySelector, {$pull: projection});
					//remove user from voting record
				
					Mongo.Collection.get(collection).update(querySelector, {$inc: decrement});
					//decrement votes
				
					//var goAheadForNotification;
				
				return false; //signifies neutral criteria vote button
				//exit method with return so that following push does not occur
				}
			}
		
			//if user cannot be found, allow vote
		
				Mongo.Collection.get(collection).update(querySelector, {$push: projection});
				//record user as having voted
				
				Mongo.Collection.get(collection).update(querySelector, {$inc: increment});
				//increment votes
				
				
				if (siReview[0]['trendingUpdate'] === siDate) {
					SearchIndex.update({_id: reviewId}, { $inc: { 'trendingCount': 1}});
				} else {
					SearchIndex.update({_id: reviewId}, { $set: {'trendingUpdate': siDate, 'trendingCount': 1} });
				};
				//include for trending activity
				
				//var goAheadForNotification;
	
				return true; //signifies highlighted criteria vote button
		} else {
			//else, if criteria1Boolean is false, move over to product 2
		
			var projection = {};
			var cGroup;
			cGroup = 'comparisonCriteria.$.compCriteriaVotes2Users';
			projection[cGroup] = {};
			projection[cGroup] = user;

			var increment = {};
			var cGroupVotes;
			cGroupVotes = 'comparisonCriteria.$.compCriteriaVotes2';
			increment[cGroupVotes] = {};
			increment[cGroupVotes] = 1;
		
			var decrement = {};
			decrement[cGroupVotes] = {};
			decrement[cGroupVotes] = -1;
			
			var Collection = Mongo.Collection.get(collection).find(querySelector).fetch();

			var criteriaCollection = Collection[0]['comparisonCriteria'];
			
			for (var i = 0; i < criteriaCollection.length; i++) {
				if (criteriaCollection[i]['_id'] === criteriaId) {
					var no = i;
				}			
			};

			//Check to see if user has already voted in this criteria
			var criteria1UsersArray = Collection[0]['comparisonCriteria'][no]['compCriteriaVotes1Users'];
		
			for (var i = 0; i < criteria1UsersArray.length; i++) {
				if (criteria1UsersArray[i] === user) {
					throw new Meteor.Error("You've already voted on this criteria", "If you wish to change your vote, click on your original choice's vote button to cancel that vote and then select your new choice.");
				}
			}
		
			//proceed with voting administration
			var criteria2UsersArray = Collection[0]['comparisonCriteria'][no]['compCriteriaVotes2Users'];

			for (var i = 0; i < criteria2UsersArray.length; i++) {
				if (criteria2UsersArray[i] === user) {
					if (siReview[0]['trendingUpdate'] === siDate) {
						if (siReview[0]['trendingCount'] == 0) {
							//do not push below 0 - proceed further
						} else {
							SearchIndex.update({_id: reviewId}, { $inc: { 'trendingCount': -1}});
						}
					} else {
						SearchIndex.update({_id: reviewId}, { $set: {'trendingUpdate': siDate, 'trendingCount': 0} });
					};
					//to prevent spamming abuse to get onto trending page
					
					Mongo.Collection.get(collection).update(querySelector, {$pull: projection});
					//remove user from voting record
				
					Mongo.Collection.get(collection).update(querySelector, {$inc: decrement});
					//decrement votes
				
					//var goAheadForNotification;
				
				return false; //signifies neutral criteria vote button
				//exit method with return so that following push does not occur
				}
			}
		
			//if user cannot be found, allow vote
		
				Mongo.Collection.get(collection).update(querySelector, {$push: projection});
				//record user as having voted
				
				Mongo.Collection.get(collection).update(querySelector, {$inc: increment});
				//increment votes
				
				if (siReview[0]['trendingUpdate'] === siDate) {
					SearchIndex.update({_id: reviewId}, { $inc: { 'trendingCount': 1}});
				} else {
					SearchIndex.update({_id: reviewId}, { $set: {'trendingUpdate': siDate, 'trendingCount': 1} });
				};
				//include for trending activity
				
				//var goAheadForNotification;
	
				return true; //signifies highlighted criteria vote button
		}	
	},
	
	criteriaRate: function(collection, reviewId, criteriaId, userRating) {
		check(collection, String);
		check(reviewId, String);
		check(criteriaId, String);
		check(userRating, Number);
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('criteriaRate - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		var user = this.userId;
		
		if (!user) {
			throw new Meteor.Error("Logged-Out", "Sorry! You have to be logged in to vote on products.");
		}
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
 		
 		if (reviewId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your review Id to greater than 0 characters.");
 		}
 		
 		if (criteriaId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the criteria id to 50 characters.");
 		}
 		
 		if (criteriaId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your criteria Id to greater than 0 characters.");
 		}
 		
 		if (userRating == 1 || userRating == 2 || userRating == 3 || userRating == 4 || userRating == 5) {
 			//proceed
 		} else {
 			throw new Meteor.Error("Improper Rating", "Please choose a rating of an integer between 1 and 5.");
 		}
 		
 		var submitted = new Date();
		
		var siReview = SearchIndex.find({_id: reviewId}).fetch();
		var siDate = submitted.getDate() + '-' + submitted.getMonth() + '-' + submitted.getFullYear();
		
		var querySelector = {};
		var querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;
		var querySelectorThirdField;
		querySelectorThirdField = 'comparisonCriteria._id';
		querySelector[querySelectorThirdField] = criteriaId;
		
		var pullProjection = {};
		var cGroup;
		cGroup = 'comparisonCriteria.$.compCriteriaRatesUsers';
		pullProjection[cGroup] = {};
		pullProjection[cGroup]['user'] = user;
			
		var pushProjection = {};
		var cGroup;
		cGroup = 'comparisonCriteria.$.compCriteriaRatesUsers';
		pushProjection[cGroup] = {};
		pushProjection[cGroup]['user'] = user;
		pushProjection[cGroup]['lastRate'] = userRating;

		var increment = {};
		var cGroupVotes;
		cGroupVotes = 'comparisonCriteria.$.compCriteriaRatesTotal';
		increment[cGroupVotes] = {};
		increment[cGroupVotes] = 1;
	
		var decrement = {};
		decrement[cGroupVotes] = {};
		decrement[cGroupVotes] = -1;
		
		var Collection = Mongo.Collection.get(collection).find(querySelector).fetch();

		var criteriaCollection = Collection[0]['comparisonCriteria'];
		
		for (var i = 0; i < criteriaCollection.length; i++) {
			if (criteriaCollection[i]['_id'] === criteriaId) {
				var no = i;
			}
		};
	
		//if (no == undefined) 
	
		//proceed with rating administration
		var criteriaRatesUsersArray = Collection[0]['comparisonCriteria'][no]['compCriteriaRatesUsers'];

		for (var i = 0; i < criteriaRatesUsersArray.length; i++) {
			if (criteriaRatesUsersArray[i]['user'] === user) {
				if (criteriaRatesUsersArray[i]['lastRate'] == userRating) {
					var decrementSum = {};
					var cGroupSum;
					cGroupSum = 'comparisonCriteria.$.compCriteriaRatingSum';
					decrementSum[cGroupSum] = {};
					decrementSum[cGroupSum] = (-1 * criteriaRatesUsersArray[i]['lastRate']);
				
					if (siReview[0]['trendingUpdate'] === siDate) {
						if (siReview[0]['trendingCount'] == 0) {
							//do not push below 0 - proceed further
						} else {
							SearchIndex.update({_id: reviewId}, { $inc: { 'trendingCount': -1}});
						}
					} else {
						SearchIndex.update({_id: reviewId}, { $set: {'trendingUpdate': siDate, 'trendingCount': 0} });
					};
					//to prevent spamming abuse to get onto trending page
			
					Mongo.Collection.get(collection).update(querySelector, {$pull: pullProjection});
					//remove user from rating record
		
					Mongo.Collection.get(collection).update(querySelector, {$inc: decrement});
					//decrement total number of rates
		
					Mongo.Collection.get(collection).update(querySelector, {$inc: decrementSum});
					//decrement sum
		
					//var goAheadForNotification;
			
				return 'annulment'; //signifies successful annulment of last rate
			//exit method with return so that following push does not occur
				}
			}

			//if lastRate is not the same, allow re-rate
	
			if (criteriaRatesUsersArray[i]['user'] === user) {
				var decrementSum = {};
				var cGroupSum;
				cGroupSum = 'comparisonCriteria.$.compCriteriaRatingSum';
				decrementSum[cGroupSum] = {};
				decrementSum[cGroupSum] = (-1 * criteriaRatesUsersArray[i]['lastRate']);
			
				Mongo.Collection.get(collection).update(querySelector, {$inc: decrementSum});
				//decrement old sum
			
				var incrementSum = {};
				incrementSum[cGroupSum] = {};
				incrementSum[cGroupSum] = userRating;
			
				Mongo.Collection.get(collection).update(querySelector, {$inc: incrementSum});
				//increment new sum
			
				//leave total number of rates as they are since we're just doing a switch of rates
			
				Mongo.Collection.get(collection).update(querySelector, {$pull: pullProjection});
				//remove user from rating record
				
				Mongo.Collection.get(collection).update(querySelector, {$push: pushProjection});
				//record user as having rated
				//update user rating record with new rating

				return 're-rate'; //signifies successful re-rate
			}
		}
	
			//if it's not an annulment or a re-rate, it must be a user rating for the first time on this criteria
	
			Mongo.Collection.get(collection).update(querySelector, {$push: pushProjection});
			//record user as having rated
			
			var incrementSum = {};
			var cGroupSum;
			cGroupSum = 'comparisonCriteria.$.compCriteriaRatingSum';
			incrementSum[cGroupSum] = {};
			incrementSum[cGroupSum] = userRating;
			
			Mongo.Collection.get(collection).update(querySelector, {$inc: incrementSum});
			//increment sum
			
			Mongo.Collection.get(collection).update(querySelector, {$inc: increment});
			//increment total number of rates
			
			if (siReview[0]['trendingUpdate'] === siDate) {
				SearchIndex.update({_id: reviewId}, { $inc: { 'trendingCount': 1}});
			} else {
				SearchIndex.update({_id: reviewId}, { $set: {'trendingUpdate': siDate, 'trendingCount': 1} });
			};
			//include for trending activity
			
			//var goAheadForNotification;

			return 'first-time-rate'; //signifies successful first time rate
	},
	
	isHighlightedSuggestionVoteBtn: function(collection, reviewId, suggestionId, userStatus) {
		check(collection, String);
		check(reviewId, String);
		check(suggestionId, String);
		check(userStatus, Match.Maybe(String));
		//userStatus only used to force reactivity. not utilized anywhere in code

		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unneceessary errors
			console.log('isHighlightedSuggestionVoteBtn - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible

		if (reviewId === '' || suggestionId === '') {
			return;
		} //to avoid unnecessary operations

		var user = this.userId;

		if(!user) {
			return;
		} //return to avoid unnecessary errors
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
		
		if (suggestionId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the suggestion Id entry to 50 characters.");
 		}
 		
		var querySelector = {};
		var querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;
		var querySelectorThirdField;
		querySelectorThirdField = 'criteriaSuggestions._id';
		querySelector[querySelectorThirdField] = suggestionId;
		
		var projection = {};
		var cGroup;
		cGroup = 'criteriaSuggestions.$.upvoteUsers'; 
		projection[cGroup] = {};
		projection[cGroup] = user;

		var fetchedCollection = Mongo.Collection.get(collection).find(querySelector).fetch();
		
		if (!fetchedCollection.length) {
			return;
			//return to avoid unnecessary errors
		}
		
		var suggestionsCollection = fetchedCollection[0]['criteriaSuggestions'];
		
		for (var i = 0; i < suggestionsCollection.length; i++) {
			if (suggestionsCollection[i]['_id'] === suggestionId) {
				var no = i;
			}			
		}
		
		var suggestionUsersArray = fetchedCollection[0]['criteriaSuggestions'][no]['upvoteUsers'];

		for (var i = 0; i < suggestionUsersArray.length; i++) {
			if (suggestionUsersArray[i] === user) {
				return true; //signifies active suggestion vote button
			}
		}
		
			return false;
			//if no user found, return false			
	},
	
	criteriaSuggestionVote: function(collection, reviewId, criteriaSuggestionId, single) {
		check(collection, String);
		check(reviewId, String);
		check(criteriaSuggestionId, String);
		check(single, Boolean);
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('criteriaSuggestionVote - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		var user = this.userId;
		
		if (!user) {
			throw new Meteor.Error("Logged-Out", "Sorry! You have to be logged in to vote on criteria suggestions.");
		}
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
 		
 		if (reviewId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your review Id to greater than 0 characters.");
 		}
 		
 		if (criteriaSuggestionId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the criteria suggestion id to 50 characters.");
 		}
 		
 		if (criteriaSuggestionId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your criteria suggestion Id to greater than 0 characters.");
 		}
 		
 		var submitted = new Date();
		
		var siReview = SearchIndex.find({_id: reviewId}).fetch();
		var siDate = submitted.getDate() + '-' + submitted.getMonth() + '-' + submitted.getFullYear();
 		
 		var querySelector = {};
		var querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;
		var querySelectorThirdField;
		querySelectorThirdField = 'criteriaSuggestions._id';
		querySelector[querySelectorThirdField] = criteriaSuggestionId;
		
		var projection = {};
		var cGroup;
		cGroup = 'criteriaSuggestions.$.upvoteUsers';
		projection[cGroup] = {};
		projection[cGroup] = user;

		var increment = {};
		var cGroupVotes;
		cGroupVotes = 'criteriaSuggestions.$.upvotes';
		increment[cGroupVotes] = {};
		increment[cGroupVotes] = 1;
	
		var decrement = {};
		decrement[cGroupVotes] = {};
		decrement[cGroupVotes] = -1;
		
		var Collection = Mongo.Collection.get(collection).find(querySelector).fetch();

		var criteriaSuggestionsCollection = Collection[0]['criteriaSuggestions'];
		
		for (var i = 0; i < criteriaSuggestionsCollection.length; i++) {
			if (criteriaSuggestionsCollection[i]['_id'] === criteriaSuggestionId) {
				var no = i;
			}			
		};
	
		//proceed with voting procedure
		//first check if user actually intends to cancel vote
		var criteriaSuggestionUsersArray = Collection[0]['criteriaSuggestions'][no]['upvoteUsers'];

		for (var i = 0; i < criteriaSuggestionUsersArray.length; i++) {
			if (criteriaSuggestionUsersArray[i] === user) {
				if (siReview[0]['trendingUpdate'] === siDate) {
					if (siReview[0]['trendingCount'] == 0) {
						//do not push below 0 - proceed further
					} else {
						SearchIndex.update({_id: reviewId}, { $inc: { 'trendingCount': -1}});
					}
				} else {
					SearchIndex.update({_id: reviewId}, { $set: {'trendingUpdate': siDate, 'trendingCount': 0} });
				};
				//to prevent spamming abuse to get onto trending page
			
				Mongo.Collection.get(collection).update(querySelector, {$pull: projection});
				//remove user from voting record
			
				Mongo.Collection.get(collection).update(querySelector, {$inc: decrement});
				//decrement votes
			
				//var goAheadForNotification;
			
			return false; //signifies neutral criteria vote button
			//exit method with return so that following push does not occur
			}
		}
	
		//if user cannot be found, check if it's time to move the suggestion to official criteria. If it's not, allow vote
		
		if (Collection[0]['criteriaSuggestions'][no]['upvotes'] >= 4) {
			
			var pull = {};
			var cGroup = 'criteriaSuggestions';
			pull[cGroup] = {};
			var suggestionIdField = '_id';
			pull[cGroup][suggestionIdField] = criteriaSuggestionId;
			
			Mongo.Collection.get(collection).update({_id: reviewId}, {$pull: pull});
			
			var newCriteriaPush = {};
			var cGroup = 'comparisonCriteria';
			newCriteriaPush[cGroup] = {};
			var suggestionIdField = '_id';
			newCriteriaPush[cGroup][suggestionIdField] = Random.id();
			
			var submitted = new Date();
		
			var criteriaSet;
			
			if (single) {
				criteriaSet = {
					_id: Random.id(),
					compCriteriaName: Collection[0]['criteriaSuggestions'][no]['criteriaSuggestion'],
					compCriteriaDescription: Collection[0]['criteriaSuggestions'][no]['criteriaDescription'],
					userId: "community",
					submitted: submitted,
					compCriteriaRatingSum: 0,
					compCriteriaRatesTotal: 0,
					compCriteriaRatesUsers: [] 
				};
			} else {
				criteriaSet = {
					_id: Random.id(),
					compCriteriaName: Collection[0]['criteriaSuggestions'][no]['criteriaSuggestion'],
					compCriteriaDescription: Collection[0]['criteriaSuggestions'][no]['criteriaDescription'],
					userId: "community",
					submitted: submitted,
					compCriteriaVotes1: 0,
					compCriteriaVotes2: 0,
					compCriteriaVotes1Users: [],
					compCriteriaVotes2Users: [],
					compCritPicUrl1: Collection[0]['picUrl1'],
					compCritPicUrl2: Collection[0]['picUrl2']
				};
			}
		
			var set = {};
			set['comparisonCriteria'] = criteriaSet;
			 
			Mongo.Collection.get(collection).update({_id: reviewId}, {$push: set});
		
			return 'upgraded!';
			//return with news of upgrade and so that no further action is taken
		} else {
			Mongo.Collection.get(collection).update(querySelector, {$push: projection});
			//record user as having voted
			
			Mongo.Collection.get(collection).update(querySelector, {$inc: increment});
			//increment votes

			if (siReview[0]['trendingUpdate'] === siDate) {
				SearchIndex.update({_id: reviewId}, { $inc: { 'trendingCount': 1}});
			} else {
				SearchIndex.update({_id: reviewId}, { $set: {'trendingUpdate': siDate, 'trendingCount': 1} });
			};
			//include for trending activity

			//var goAheadForNotification;

			return true; //signifies highlighted criteria vote button
		}
	},
	
	isHighlightedUpVote: function(collection, reviewId, commentsGroup, commentId, userStatus) {
		check(collection, String);
		check(reviewId, String);
		check(commentsGroup, String);
		check(commentId, String);
		check(userStatus, Match.Maybe(String));
		//userStatus only used to force reactivity. not utilized anywhere in code

		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('isHighlightedUpVote - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible

		if (reviewId === '' || commentId === '') {
			return;
		} //to avoid unnecessary operations
		
		if (commentsGroup === 'comments1' || commentsGroup === 'comments2' || commentsGroup === 'commentsLack') {
			//proceed
		} else {
			//else exit to avoid malevolent action but assume innocence
			console.log('isHighlightedUpVote - commentsGroup misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		var user = this.userId;
		
		if(!user) {
			return;
		} //return to avoid unnecessary errors
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
 		
 		if (commentId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the comment Id entry to 50 characters.");
 		}
		
		collection += 'comments';
		
		var querySelector = {};
		var querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;
		var querySelectorThirdField;
		if (commentsGroup === 'comments1') {
			querySelectorThirdField = 'comments1._id';
		} else if (commentsGroup === 'comments2') {
			querySelectorThirdField = 'comments2._id';
		} else if (commentsGroup === 'commentsLack') {
			querySelectorThirdField = 'commentsLack._id';
		};
		querySelector[querySelectorThirdField] = commentId;
		
		
		var projection = {};
		var cGroup;
		if (commentsGroup === 'comments1') {
			cGroup = 'comments1.$.upvoteUsers'; 
		} else if (commentsGroup === 'comments2') {
			cGroup = 'comments2.$.upvoteUsers';
		} else if (commentsGroup === 'commentsLack') {
			cGroup = 'commentsLack.$.upvoteUsers';
		};
		projection[cGroup] = {};
		projection[cGroup] = user;

		var fetchedCollection = Mongo.Collection.get(collection).find(querySelector, projection).fetch();
		
		var commentsCollection = fetchedCollection[0][commentsGroup];
		
		
		for (var i = 0; i < commentsCollection.length ; i++) {
			if (commentsCollection[i]['_id'] === commentId) {
				var no = i;
			}			
		}
		
		var upvoteUsersArray = fetchedCollection[0][commentsGroup][no]['upvoteUsers'];

		for (var i = 0; i < upvoteUsersArray.length; i++) {
			if (upvoteUsersArray[i] === user) {
				return 'active'; //signifies active upvote button
			}
		}
		
				return;
				//if no user found, return nothing
				
	},

	isHighlightedDownVote: function(collection, reviewId, commentsGroup, commentId, userStatus) {
		check(collection, String);
		check(reviewId, String);
		check(commentsGroup, String);
		check(commentId, String);
		check(userStatus, Match.Maybe(String));
		//userStatus only used to force reactivity. not utilized anywhere in code
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('isHighlightedDownVote - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible		
		
		if (reviewId === '' || commentId === '') {
			return;
		} //to avoid unnecessary operations
		
		if (commentsGroup === 'comments1' || commentsGroup === 'comments2' || commentsGroup === 'commentsLack') {
			//proceed
		} else {
			//else exit to avoid malevolent action but assume innocence
			console.log('isHighlightedDownVote - commentsGroup misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		var user = this.userId;
		
		if(!user) {
			return;
		} //return to avoid unnecessary errors
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
 		
 		if (commentId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the snippet Id entry to 50 characters.");
 		}
 		
 		collection += 'comments';
		
		var querySelector = {};
		var querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;
		var querySelectorThirdField;
		if (commentsGroup === 'comments1') {
			querySelectorThirdField = 'comments1._id';
		} else if (commentsGroup === 'comments2') {
			querySelectorThirdField = 'comments2._id';
		} else if (commentsGroup === 'commentsLack') {
			querySelectorThirdField = 'commentsLack._id';
		};
		querySelector[querySelectorThirdField] = commentId;
		
		
		var projection = {};
		var cGroup;
		if (commentsGroup === 'comments1') {
			cGroup = 'comments1.$.downvoteUsers'; 
		} else if (commentsGroup === 'comments2') {
			cGroup = 'comments2.$.downvoteUsers';
		} else if (commentsGroup === 'commentsLack') {
			cGroup = 'commentsLack.$.downvoteUsers';
		}
		projection[cGroup] = {};
		projection[cGroup] = user;

		var fetchedCollection = Mongo.Collection.get(collection).find(querySelector, projection).fetch();
		
		var commentsCollection = fetchedCollection[0][commentsGroup];
		
		
		for (var i = 0; i < commentsCollection.length; i++) {
			if (commentsCollection[i]['_id'] === commentId) {
				var no = i;
			}			
		}
		
		var downvoteUsersArray = fetchedCollection[0][commentsGroup][no]['downvoteUsers'];

		for (var i = 0; i < downvoteUsersArray.length; i++) {
			if (downvoteUsersArray[i] === user) {
				return 'active'; //signifies active upvote button
			}
		}
		
				return;
				//if no user found, return nothing
				
	},
	
	newPriceSubmit: function(collection, reviewId, newPriceandLocation) {
		check(collection, String);
		check(reviewId, String);
		check(newPriceandLocation, String);
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('newPriceSubmit - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		var user = this.userId;
		
		if (!user) {
			throw new Meteor.Error("Logged-Out", "Sorry! You have to be logged in to submit new price proposals.");
		}
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
 		
 		if (reviewId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your review Id to greater than 0 characters.");
 		}
 		
 		if (newPriceandLocation.length > 1100) {
			throw new Meteor.Error("Too long", "Please limit your price proposal to 1100 characters.");
 		}
 		
 		if (newPriceandLocation.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your price proposal to greater than 0 characters.");
 		}
 		
 		Meteor.users.update({_id: 'coftxS5cw7XjcfTNd'}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "New Price Proposal - " + newPriceandLocation + "; collection - " + collection + "; reviewId - " + reviewId + "; userId - " + user}}});
	},
	
	commentVoteUp: function(collection, reviewId, commentsGroup, commentId) {
		check(collection, String);
		check(reviewId, String);
		check(commentsGroup, String);
		check(commentId, String);
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('commentVoteUp - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (commentsGroup === 'comments1' || commentsGroup === 'comments2' || commentsGroup === 'commentsLack') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('commentVoteUp - commentsGroup misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		var user = this.userId;
		
		if (!user) {
			throw new Meteor.Error("Logged-Out", "Sorry! You have to be logged in to grade review snippets.");
		}
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
 		
 		if (reviewId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your review Id to greater than 0 characters.");
 		}
 		
 		if (commentId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the snippet id to 50 characters.");
 		}
 		
 		if (commentId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your comment Id to greater than 0 characters.");
 		}
		
		collection += 'comments';
		
		var querySelector = {};
		var querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;
		var querySelectorThirdField;
		if (commentsGroup === 'comments1') {
			querySelectorThirdField = 'comments1._id';
		} else if (commentsGroup === 'comments2') {
			querySelectorThirdField = 'comments2._id';
		} else if (commentsGroup === 'commentsLack') {
			querySelectorThirdField = 'commentsLack._id';
		};
		querySelector[querySelectorThirdField] = commentId;
		
		
		var projection = {};
		var cGroup;
		if (commentsGroup === 'comments1') {
			cGroup = 'comments1.$.upvoteUsers'; 
		} else if (commentsGroup === 'comments2') {
			cGroup = 'comments2.$.upvoteUsers';
		} else if (commentsGroup === 'commentsLack') {
			cGroup = 'commentsLack.$.upvoteUsers';
		};
		projection[cGroup] = {};
		projection[cGroup] = user;

		var increment = {};
		var cGroupUpVotes;
		if (commentsGroup === 'comments1') {
			cGroupUpVotes = 'comments1.$.upvotes';
		} else if (commentsGroup === 'comments2') {
			cGroupUpVotes = 'comments2.$.upvotes';
		} else if (commentsGroup === 'commentsLack') {
			cGroupUpVotes = 'commentsLack.$.upvotes';
		};
		increment[cGroupUpVotes] = {};
		increment[cGroupUpVotes] = 1;
		
		var incrementTotalScore = {};
		var cGroupTotalScore;
		if (commentsGroup === 'comments1') {
			cGroupTotalScore = 'comments1.$.totalScore';
		} else if (commentsGroup === 'comments2') {
			cGroupTotalScore = 'comments2.$.totalScore';
		} else if (commentsGroup === 'commentsLack') {
			cGroupTotalScore = 'commentsLack.$.totalScore';
		};
		incrementTotalScore[cGroupTotalScore] = {};
		incrementTotalScore[cGroupTotalScore] = 1;
		
		var decrement = {};
		decrement[cGroupUpVotes] = {};
		decrement[cGroupUpVotes] = -1;
		
		var decrementTotalScore = {};
		decrementTotalScore[cGroupTotalScore] = {};
		decrementTotalScore[cGroupTotalScore] = -1;
		
		var reviewCollection = collection.substring(0, (collection.length - 8));
		
		var Collection = Mongo.Collection.get(collection).find(querySelector).fetch();

		var commentsCollection = Collection[0][commentsGroup];
				
		for (var i = 0; i < commentsCollection.length; i++) {
			if (commentsCollection[i]['_id'] === commentId) {
				var no = i;
			}			
		};

		//Check to see if user has already downvoted this comment
		var downvoteUsersArray = Collection[0][commentsGroup][no]['downvoteUsers'];
		
		for (var i = 0; i < downvoteUsersArray.length; i++) {
			if (downvoteUsersArray[i] === user) {
				throw new Meteor.Error("You've already graded this comment", "If you wish to change your grade, click on your original choice's grade button to cancel that grade and then select your new choice.");
			}
		}
		
		//proceed with voting administration
		var upvoteUsersArray = Collection[0][commentsGroup][no]['upvoteUsers'];

		for (var i = 0; i < upvoteUsersArray.length; i++) {
			if (upvoteUsersArray[i] === user) {
				Mongo.Collection.get(collection).update(querySelector, {$pull: projection});
				//remove user from voting record
				
				Mongo.Collection.get(collection).update(querySelector, {$inc: decrement});
				//decrement upvotes
				
				Mongo.Collection.get(collection).update(querySelector, {$inc: decrementTotalScore});
				//decrement totalScore when upvote taken away
				
				var querySelectorCommentsArray = {};
				var querySelectorCommentsArraySecondField = '_id';
				querySelectorCommentsArray[querySelectorCommentsArraySecondField] = reviewId;
				var arrayBeforeSort = Mongo.Collection.get(collection).find(querySelectorCommentsArray, { fields: {'comments1._id': 1, 'comments2._id': 1, 'commentsLack._id': 1, 'comments1': { $slice: 5 }, 'comments2': { $slice: 5 }, 'commentsLack': { $slice: 5 } } }).fetch()[0][commentsGroup];
				//catch an array of the top five snippets before the sort
				
				if (commentsGroup === 'comments1') {
					Mongo.Collection.get(collection).update(querySelector, {$push: {comments1: {$each: [], $sort: {'totalScore': -1}}}});
				} else if (commentsGroup === 'comments2') {
					Mongo.Collection.get(collection).update(querySelector, {$push: {comments2: {$each: [], $sort: {'totalScore': -1}}}});
				} else if (commentsGroup === 'commentsLack') {
					Mongo.Collection.get(collection).update(querySelector, {$push: {commentsLack: {$each: [], $sort: {'totalScore': -1}}}});
				};
				//re-sort snippets
				
				var arrayAfterSort = Mongo.Collection.get(collection).find(querySelectorCommentsArray, { fields: {'comments1._id': 1, 'comments2._id': 1, 'commentsLack._id': 1, 'comments1': { $slice: 5 }, 'comments2': { $slice: 5 }, 'commentsLack': { $slice: 5 } } }).fetch()[0][commentsGroup];
				//catch array of top 5 snippets after the sort
				
				var userBullHornArray = Mongo.Collection.get(reviewCollection).find({'_id': reviewId}).fetch()[0]['hornCountUsers'];
				
				var goAheadForNotification;
				
				switch (arrayBeforeSort.length) {
					 case 5:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[1]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[2]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[3]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[4]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
						break;
					 case 4:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[1]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[2]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[3]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
						break;
					 case 3:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[1]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[2]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
						break;
					 case 2:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[1]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
						break;
					 case 1:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
					 	break;
				}	
				//check if a new snippet has made it into the top 5

				if (goAheadForNotification) {
					for (var x = 0; x < userBullHornArray.length; x++) {
						if (userBullHornArray[x] == this.userId) {
							if ((x + 1) < userBullHornArray.length) {
								x++;
							} else {
								x = 'exit';
							}
						}
						//omit own id
					
						if (x != 'exit') {
							if (Meteor.users.find({_id: userBullHornArray[x]}).fetch()[0]['profile']['notificationCount']) {
								Meteor.users.update({_id: userBullHornArray[x]}, {$inc: {'profile.notificationCount': 1}});
							} else {
								Meteor.users.update({_id: userBullHornArray[x]}, {$set: {'profile.notificationCount': 1}});
							}
							//set Notification Count
						
							var userBullHornReviews = Meteor.users.find({_id: userBullHornArray[x]}).fetch()[0]['profile']['bullHornReviews'];
						
							for (var t = 0; t < userBullHornReviews.length; t++) {
								if (userBullHornReviews[t]['_id'] == reviewId) {
									var buildBHPAccess;
									buildBHPAccess = {};
									buildBHPAccess['$set'] = {};
									buildBHPAccess['$set']['profile.bullHornReviews.' + t + '.hasNotifications'] = true;
								
									Meteor.users.update({_id: userBullHornArray[x]}, buildBHPAccess);
								}
							}
							//indicate new snippets on bullhorned review
				
							var productName1Notification = Mongo.Collection.get(reviewCollection).find(querySelectorCommentsArray).fetch()[0]['productName1'];
							if (Mongo.Collection.get(reviewCollection).find(querySelectorCommentsArray).fetch()[0]['single']) {
								if (Meteor.user().profile.languagePref == 'pl') {
									Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "Nowy wycinek doszedł do pierwszej piątki w recenzji \"" + productName1Notification + "\". Sprawdź!", messageReviewName: productName1Notification}}});
								} else {
									Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "A new snippet has made it to the top five of the \"" + productName1Notification + "\" review. Check it out!", messageReviewName: productName1Notification}}});
								}
							} else {
								var productName2Notification = Mongo.Collection.get(reviewCollection).find(querySelectorCommentsArray).fetch()[0]['productName2'];
					
								if (Meteor.user().profile.languagePref == 'pl') {
									Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "Nowy wycinek doszedł do pierwszej piątki w recenzji \"" + productName1Notification + " vs " + productName2Notification + "\". Sprawdź!", messageReviewName: productName1Notification + " vs " + productName2Notification}}});
								} else {
									Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "A new snippet has made it to the top five of the \"" + productName1Notification + " vs " + productName2Notification + "\" review. Check it out!", messageReviewName: productName1Notification + " vs " + productName2Notification}}});
								}
							}
							//send message with details about notification
						} else {
							//do nothing; let the loop run out
						}
					}
				}
				
			return false; //signifies neutral upvote button
			//exit method with return so that following push does not occur
			}
		}
		
		//if user cannot be found, allow vote
		
				Mongo.Collection.get(collection).update(querySelector, {$push: projection});
				//record user as having voted
				
				Mongo.Collection.get(collection).update(querySelector, {$inc: increment});
				//increment upvotes
				
				Mongo.Collection.get(collection).update(querySelector, {$inc: incrementTotalScore});
				//increment totalScore when upvote added
				
				var querySelectorCommentsArray = {};
				var querySelectorCommentsArraySecondField = '_id';
				querySelectorCommentsArray[querySelectorCommentsArraySecondField] = reviewId;
				var arrayBeforeSort = Mongo.Collection.get(collection).find(querySelectorCommentsArray, { fields: {'comments1._id': 1, 'comments2._id': 1, 'commentsLack._id': 1, 'comments1': { $slice: 5 }, 'comments2': { $slice: 5 }, 'commentsLack': { $slice: 5 } } }).fetch()[0][commentsGroup];
				//catch an array of the top five snippets before the sort
				
				if (commentsGroup === 'comments1') {
					Mongo.Collection.get(collection).update(querySelector, {$push: {comments1: {$each: [], $sort: {'totalScore': -1}}}});
				} else if (commentsGroup === 'comments2') {
					Mongo.Collection.get(collection).update(querySelector, {$push: {comments2: {$each: [], $sort: {'totalScore': -1}}}});
				} else if (commentsGroup === 'commentsLack') {
					Mongo.Collection.get(collection).update(querySelector, {$push: {commentsLack: {$each: [], $sort: {'totalScore': -1}}}});
				};
				//re-sort snippets
				
				var arrayAfterSort = Mongo.Collection.get(collection).find(querySelectorCommentsArray, { fields: {'comments1._id': 1, 'comments2._id': 1, 'commentsLack._id': 1, 'comments1': { $slice: 5 }, 'comments2': { $slice: 5 }, 'commentsLack': { $slice: 5 } } }).fetch()[0][commentsGroup];
				//catch array of top 5 snippets after the sort
				
				var userBullHornArray = Mongo.Collection.get(reviewCollection).find({'_id': reviewId}).fetch()[0]['hornCountUsers'];
				
				var goAheadForNotification;

				switch (arrayBeforeSort.length) {
					 case 5:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[1]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[2]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[3]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[4]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
						break;
					 case 4:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[1]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[2]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[3]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
						break;
					 case 3:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[1]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[2]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
						break;
					 case 2:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[1]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
						break;
					 case 1:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
					 	break;
				}	
				//check if a new snippet has made it into the top 5
	
				if (goAheadForNotification) {			
					for (var x = 0; x < userBullHornArray.length; x++) {
						if (userBullHornArray[x] == this.userId) {
							if ((x + 1) < userBullHornArray.length) {
								x++;
							} else {
								x = 'exit';
							}
						}
						//omit own id
					
						if (x != 'exit') {
							if (Meteor.users.find({_id: userBullHornArray[x]}).fetch()[0]['profile']['notificationCount']) {
								Meteor.users.update({_id: userBullHornArray[x]}, {$inc: {'profile.notificationCount': 1}});
							} else {
								Meteor.users.update({_id: userBullHornArray[x]}, {$set: {'profile.notificationCount': 1}});
							}
							//set Notification Count
						
							var userBullHornReviews = Meteor.users.find({_id: userBullHornArray[x]}).fetch()[0]['profile']['bullHornReviews'];
						
							for (var t = 0; t < userBullHornReviews.length; t++) {
								if (userBullHornReviews[t]['_id'] == reviewId) {
									var buildBHPAccess;
									buildBHPAccess = {};
									buildBHPAccess['$set'] = {};
									buildBHPAccess['$set']['profile.bullHornReviews.' + t + '.hasNotifications'] = true;
								
									Meteor.users.update({_id: userBullHornArray[x]}, buildBHPAccess);
								}
							}
							//indicate new snippets on bullhorned review
				
							var productName1Notification = Mongo.Collection.get(reviewCollection).find(querySelectorCommentsArray).fetch()[0]['productName1'];
							if (Mongo.Collection.get(reviewCollection).find(querySelectorCommentsArray).fetch()[0]['single']) {
								if (Meteor.user().profile.languagePref == 'pl') {
									Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "Nowy wycinek doszedł do pierwszej piątki w recenzji \"" + productName1Notification + "\". Sprawdź!", messageReviewName: productName1Notification}}});
								} else {
									Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "A new snippet has made it to the top five of the \"" + productName1Notification + "\" review. Check it out!", messageReviewName: productName1Notification}}});
								}
							} else {
								var productName2Notification = Mongo.Collection.get(reviewCollection).find(querySelectorCommentsArray).fetch()[0]['productName2'];
								
								if (Meteor.user().profile.languagePref == 'pl') {
									Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "Nowy wycinek doszedł do pierwszej piątki w recenzji \"" + productName1Notification + " vs " + productName2Notification + "\". Sprawdź!", messageReviewName: productName1Notification + " vs " + productName2Notification}}});
								} else {
									Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "A new snippet has made it to the top five of the \"" + productName1Notification + " vs " + productName2Notification + "\" review. Check it out!", messageReviewName: productName1Notification + " vs " + productName2Notification}}});
								}
							}
							//send message with details about notification
						} else {
							//do nothing; let the loop run out
						}
					}
				}
	
				return true; //signifies highlighted upvote button
	},
	
	commentVoteDown: function(collection, reviewId, commentsGroup, commentId) {
		check(collection, String);
		check(reviewId, String);
		check(commentsGroup, String);
		check(commentId, String);
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('commentVoteDown - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (commentsGroup === 'comments1' || commentsGroup === 'comments2' || commentsGroup === 'commentsLack') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('commentVoteDown - commentsGroup misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		var user = this.userId;
		
		if (!user) {
			throw new Meteor.Error("Logged-Out", "Sorry! You have to be logged in to grade review snippets.");
		}
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
 		
 		if (reviewId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your review Id to greater than 0 characters.");
 		}
 		
 		if (commentId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the snippet id to 50 characters.");
 		}
 		
 		if (commentId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your comment Id to greater than 0 characters.");
 		}
		
		collection += 'comments';
		
		var querySelector = {};
		var querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;
		var querySelectorThirdField;
		if (commentsGroup === 'comments1') {
			querySelectorThirdField = 'comments1._id';
		} else if (commentsGroup === 'comments2') {
			querySelectorThirdField = 'comments2._id';
		} else if (commentsGroup === 'commentsLack') {
			querySelectorThirdField = 'commentsLack._id';
		};
		querySelector[querySelectorThirdField] = commentId;
		
		
		var projection = {};
		var cGroup;
		if (commentsGroup === 'comments1') {
			cGroup = 'comments1.$.downvoteUsers'; 
		} else if (commentsGroup === 'comments2') {
			cGroup = 'comments2.$.downvoteUsers';
		} else if (commentsGroup === 'commentsLack') {
			cGroup = 'commentsLack.$.downvoteUsers';
		}; 
		projection[cGroup] = {};
		projection[cGroup] = user;
		
		var increment = {};
		var cGroupDownVotes;
		if (commentsGroup === 'comments1') {
			cGroupDownVotes = 'comments1.$.downvotes';
		} else if (commentsGroup === 'comments2') {
			cGroupDownVotes = 'comments2.$.downvotes';
		} else if (commentsGroup === 'commentsLack') {
			cGroupDownVotes = 'commentsLack.$.downvotes';
		};
		increment[cGroupDownVotes] = {};
		increment[cGroupDownVotes] = 1;
		
		var decrementTotalScore = {};
		var cGroupTotalScore;
		if (commentsGroup === 'comments1') {
			cGroupTotalScore = 'comments1.$.totalScore';
		} else if (commentsGroup === 'comments2') {
			cGroupTotalScore = 'comments2.$.totalScore';
		} else if (commentsGroup === 'commentsLack') {
			cGroupTotalScore = 'commentsLack.$.totalScore';
		};
		decrementTotalScore[cGroupTotalScore] = {};
		decrementTotalScore[cGroupTotalScore] = -1;
		
		var decrement = {};
		decrement[cGroupDownVotes] = {};
		decrement[cGroupDownVotes] = -1;

		var incrementTotalScore = {};
		incrementTotalScore[cGroupTotalScore] = {};
		incrementTotalScore[cGroupTotalScore] = 1;
		
		var reviewCollection = collection.substring(0, (collection.length - 8));
	
		var Collection = Mongo.Collection.get(collection).find(querySelector).fetch();
		
		var commentsCollection = Collection[0][commentsGroup];
				
		for (var i = 0; i < commentsCollection.length; i++) {
			if (commentsCollection[i]['_id'] === commentId) {
				var no = i;
			}			
		};
		
		//Check to see if user has already upvoted this comment
		var upvoteUsersArray = Collection[0][commentsGroup][no]['upvoteUsers'];
		
		for (var i = 0; i < upvoteUsersArray.length; i++) {
			if (upvoteUsersArray[i] === user) {
				throw new Meteor.Error("You've already graded this snippet", "If you wish to change your grade, click on your original choice's grade button to cancel that grade and then select your new choice.");
			}
		}
		
		//proceed with voting administration		
		var downvoteUsersArray = Collection[0][commentsGroup][no]['downvoteUsers'];

		for (var i = 0; i < downvoteUsersArray.length; i++) {
			if (downvoteUsersArray[i] === user) {
				Mongo.Collection.get(collection).update(querySelector, {$pull: projection});
				//remove user from voting record
				
				Mongo.Collection.get(collection).update(querySelector, {$inc: decrement});
				//decrement downvotes
				
				Mongo.Collection.get(collection).update(querySelector, {$inc: incrementTotalScore});
				//increment totalScore when downvote taken away

				var querySelectorCommentsArray = {};
				var querySelectorCommentsArraySecondField = '_id';
				querySelectorCommentsArray[querySelectorCommentsArraySecondField] = reviewId;
				var arrayBeforeSort = Mongo.Collection.get(collection).find(querySelectorCommentsArray, { fields: {'comments1._id': 1, 'comments2._id': 1, 'commentsLack._id': 1, 'comments1': { $slice: 5 }, 'comments2': { $slice: 5 }, 'commentsLack': { $slice: 5 } } }).fetch()[0][commentsGroup];
				//catch an array of the top five snippets before the sort

				if (commentsGroup === 'comments1') {
					Mongo.Collection.get(collection).update(querySelector, {$push: {comments1: {$each: [], $sort: {'totalScore': -1}}}});
				} else if (commentsGroup === 'comments2') {
					Mongo.Collection.get(collection).update(querySelector, {$push: {comments2: {$each: [], $sort: {'totalScore': -1}}}});
				} else if (commentsGroup === 'commentsLack') {
					Mongo.Collection.get(collection).update(querySelector, {$push: {commentsLack: {$each: [], $sort: {'totalScore': -1}}}});
				};
				//re-sort snippets
				
				var arrayAfterSort = Mongo.Collection.get(collection).find(querySelectorCommentsArray, { fields: {'comments1._id': 1, 'comments2._id': 1, 'commentsLack._id': 1, 'comments1': { $slice: 5 }, 'comments2': { $slice: 5 }, 'commentsLack': { $slice: 5 } } }).fetch()[0][commentsGroup];
				//catch array of top 5 snippets after the sort
				
				var userBullHornArray = Mongo.Collection.get(reviewCollection).find({'_id': reviewId}).fetch()[0]['hornCountUsers'];
				
				var goAheadForNotification;
				
				switch (arrayBeforeSort.length) {
					 case 5:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[1]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[2]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[3]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[4]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
						break;
					 case 4:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[1]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[2]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[3]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
						break;
					 case 3:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[1]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[2]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
						break;
					 case 2:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[1]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
						break;
					 case 1:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
					 	break;
				}	
				//check if a new snippet has made it into the top 5
				
				if (goAheadForNotification) {
					for (var x = 0; x < userBullHornArray.length; x++) {
						if (userBullHornArray[x] == this.userId) {
							if ((x + 1) < userBullHornArray.length) {
								x++;
							} else {
								x = 'exit';
							}
						}
						//omit own id
					
						if (x != 'exit') {
							if (Meteor.users.find({_id: userBullHornArray[x]}).fetch()[0]['profile']['notificationCount']) {
								Meteor.users.update({_id: userBullHornArray[x]}, {$inc: {'profile.notificationCount': 1}});
							} else {
								Meteor.users.update({_id: userBullHornArray[x]}, {$set: {'profile.notificationCount': 1}});
							}
							//set Notification Count
						
							var userBullHornReviews = Meteor.users.find({_id: userBullHornArray[x]}).fetch()[0]['profile']['bullHornReviews'];
						
							for (var t = 0; t < userBullHornReviews.length; t++) {
								if (userBullHornReviews[t]['_id'] == reviewId) {
									var buildBHPAccess;
									buildBHPAccess = {};
									buildBHPAccess['$set'] = {};
									buildBHPAccess['$set']['profile.bullHornReviews.' + t + '.hasNotifications'] = true;
								
									Meteor.users.update({_id: userBullHornArray[x]}, buildBHPAccess);
								}
							}
							//indicate new snippets on bullhorned review
				
							var productName1Notification = Mongo.Collection.get(reviewCollection).find(querySelectorCommentsArray).fetch()[0]['productName1'];
							if (Mongo.Collection.get(reviewCollection).find(querySelectorCommentsArray).fetch()[0]['single']) {
								if (Meteor.user().profile.languagePref == 'pl') {
									Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "Nowy wycinek doszedł do pierwszej piątki w recenzji \"" + productName1Notification + "\". Sprawdź!", messageReviewName: productName1Notification}}});
								} else {
									Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "A new snippet has made it to the top five of the \"" + productName1Notification + "\" review. Check it out!", messageReviewName: productName1Notification}}});
								}
							} else {
								var productName2Notification = Mongo.Collection.get(reviewCollection).find(querySelectorCommentsArray).fetch()[0]['productName2'];
					
								if (Meteor.user().profile.languagePref == 'pl') {
									Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "Nowy wycinek doszedł do pierwszej piątki w recenzji \"" + productName1Notification + " vs " + productName2Notification + "\". Sprawdź!", messageReviewName: productName1Notification + " vs " + productName2Notification}}});
								} else {
									Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "A new snippet has made it to the top five of the \"" + productName1Notification + " vs " + productName2Notification + "\" review. Check it out!", messageReviewName: productName1Notification + " vs " + productName2Notification}}});
								}
							}
							//send message with details about notification
						} else {
							//do nothing; let the loop run out
						}
					}
				}
				
			return false; //signifies neutral downvote button
			//exit method with return so that following push does not occur
			} 
		}
		
		//if user cannot be found, allow vote
		
				Mongo.Collection.get(collection).update(querySelector, {$push: projection});
				//record user as having voted
				
				Mongo.Collection.get(collection).update(querySelector, {$inc: increment});
				//increment downvotes
				
				Mongo.Collection.get(collection).update(querySelector, {$inc: decrementTotalScore});
				//decrement totalScore when downvote added

				var querySelectorCommentsArray = {};
				var querySelectorCommentsArraySecondField = '_id';
				querySelectorCommentsArray[querySelectorCommentsArraySecondField] = reviewId;
				var arrayBeforeSort = Mongo.Collection.get(collection).find(querySelectorCommentsArray, { fields: {'comments1._id': 1, 'comments2._id': 1, 'commentsLack._id': 1, 'comments1': { $slice: 5 }, 'comments2': { $slice: 5 }, 'commentsLack': { $slice: 5 } } }).fetch()[0][commentsGroup];
				//catch an array of the top five snippets before the sort

				if (commentsGroup === 'comments1') {
					Mongo.Collection.get(collection).update(querySelector, {$push: {comments1: {$each: [], $sort: {'totalScore': -1}}}});
				} else if (commentsGroup === 'comments2') {
					Mongo.Collection.get(collection).update(querySelector, {$push: {comments2: {$each: [], $sort: {'totalScore': -1}}}});
				} else if (commentsGroup === 'commentsLack') {
					Mongo.Collection.get(collection).update(querySelector, {$push: {commentsLack: {$each: [], $sort: {'totalScore': -1}}}});
				};
				//re-sort snippets
				
				var arrayAfterSort = Mongo.Collection.get(collection).find(querySelectorCommentsArray, { fields: {'comments1._id': 1, 'comments2._id': 1, 'commentsLack._id': 1, 'comments1': { $slice: 5 }, 'comments2': { $slice: 5 }, 'commentsLack': { $slice: 5 } } }).fetch()[0][commentsGroup];
				//catch array of top 5 snippets after the sort
				
				
				var userBullHornArray = Mongo.Collection.get(reviewCollection).find({'_id': reviewId}).fetch()[0]['hornCountUsers'];
				
				var goAheadForNotification;
				
				switch (arrayBeforeSort.length) {
					 case 5:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[1]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[2]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[3]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[4]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
						break;
					 case 4:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[1]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[2]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[3]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
						break;
					 case 3:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[1]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[2]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
						break;
					 case 2:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id'] || arrayBeforeSort[v]['_id'] == arrayAfterSort[1]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
						break;
					 case 1:
					 	for (var v = 0; v < arrayBeforeSort.length; v ++) {
							if (arrayBeforeSort[v]['_id'] == arrayAfterSort[0]['_id']) {
								//keep going
							} else {
								goAheadForNotification = true;
							}
						};
					 	break;
				}	
				//check if a new snippet has made it into the top 5
				
				if (goAheadForNotification) {
					for (var x = 0; x < userBullHornArray.length; x++) {
						if (userBullHornArray[x] == this.userId) {
							if ((x + 1) < userBullHornArray.length) {
								x++;
							} else {
								x = 'exit';
							}
						}
						//omit own id
					
						if (x != 'exit') {
							if (Meteor.users.find({_id: userBullHornArray[x]}).fetch()[0]['profile']['notificationCount']) {
								Meteor.users.update({_id: userBullHornArray[x]}, {$inc: {'profile.notificationCount': 1}});
							} else {
								Meteor.users.update({_id: userBullHornArray[x]}, {$set: {'profile.notificationCount': 1}});
							}
							//set Notification Count
					
							var userBullHornReviews = Meteor.users.find({_id: userBullHornArray[x]}).fetch()[0]['profile']['bullHornReviews'];
					
							for (var t = 0; t < userBullHornReviews.length; t++) {
								if (userBullHornReviews[t]['_id'] == reviewId) {
									var buildBHPAccess;
									buildBHPAccess = {};
									buildBHPAccess['$set'] = {};
									buildBHPAccess['$set']['profile.bullHornReviews.' + t + '.hasNotifications'] = true;
								
									Meteor.users.update({_id: userBullHornArray[x]}, buildBHPAccess);
								}
							}
							//indicate new snippets on bullhorned review
			
							var productName1Notification = Mongo.Collection.get(reviewCollection).find(querySelectorCommentsArray).fetch()[0]['productName1'];
							if (Mongo.Collection.get(reviewCollection).find(querySelectorCommentsArray).fetch()[0]['single']) {
								if (Meteor.user().profile.languagePref == 'pl') {
									Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "Nowy wycinek doszedł do pierwszej piątki w recenzji \"" + productName1Notification + "\". Sprawdź!", messageReviewName: productName1Notification}}});
								} else {
									Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "A new snippet has made it to the top five of the \"" + productName1Notification + "\" review. Check it out!", messageReviewName: productName1Notification}}});
								}
							} else {
								var productName2Notification = Mongo.Collection.get(reviewCollection).find(querySelectorCommentsArray).fetch()[0]['productName2'];
					
								if (Meteor.user().profile.languagePref == 'pl') {
									Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "Nowy wycinek doszedł do pierwszej piątki w recenzji \"" + productName1Notification + " vs " + productName2Notification + "\". Sprawdź!", messageReviewName: productName1Notification + " vs " + productName2Notification}}});
								} else {
									Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "A new snippet has made it to the top five of the \"" + productName1Notification + " vs " + productName2Notification + "\" review. Check it out!", messageReviewName: productName1Notification + " vs " + productName2Notification}}});
								}
							}
							//send message with details about notification
						} else {
							//do nothing; let the loop run out
						}
					}
				}
				
				return true; //signifies highlighted upvote button
	},
	
	commentProPic: function(collection, reviewId, commentId, commentsGroup) {
		check(collection, String);
		check(reviewId, String);
		check(commentId, String);
		check(commentsGroup, String);		
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('commentProPic - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (commentsGroup === 'comments1' || commentsGroup === 'comments2' || commentsGroup === 'commentsLack') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('commentProPic - commentsGroup misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible

		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the review Id entry to 50 characters.");
 		}
 		
 		if (commentId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the snippet Id entry to 50 characters.");
 		}

		collection += 'comments';
		
		var user = this.userId;
		var querySelector = {};
		querySelector['_id'] = reviewId;
		var options = {};
		options['fields'] = {};
		options['fields'][commentsGroup] = 1;

		var comment = Mongo.Collection.get(collection).find(querySelector, options).fetch();
		var indexComment = _.pluck(comment[0][commentsGroup], '_id').indexOf(commentId);
		
		var authorUserId = comment[0][commentsGroup][indexComment]['userId'];
		var proPic = Meteor.users.findOne({'_id': authorUserId})['profile']['proPic'];
		
		if (proPic) {
			return proPic;
		} else {
			return 'pro_pic_default.png';
		}
	},

	reviewCommentEdit: function(newText, collection, reviewId, commentId, commentsGroup) {
		check(newText, String);
		check(collection, String);
		check(reviewId, String);
		check(commentId, String);
		check(commentsGroup, String);

		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('reviewCommentEdit - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (commentsGroup === 'comments1' || commentsGroup === 'comments2' || commentsGroup === 'commentsLack') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('reviewCommentEdit - commentsGroup misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible

		if(!Meteor.user()) {
			throw new Meteor.Error("Logged-Out", "Sorry! You have to be logged in to edit a snippet");
		}
		
		if(newText === '') {
			throw new Meteor.Error("No Text", "Sorry. Your snippet couldn't be saved because no text was received. To see your previous snippet, please refresh the page.");
		}
		
		if(newText.length > 1000) {
			throw new Meteor.Error("Too long", "Please limit your snippet to 1000 characters.");
		}
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
 		
 		if (reviewId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your review Id to greater than 0 characters.");
 		}
 		
 		if (commentId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the snippet id to 50 characters.");
 		}
 		
 		if (commentId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your comment Id to greater than 0 characters.");
 		}
		
		collection += 'comments';
		
		var user = this.userId;
		var querySelector = {};
		querySelector['_id'] = reviewId;
		var options = {};
		options['fields'] = {};
		options['fields'][commentsGroup] = 1;

		var comment = Mongo.Collection.get(collection).find(querySelector, options).fetch();
		var indexComment = _.pluck(comment[0][commentsGroup], '_id').indexOf(commentId);
		
		if (_.pluck(comment[0][commentsGroup], 'userId')[indexComment] === user) {
			var querySelector2 = {};
			querySelector2['_id'] = reviewId;
			var querySelectorFourthField = commentsGroup;
			querySelectorFourthField += '._id';
			querySelector2[querySelectorFourthField] = commentId;
			var update = {};
			var updateFirstField = commentsGroup;
			updateFirstField += '.' + indexComment + '.comment';
			update[updateFirstField] = newText;
			var updateSecondField = commentsGroup;
			updateSecondField += '.' + indexComment + '.lastUpdated';
			update[updateSecondField] = new Date();
			
			Mongo.Collection.get(collection).update(querySelector2, {$set: update});
			
			return newText;
		}
	},
	
	reviewCommentDelete: function(collection, reviewId, commentsGroup, comment, submitted, commentId) {
		check(collection, String);
		check(reviewId, String);
		check(commentsGroup, String);
		check(comment, String);
		check(submitted, String);
		check(commentId, String);
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('reviewCommentDelete - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (commentsGroup === 'comments1' || commentsGroup === 'comments2' || commentsGroup === 'commentsLack') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('reviewCommentDelete - commentsGroup misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible

		var user = this.userId;		

		if(!user) {
			throw new Meteor.Error("Logged-Out", "Sorry! You have to be logged in to delete a snippet");
		}
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the review Id entry to 50 characters.");
 		}
 		
 		if (reviewId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your review Id to greater than 0 characters.");
 		}
 		
 		if (comment.length > 1000) {
			throw new Meteor.Error("Too long", "Please limit your snippet to 1000 characters.");
 		}
 		
 		if (submitted.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the submitted entry to 50 characters.");
 		}
 		
 		if (commentId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the comment Id entry to 50 characters.");
 		}
 		
 		if (commentId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your comment Id to greater than 0 characters.");
 		}
		
		collection += 'comments';
		
		var pull = {};
		var cGroup = commentsGroup;
		pull[cGroup] = {};
		var commentIdField = '_id';
		pull[cGroup][commentIdField] = commentId;
		var commentField = 'comment';
		pull[cGroup][commentField] = comment;
		var userIdField = 'userId';
		pull[cGroup][userIdField] = user;
		var submittedField = 'submitted';
		pull[cGroup][submittedField] = submitted;
		
		var checkFind = {};
		checkFind['_id'] = reviewId; 
		checkFind[commentsGroup + '._id'] = commentId;
		
		var commentCollection = Mongo.Collection.get(collection).find(checkFind).fetch()[0][commentsGroup];
		
		var dateDeleted = new Date();
		
		var siReview = SearchIndex.find({_id: reviewId}).fetch();
		var siDate = dateDeleted.getDate() + '-' + dateDeleted.getMonth() + '-' + dateDeleted.getFullYear();
	
	
		for (var i = 0; i < commentCollection.length; i++) {
			if (commentCollection[i]['_id'] === commentId) {
				if (commentCollection[i]['userId'] === user) {
					//just a double check on alleged ownership
					
					if (siReview[0]['trendingUpdate'] === siDate) {
						if (siReview[0]['trendingCount'] == 0) {
							//do not push below 0 - proceed further
						} else {
							SearchIndex.update({_id: reviewId}, { $inc: { 'trendingCount': -1}});
						}
					} else {
						SearchIndex.update({_id: reviewId}, { $set: {'trendingUpdate': siDate, 'trendingCount': 0} });
					};
					//to prevent spamming abuse to get onto trending page

					Mongo.Collection.get(collection).update({_id: reviewId}, {$pull: pull});
					
					return;
					//return to avoid unnecessary processes
				}
			}
		}
	},
	
	//Category Proposal Insert Method
	
	newCategoryProposalInsert: function(proposalAttributes) {
		check(proposalAttributes, {
				proposedName: String
			});
		
		if (proposalAttributes.proposedName === '') {
			throw new Meteor.Error("Incomplete Form", "Please fill in all required form fields to propose a new category.");
		}
	
		if (proposalAttributes.proposedName.length > 50) {
			throw new Meteor.Error("Too Long", "Please limit category proposals to 50 characters.");
		}
	
		var proposal = _.extend(proposalAttributes, {
			submitted: new Date()
		});
	
		CategoryProposals.insert(proposal, function(error){
			if (error) {
				console.log('newCategoryProposalInsert - ' + error);
				throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
			}
		});
		
		Meteor.users.update({_id: 'coftxS5cw7XjcfTNd'}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "New Category Proposal - " + proposalAttributes.proposedName}}});
	},
	
	//User Feedback Methods
	suggestionInsert: function(suggestion) {
		check(suggestion, String);
		
		var user = this.userId;
		
		if (!user) {
			throw new Meteor.Error("Logged-Out", "Sorry! You have to be logged in to submit a suggestion.");
		}
		
		if (suggestion.length > 10000) {
			throw new Meteor.Error("Too Long", "Wow! Thanks for such a response! However, it's a little too long for us. If you'd like, you can leave an email address in your suggestion/question with which you can be contacted to discuss your idea/question in more detail.");
		}
		
		if (suggestion.length === 0) {
			throw new Meteor.Error("No Text", "Sorry. Your suggestion couldn't be saved because no text was received. Please try again.");
		}
		
		Suggestions.insert({ suggestion: suggestion, user: user, submitted: new Date() }, function(error){
			if (error) {
				console.log('suggestionInsert - ' + error);
				throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
			}
		});
		
		Meteor.users.update({_id: 'coftxS5cw7XjcfTNd'}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "New Suggestion/Question - " + suggestion}}});
	},
	
	flagCommentInsert: function(category, reviewId, flagCommentExplanation, flagComment, flagCommentsGroup, flagCommentId) {
		check(category, String);
		check(reviewId, String);
		check(flagCommentExplanation, String);
		check(flagComment, String);
		check(flagCommentsGroup, String);
		check(flagCommentId, String);
		
		if (category === 'camerasreviews' || category === 'phonesreviews' || category === 'computersreviews' || category === 'tvsreviews' || category === 'consolesreviews' || category === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('flagCommentInsert - category misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		let user = this.userId;
		
		if (!user) {
			throw new Meteor.Error("Logged-Out", "Sorry! You have to be logged in to submit a flag.");
		}
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the review Id entry to 50 characters.");
 		}
 		
 		if (flagComment.length > 1000) {
			throw new Meteor.Error("Too long", "Please limit the flagged snippet to 1000 characters.");
 		}
 		
 		if (flagCommentId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the flagged snippet's id entry to 50 characters.");
 		}
		
		if (flagCommentExplanation.length > 10000) {
			throw new Meteor.Error("Too Long", "Please shorten your explanation to less than 10,000 characters.");
		}
		
		if (flagCommentExplanation.length === 0) {
			throw new Meteor.Error("No Text", "Sorry. Your flag couldn't be saved because no text was received. Please submit a flag with text.");
		}
		
		if (flagCommentsGroup === 'comments1' || flagCommentsGroup === 'comments2' || flagCommentsGroup === 'commentsLack') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('flagCommentInsert - commentsGroup misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		Flags.insert({ Type: 'Snippet', flagCommentExplanation: flagCommentExplanation, flagComment: flagComment, category: category, reviewId: reviewId, flagCommentsGroup: flagCommentsGroup, flagCommentId: flagCommentId, flaggingUser: user, submitted: new Date() }, function(error){
			if (error) {
				console.log('flagCommentInsert - ' + error);
				throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
			}
		});
		
		let categoryComments = category + 'comments';
		
		let categoryCommentsObject = Mongo.Collection.get(categoryComments).find({_id: reviewId}).fetch();
		
		let snippetsGroup = categoryCommentsObject[0][flagCommentsGroup];
		
		let flaggedUserId;
		
		for (var i = 0; i < snippetsGroup.length; i++) {
			if (snippetsGroup[i]['_id'] == flagCommentId) {
				flaggedUserId = snippetsGroup[i]['userId'];
				break;
			}
		}
		
		if (flaggedUserId.length < 1) {
			throw new Meteor.Error("Something went wrong with the flaggedUserId");
 		}
		
		if (UserFlagsReceived.find({userId: flaggedUserId}).length) {
			UserFlagsReceived.update({userId: flaggedUserId}, {$push: {'flags': {Type: 'Snippet', flagCommentId: flagCommentId, submitted: new Date()}}});
		} else {
			UserFlagsReceived.insert({userId: flaggedUserId, 'flags': [{Type: 'Snippet', flagCommentId: flagCommentId, submitted: new Date()}]});
		}
		
		Meteor.users.update({_id: this.userId}, {$inc: {'profile.flagsSent': 1}});
		
		Meteor.users.update({_id: 'coftxS5cw7XjcfTNd'}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "New Review/Comment Flag - " + flagCommentExplanation + ' ::: ' + flagComment}}});
	},
	
	flagInsert: function(flagExplanation, category, reviewId) {
		check(flagExplanation, String);
		check(category, String);
		check(reviewId, String);
		
		let user = this.userId;
		
		if (!user) {
			throw new Meteor.Error("Logged-Out", "Sorry! You have to be logged in to submit a flag.");
		}
		
		if (flagExplanation.length > 10000) {
			throw new Meteor.Error("Too Long", "Please shorten your explanation to less than 10,000 characters.");
		}
		
		if (flagExplanation.length === 0) {
			throw new Meteor.Error("No Text", "Sorry. Your flag couldn't be accepted because no text was received. Please submit a flag with text.");
		}
		
		if (category === 'camerasreviews' || category === 'phonesreviews' || category === 'computersreviews' || category === 'tvsreviews' || category === 'consolesreviews' || category === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('flagInsert - category misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the review Id entry to 50 characters.");
 		}
		
		Flags.insert({ Type: 'Review', flagExplanation: flagExplanation, category: category, reviewId: reviewId, flaggingUser: user, submitted: new Date() }, function(error){
			if (error) {
				console.log('flagInsert - ' + error);
				throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
			}
		});
		
		let reviewObject = Mongo.Collection.get(category).find({_id: reviewId}).fetch();
		
		let flaggedUserId = reviewObject[0]['userId'];
		
		if (flaggedUserId.length < 1) {
			throw new Meteor.Error("Something went wrong with the flaggedUserId");
 		}
		
		if (UserFlagsReceived.find({userId: flaggedUserId}).length) {
			UserFlagsReceived.update({userId: flaggedUserId}, {$push: {'flags': {Type: 'Review', flagReviewId: reviewId, submitted: new Date()}}});
		} else {
			UserFlagsReceived.insert({userId: flaggedUserId, 'flags': [{Type: 'Review', flagReviewId: reviewId, submitted: new Date()}]});
		}
		
		Meteor.users.update({_id: this.userId}, {$inc: {'profile.flagsSent': 1}});
		
		Meteor.users.update({_id: 'coftxS5cw7XjcfTNd'}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "New Review Flag - " + flagExplanation}}});
	}
});
