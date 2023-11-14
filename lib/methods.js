Meteor.methods({
	//Landing Page Methods
	
	deleteNotificationAlert: function() {
		Meteor.users.update({_id: this.userId}, {$set: {'profile.notificationCount': 0}}, function(error) {
			if (error) {
				console.log('deleteNotificationAlert - ' + error);
				throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
			}
		});
	},
	
	suggestionsMethod: function(searchString1, language) {
		check(searchString1, String);
		check(language, String);
 
 		if (searchString1.length > 100) {
			throw new Meteor.Error("Too long", "Please limit your search entry to 100 characters.");
 		}
 
 		if (language === 'en' || language === 'pl') {
			//proceed
		} else {
			//else exit to avoid malevolent action but assume innocence
			console.log('suggestionsMethod - lang misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
 
 		searchString1 = new RegExp(searchString1, "i");
 
 		let query = {};
 		query['revTitleBit'] = searchString1;
 		query['language'] = language;
 
		let cursor1 = SpellCheck.find(query).fetch();
		
		return cursor1;
	},
	
	IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement: function() {
		if (!this.userId) {
			return;
		} //return to avoid unnecessary errors
		
		Meteor.users.update({_id: this.userId},{$set: {'profile.privacyFCUnderstand': true}}, function(error){
			if (error) {
				console.log('legal - ' + error);
				throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
			}
		});
	},

	a_12_09_2017_IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement: function() {
		if (!this.userId) {
			return;
		} //return to avoid unnecessary errors
		
		Meteor.users.update({_id: this.userId},{$set: {'profile.privacyFCUnderstandAmend12_09_2017': true}}, function(error){
			if (error) {
				console.log('legal ammendment - ' + error);
				throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
			}
		});
	},
	
	//Search Landing Page Methods	
	spellCheckSuggestionsMethod: function(language, searchString1, searchString2, range1, range2) {
		check(language, String);
		check(searchString1, String);
		check(searchString2, String);
		check(range1, Number);
		check(range2, Number);
		
		if (searchString1.length > 100 || searchString2.length > 100) {
			throw new Meteor.Error("Too long", "Please limit your search entry to 100 characters.");
 		}
		
		if (language === 'en' || language === 'pl') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('spellCheckSuggestionsMethod - lang misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible

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

		let query1 = {};
		query1['revTitleBit'] = searchString1;
		query1['language'] = language;
		query1['price1'] = {};
		query1['price1']['$gte'] = range1;
		query1['price1']['$lte'] = range2;
		query1['price2'] = {};
		query1['price2']['$gte'] = range1;
		query1['price2']['$lte'] = range2; 


		let query2 = {};
		query2['revTitleBit'] = searchString2;
		query2['language'] = language;
		query2['price1'] = {};
		query2['price1']['$gte'] = range1;
		query2['price1']['$lte'] = range2;
		query2['price2'] = {};
		query2['price2']['$gte'] = range1;
		query2['price2']['$lte'] = range2;
		
		let tempCursorQueryPart = {};
		tempCursorQueryPart['language'] = language;
		tempCursorQueryPart['price1'] = {};
		tempCursorQueryPart['price1']['$gte'] = range1;
		tempCursorQueryPart['price1']['$lte'] = range2;
		tempCursorQueryPart['price2'] = {};
		tempCursorQueryPart['price2']['$gte'] = range1;
		tempCursorQueryPart['price2']['$lte'] = range2;
		
		if(searchString1 != 'null' && searchString2 != 'null') {
			let cursor1 = SpellCheck.find(query1).fetch();
			let cursor2 = SpellCheck.find(query2).fetch();

			if(cursor1.length === 0 || cursor2.length === 0) {
				let tempCursor = SpellCheck.find(tempCursorQueryPart, { revTitleBit: true }).fetch();

				let bestWord1 = mostSimilarString(tempCursor, "revTitleBit", searchString1, -1, false);
				let bestWord2 = mostSimilarString(tempCursor, "revTitleBit", searchString2, -1, false);
				
				if (bestWord1 == bestWord2) {
					let revTitleBitArray = _.pluck(tempCursor, "revTitleBit");
					
					let newTempCursor = _.without(revTitleBitArray, bestWord2);
					
					bestWord2 = mostSimilarString(newTempCursor, "revTitleBit", searchString2, -1, false);
				}
				
				if (bestWord1 || bestWord2) {
					let bestWordPhrase;
					
					if (bestWord1) { 
						bestWordPhrase= bestWord1 + ' vs ' + bestWord2;
					} else {
						bestWordPhrase= bestWord2 + ' vs ' + bestWord1;
					}
				
					return bestWordPhrase;
				}
			}	
		} else if (searchString1 != 'null' || searchString2 != 'null') {
			if (searchString1 != 'null') {
				let cursor1 = SpellCheck.find(query1).fetch();
				
				if (cursor1.length === 0) {
					let tempCursor = SpellCheck.find(tempCursorQueryPart, { revTitleBit: true }).fetch();
					
					let bestWord1 = mostSimilarString(tempCursor, "revTitleBit", searchString1, -1, false);
					
					if (bestWord1) {
						let bestWordPhrase = bestWord1;

						return bestWordPhrase;
					}
				}
			} else if (searchString2 != 'null') {
				let cursor2 = SpellCheck.find(query2).fetch();

				if (cursor2.length === 0) {
					let tempCursor = SpellCheck.find(tempCursorQueryPart, { revTitleBit: true }).fetch();

					let bestWord2 = mostSimilarString(tempCursor, "revTitleBit", searchString2, -1, false);
					
					if (bestWord2) {
						let bestWordPhrase = bestWord2;
					
						return bestWordPhrase;
					}
				}
			}
		}
	},
	
	hasMoreSearchMethod: function(searchString1, searchString2, typeFilter, range1, range2, searchLimit, currentLangLabel) {
		check(searchString1, String);
		check(searchString2, String);
		check(typeFilter, String);
		check(range1, Number);
		check(range2, Number);
		check(searchLimit, Number);
		check(currentLangLabel, String);
		
		if (searchString1.length > 100 || searchString2.length > 100) {
			throw new Meteor.Error("Too long", "Please limit your search entry to 100 characters.");
 		}
 		
 		if (searchLimit < 1) {
			searchLimit = 1;
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
		
		if (typeFilter === 'single' || typeFilter === 'comparison' || typeFilter === 'all') {
			//proceed
		} else {
			//else exit to avoid malevolent but assume innocence
			throw new Meteor.Error("Check Spelling in Web Address", "If you encountered this error while normally using this app (by using the provided buttons), first please check the spelling in the url. If that checks out, please send, if you'd like, a quick notice (click on the \"Ask or Tell\" at the bottom of the page).");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (currentLangLabel === 'en' || currentLangLabel === 'pl') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('hasMoreSearchMethod - lang misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
	
		let collectionDocument;
	
		if (searchString1 != 'null' && searchString2 != 'null') {
			var searchPhrase1 = searchString1;
			var searchPhrase2 = searchString2;
		
			//eliminate all spaces
			var cleanPhrase1 = searchPhrase1.replace(/ /gi, "");

			var finalregPhrase1 = '\\s*';
			var regPhrase1 = cleanPhrase1.match(/.{0,1}/g);
			finalregPhrase1 += regPhrase1.join('\\s*');
		
			//eliminate all spaces
			var cleanPhrase2 = searchPhrase2.replace(/ /gi, "");

			var finalregPhrase2 = '\\s*';
			var regPhrase2 = cleanPhrase2.match(/.{0,1}/g);
			finalregPhrase2 += regPhrase2.join('\\s*');
		
			var regExpObject1 = new RegExp(finalregPhrase1, "i");
			var regExpObject2 = new RegExp(finalregPhrase2, "i");

			if (SearchIndex.find({$and: [{revTitle1: {$regex: regExpObject1} }, {revTitle2: {$regex: regExpObject2}}], language: currentLangLabel}, {score: {$meta: "textScore"}, limit: searchLimit}).fetch().length > 0) {
				if (typeFilter === 'all') {
					collectionDocument = SearchIndex.aggregate( [
						{ $match: {$and: [{revTitle1: {$regex: regExpObject1} }, {revTitle2: {$regex: regExpObject2}}, {price1: {$gte: range1}}, {price1: {$lte: range2}}, {price2: {$gte: range1}}, {price2: {$lte: range2}}], language: currentLangLabel }}, 
						{ $project: { single: 1, revTitle1: 1, revTitle2: 1 } }
					]);
				} else if (typeFilter === 'single') {
					collectionDocument = SearchIndex.aggregate( [
						{ $match: {$and: [{revTitle1: {$regex: regExpObject1}}, {price1: {$gte: range1}}, {price1: {$lte: range2}}], single: true, language: currentLangLabel } }, 
						{ $project: { single: 1, revTitle1: 1, revTitle2: 1 } }
					]);
				} else if (typeFilter === 'comparison') {
					collectionDocument = SearchIndex.aggregate( [
						{ $match: {$and: [{revTitle1: {$regex: regExpObject1} }, {revTitle2: {$regex: regExpObject2}}, {price1: {$gte: range1}}, {price1: {$lte: range2}}, {price2: {$gte: range1}}, {price2: {$lte: range2}}], single: false, language: currentLangLabel } }, 
						{ $project: { single: 1, revTitle1: 1, revTitle2: 1 } }
					]);
				}
			} else if (SearchIndex.find({$and: [{revTitle1: {$regex: regExpObject2} }, {revTitle2: {$regex: regExpObject1}}], language: currentLangLabel}, {score: {$meta: "textScore"}, limit: searchLimit}).fetch().length > 0) {
				if (typeFilter === 'all') {
					collectionDocument = SearchIndex.aggregate( [
						{ $match: {$and: [{revTitle1: {$regex: regExpObject2} }, {revTitle2: {$regex: regExpObject1}}, {price1: {$gte: range1}}, {price1: {$lte: range2}}, {price2: {$gte: range1}}, {price2: {$lte: range2}}], language: currentLangLabel }}, 
						{ $project: { single: 1, revTitle1: 1, revTitle2: 1 } }
					]);
				} else if (typeFilter === 'single') {
					collectionDocument = SearchIndex.aggregate( [
						{ $match: {$and: [{revTitle1: {$regex: regExpObject2}}, {price1: {$gte: range1}}, {price1: {$lte: range2}}], single: true, language: currentLangLabel } }, 
						{ $project: { single: 1, revTitle1: 1, revTitle2: 1 } }
					]);
				} else if (typeFilter === 'comparison') {
					collectionDocument = SearchIndex.aggregate( [
						{ $match: {$and: [{revTitle1: {$regex: regExpObject2} }, {revTitle2: {$regex: regExpObject1}}, {price1: {$gte: range1}}, {price1: {$lte: range2}}, {price2: {$gte: range1}}, {price2: {$lte: range2}}], single: false, language: currentLangLabel } }, 
						{ $project: { single: 1, revTitle1: 1, revTitle2: 1 } }
					]);
				}
			}
		/// now searchSingle 'Methods'
		} else if (searchString1 === 'null' || searchString2 === 'null') {
			if (searchString1 != 'null') {
				//eliminate all spaces
				var cleanPhrase1 = searchString1.replace(/ /gi, "");

				var finalregPhrase1 = '\\s*';
				var regPhrase1 = cleanPhrase1.match(/.{0,1}/g);
				finalregPhrase1 += regPhrase1.join('\\s*');

				var regExpObject1 = new RegExp(finalregPhrase1, "i");

				if (SearchIndex.find({$or: [{revTitle1: {$regex: regExpObject1} }, {revTitle2: {$regex: regExpObject1}}], language: currentLangLabel}, {score: {$meta: "textScore"}, limit: searchLimit}).fetch().length > 0) {
					if (typeFilter === 'all') {
						collectionDocument = SearchIndex.aggregate( [
							{ $match: {$or: [{revTitle1: {$regex: regExpObject1} }, {revTitle2: {$regex: regExpObject1}}], $and: [{price1: {$gte: range1}}, {price1: {$lte: range2}}, {price2: {$gte: range1}}, {price2: {$lte: range2}}], language: currentLangLabel }}, 
							{ $project: { single: 1, revTitle1: 1, revTitle2: 1 } }
						]);
					} else if (typeFilter === 'single') {
						collectionDocument = SearchIndex.aggregate( [
							{ $match: {revTitle1: {$regex: regExpObject1}, $and: [{price1: {$gte: range1}}, {price1: {$lte: range2}}],  single: true, language: currentLangLabel } }, 
							{ $project: { single: 1, revTitle1: 1, revTitle2: 1 } }
						]);
					} else if (typeFilter === 'comparison') {
						collectionDocument = SearchIndex.aggregate( [
							{ $match: {$or: [{revTitle1: {$regex: regExpObject1} }, {revTitle2: {$regex: regExpObject1}}], $and: [{price1: {$gte: range1}}, {price1: {$lte: range2}}, {price2: {$gte: range1}}, {price2: {$lte: range2}}], single: false, language: currentLangLabel } }, 
							{ $project: { single: 1, revTitle1: 1, revTitle2: 1 } }
						]);
					}
				}
			} else if (searchString2 != 'null') {
				//eliminate all spaces
				var cleanPhrase2 = searchString2.replace(/ /gi, "");

				var finalregPhrase2 = '\\s*';
				var regPhrase2 = cleanPhrase2.match(/.{0,1}/g);
				finalregPhrase2 += regPhrase2.join('\\s*');
		
				var regExpObject2 = new RegExp(finalregPhrase2, "i");

				if (SearchIndex.find({$or: [{revTitle1: {$regex: regExpObject2} }, {revTitle2: {$regex: regExpObject2}}], language: currentLangLabel}, {score: {$meta: "textScore"}, limit: searchLimit}).fetch().length > 0) {
					if (typeFilter === 'all') {
						collectionDocument = SearchIndex.aggregate( [
							{ $match: {$or: [{revTitle1: {$regex: regExpObject2} }, {revTitle2: {$regex: regExpObject2}}], $and: [{price1: {$gte: range1}}, {price1: {$lte: range2}}, {price2: {$gte: range1}}, {price2: {$lte: range2}}], language: currentLangLabel }}, 
							{ $project: { single: 1, revTitle1: 1, revTitle2: 1 } }
						]);
					} else if (typeFilter === 'single') {
						collectionDocument = SearchIndex.aggregate( [
							{ $match: {revTitle1: {$regex: regExpObject2}, $and: [{price1: {$gte: range1}}, {price1: {$lte: range2}}], single: true, language: currentLangLabel } }, 
							{ $project: { single: 1, revTitle1: 1, revTitle2: 1 } }
						]);
					} else if (typeFilter === 'comparison') {
						collectionDocument = SearchIndex.aggregate( [
							{ $match: {$or: [{revTitle1: {$regex: regExpObject2} }, {revTitle2: {$regex: regExpObject2}}], $and: [{price1: {$gte: range1}}, {price1: {$lte: range2}}, {price2: {$gte: range1}}, {price2: {$lte: range2}}], single: false, language: currentLangLabel } }, 
							{ $project: { single: 1, revTitle1: 1, revTitle2: 1 } }
						]);
					}
				}
			}
		}
		
		if (!collectionDocument) {
			return false;
		}
		
		if (searchLimit < collectionDocument.length) {
			return true;
		} else if (searchLimit >= collectionDocument.length){
			return false;
		}
	},
	
	//Account Page Methods
	deNotifyBullHornReview: function(reviewId) {
		check(reviewId, String);
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the reviewId to 50 characters.");
 		}
	
		var userBullHornReviews = Meteor.users.find({_id: this.userId}).fetch()[0]['profile']['bullHornReviews'];
	
		for (var t = 0; t < userBullHornReviews.length; t++) {
			if (userBullHornReviews[t]['_id'] == reviewId) {
				var buildBHPAccess;
				buildBHPAccess = {};
				buildBHPAccess['$set'] = {};
				buildBHPAccess['$set']['profile.bullHornReviews.' + t + '.hasNotifications'] = false;
				
				Meteor.users.update({_id: this.userId}, buildBHPAccess);
			}
		}
	},
	
	getSMUserPic: function() {
		let user = Meteor.user();
		
		if (!user) {
			throw new Meteor.Error("Logged-Out", "Please log in to view your social media profile picture.");
		}
	
		if (user.services.facebook) {
			return 'facebookId - ' + user.services.facebook.id;
		} else {
			return user.services.google.picture;
		}
	},
	
	proPicSave: function(proPicOption) {
		check(proPicOption, String);
		
		let userProfile = Meteor.user();
		
		if (!userProfile) {
			throw new Meteor.Error("Logged-Out", "Please log in to change your profile picture.");
		}
		
		let proPicOptionTranslated;
		
		if (proPicOption === 'proPicSM' || proPicOption === 'proPicDefault' || proPicOption === 'proPic1' || proPicOption === 'proPic2' || proPicOption === 'proPic3' || proPicOption === 'proPic4' || proPicOption === 'proPic5' || proPicOption === 'proPic6') {
			switch (proPicOption) {
				case 'proPicSM':
					if (userProfile.services.facebook) {
						proPicOptionTranslated = 'facebookId - ' + userProfile.services.facebook.id;
					} else {
						proPicOptionTranslated =  userProfile.services.google.picture;
					}
					break;
				case 'proPicDefault':
					proPicOptionTranslated = 'pro_pic_default.png';
					break;
				case 'proPic1':
					proPicOptionTranslated = 'pro_pic_1.png';
					break;
				case 'proPic2':
					proPicOptionTranslated = 'pro_pic_2.png';
					break;
				case 'proPic3':
					proPicOptionTranslated = 'pro_pic_3.png';
					break;
				case 'proPic4':
					proPicOptionTranslated = 'pro_pic_4.png';
					break;
				case 'proPic5':
					proPicOptionTranslated = 'pro_pic_5.png';
					break;
				case 'proPic6':
					proPicOptionTranslated = 'pro_pic_6.png';
					break;
				default:
					//do nothing
					break;
			} 
		} else {
			//else exit to avoid unnecessary errors
			console.log('proPic misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		let user = this.userId;
		
		Meteor.users.update({_id: user},{$set: {'profile.proPic': proPicOptionTranslated}}, function(error){
			if (error) {
				console.log('proPicSave - ' + error);
				throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
			}
		});
	},
	
	userMessageRemove: function(messageRemoveObject) {
		check(messageRemoveObject, {
			messageText: String,
			messageId: String	
		});
		
		let user = this.userId;
		
		if (!user) {
			throw new Meteor.Error("Logged-Out", "Please log in to delete your messages.");
		}
		
		Meteor.users.update({_id: user}, {$pull: {'profile.messages': {messageId: messageRemoveObject.messageId, messageText: messageRemoveObject.messageText}}});
	},
	
	noYoutube: function() {
		let user = Meteor.user();
	
		Meteor.users.update({_id: this.userId},{$set: {'profile.youtubeSettings': false, 'profile.youtubeApproved': false, 'profile.youtubeLink': 'null'}}, function(error){
			if (error) {
				console.log('noYoutube - ' + error);
				throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
			}
		});
		
		
		let user_activity = UserActivityArchives.find({_id: user._id}).fetch()['userActivity'];
		
		if (user_activity) {
			for (var i = 0; i < user_activity.length; i++) {
				if (user_activity[i]['type'] === 'commentInsert') {
					let collection = user_activity[i]['collection'];
					let reviewId = user_activity[i]['reviewId'];
					let commentsGroup = user_activity[i]['commentsGroup'];
					let commentId = user_activity[i]['commentId'];
				
					let querySelector = {};
					querySelector['_id'] = reviewId;
					let options = {};
					options['fields'] = {};
					options['fields'][commentsGroup] = 1;

					let comment = Mongo.Collection.get(collection).find(querySelector, options).fetch();
					let indexComment = _.pluck(comment[0][commentsGroup], '_id').indexOf(commentId);
				
					let querySelector2 = {};
					querySelector2['_id'] = reviewId;
					let querySelector2SecondField = commentsGroup;
					querySelector2SecondField += '._id';
					querySelector2[querySelector2SecondField] = commentId;
				
					var update = {};
					var updateFirstField = commentsGroup;
					updateFirstField += '.' + indexComment + '.youtubeLink';
					update[updateFirstField] = 'null';
			
					Mongo.Collection.get(collection).update(querySelector2, {$set: update});
				}
			}
		}
	},
	
	likeSettingsPrefSave: function(pref, showShare, showShareRec, cSSSetting, reviewSearchBoxPref) {
		check(pref, Match.Maybe(String));
		check(showShare, Match.Maybe(Boolean));
		check(showShareRec, Match.Maybe(Boolean));
		check(cSSSetting, Match.Maybe(String));
		check(reviewSearchBoxPref, Match.Maybe(String));
		
		if (!this.userId) {
			throw new Meteor.Error("Logged-Out", "Please log in to change your account settings.");
		}
		
		if (pref === 'top') {
			Meteor.users.update({_id: this.userId},{$set: {'profile.likeSettings': 'top'}}, function(error){
				if (error) {
					console.log('likeSettingsPrefSave - ' + error);
					throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
				}
			});
		} else if (pref === 'bottom') {
			Meteor.users.update({_id: this.userId},{$set: {'profile.likeSettings': 'bottom'}}, function(error){
				if (error) {
					console.log('likeSettingsPrefSave - ' + error);
					throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
				}
			});
		}
		
		if (showShare === true) {
			Meteor.users.update({_id: this.userId},{$set: {'profile.showShareSettings': true}}, function(error){
				if (error) {
					console.log('likeSettingsPrefSave - ' + error);
					throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
				}
			});
		} else if (showShare === false) {
			Meteor.users.update({_id: this.userId},{$set: {'profile.showShareSettings': false}}, function(error){
				if (error) {
					console.log('likeSettingsPrefSave - ' + error);
					throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
				}
			});
		}
		
		if (showShareRec === true) {
			Meteor.users.update({_id: this.userId},{$set: {'profile.showShareRecSettings': true}}, function(error){
				if (error) {
					console.log('likeSettingsPrefSave - ' + error);
					throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
				}
			});
		} else if (showShareRec === false) {
			Meteor.users.update({_id: this.userId},{$set: {'profile.showShareRecSettings': false}}, function(error){
				if (error) {
					console.log('likeSettingsPrefSave - ' + error);
					throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
				}
			});
		}
		
		if (cSSSetting === 'left') {
			Meteor.users.update({_id: this.userId},{$set: {'profile.cSSSetting': 'left'}}, function(error){
				if (error) {
					console.log('likeSettingsPrefSave - ' + error);
					throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
				}
			});
		} else if (cSSSetting === 'right') {
			Meteor.users.update({_id: this.userId},{$set: {'profile.cSSSetting': 'right'}}, function(error){
				if (error) {
					console.log('likeSettingsPrefSave - ' + error);
					throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
				}
			});
		} else if (cSSSetting === 'both') {
			Meteor.users.update({_id: this.userId},{$set: {'profile.cSSSetting': 'both'}}, function(error){
				if (error) {
					console.log('likeSettingsPrefSave - ' + error);
					throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
				}
			});
		}
		
		if (reviewSearchBoxPref === 'top') {
			Meteor.users.update({_id: this.userId},{$set: {'profile.reviewSearchBoxPref': 'top'}}, function(error){
				if (error) {
					console.log('likeSettingsPrefSave - ' + error);
					throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
				}
			});
		} else if (reviewSearchBoxPref === 'bottom') {
			Meteor.users.update({_id: this.userId},{$set: {'profile.reviewSearchBoxPref': 'bottom'}}, function(error){
				if (error) {
					console.log('likeSettingsPrefSave - ' + error);
					throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
				}
			});
		}
	},
	
	userLanguageSave: function(languageSelected) {
		check(languageSelected, String);
	
		if (languageSelected === 'en' || languageSelected === 'pl') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('userLanguageSave - lang misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
	
		if (!this.userId) {
			throw new Meteor.Error("Logged-Out", "Please log in to change your language setting.");
		}
		
		Meteor.users.update({_id: this.userId},{$set: {'profile.languagePref': languageSelected}}, function(error){
			if (error) {
				console.log('userLanguageSave - ' + error);
				throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
			}
		});
	},

	//Newest Page Methods
	
	hasMoreNewestMethod: function(language, newestPostsLimit) {
		check(language, String);
		check(newestPostsLimit, Number);
		
		if (language === 'en' || language === 'pl') {
			//proceed
		} else {
			//else exit to avoid malevolent action but assume innocence
			console.log('hasMoreNewestMethod - lang misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		let newestCollection;

		let query = {};
		query['language'] = language;

		newestCollectionLength = SearchIndex.find(query).fetch().length;
		
		if (newestPostsLimit < newestCollectionLength) {
			return true;
			//indicate that more posts exist
		} else {
			return false;
		}
	},
	
	//Review Page Methods
	
	//related to review page but actually in router
	getReviewSEO: function(collection, reviewId) {
		check(collection, String);
		check(reviewId, String);
	
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit the reviewId entry to 50 characters.");
 		}
	
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('getReviewSEO - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible

		return Mongo.Collection.get(collection).find({_id: reviewId}, { fields: {'_id': 1, 'productName1': 1, 'productName2': 1}}).fetch();
	},
	
	countViews: function(reviewId) {
		check(reviewId, String);
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
 		
 		if (reviewId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your review Id to greater than 0 characters.");
 		}
 		//to secure against a database-wide update
 		
 		SearchIndex.update({_id: reviewId}, { $inc: { 'views': 1}});
	},
	
	noReview: function(collection, reviewId) {
		check(collection, String);
		check(reviewId, String);
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('noReview - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
		
		if (!Mongo.Collection.get(collection).find({_id: reviewId}).fetch().length) {
			return true;
		}
	},
	
	bullHornLeftCount: function(collection, reviewId) {
		check(collection, String);
		check(reviewId, String);
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid malevolent action but assume innocence
			console.log('bullHornLeftCount - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
	
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
	
		let hornCount = Mongo.Collection.get(collection).find({_id: reviewId}).fetch()[0]['hornCount'];
		
		return 6 - hornCount;
	},
	
	isYoutubeLinkMethod: function() {
		var userId = this.userId;
		
		if (!userId) {
			return;
			//to avoid unnecessary errors
		}
		
		var userProfile = Meteor.users.find({_id: userId}).fetch();
		
		if (userProfile[0]['profile']['youtubeApproved'] && userProfile[0]['profile']['youtubeSettings']) {
			return true;
		}
	},
	
	getYoutubeLink: function() {
		var userId = this.userId;
		
		var userProfile = Meteor.users.find({_id: userId}).fetch();
		
		if (userProfile[0]['profile']['youtubeApproved'] && userProfile[0]['profile']['youtubeSettings']) {
			return userProfile[0]['profile']['youtubeLink'];
		}
	},
	
	isHorn: function(reviewId) {
		check(reviewId, String);

		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}

		let querySelector = {};
		let querySelectorSecondField = '_id';
		querySelector[querySelectorSecondField] = reviewId;

		let review = SearchIndex.find(querySelector).fetch();

		let today = new Date();
		let todayDate = today.getDate() + '-' + today.getMonth() + '-' + today.getFullYear();
		
		if (review[0]['hornDay'] === todayDate) {
			return true;
		}
	},
	
	RSCountMethod1: function(collection, reviewId) {
		check(collection, String);
		check(reviewId, String);
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid malevolent action but assume innocence
			console.log('RSCountMethod1 - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
		
		collection += 'comments';
		
		var commentsDocument = Mongo.Collection.get(collection).find({_id: reviewId}).fetch();

		if (!commentsDocument.length) {
			return;
		}
		
		var array1 = commentsDocument[0]["comments1"];
		
		return array1.length;
	},
	
	RSCountMethod2: function(collection, reviewId) {
		check(collection, String);
		check(reviewId, String);

		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid malevolent action but assume innocence
			console.log('RSCountMethod2 - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
		
		collection += 'comments';
		
		var commentsDocument = Mongo.Collection.get(collection).find({_id: reviewId}).fetch();
		
		if (!commentsDocument.length) {
			return;
		}
		
		var array2 = commentsDocument[0]["comments2"];
		
		return array2.length;
	},
	
	hasMoreLackMethod: function(collection, reviewId, limitParam) {
		check(collection, String);
		check(reviewId, String);
		check(limitParam, Number);
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid malevolent action but assume innocence
			console.log('hasMoreLackMethod - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible

		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}

		if (limitParam.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your snippet limit to 50 digits.");
 		}

		collection += 'comments';

		var commentsDocument = Mongo.Collection.get(collection).find({_id: reviewId}).fetch();
		
		if (!commentsDocument.length) {
			return;
		}
		
		var arrayLack = commentsDocument[0]["commentsLack"];

		if (limitParam < arrayLack.length ) {
			return true;
			//indicate that more posts exist
		} else {
			return false;
		}
	},
	
	hasMoreLackCount: function(collection, reviewId) {
		check(collection, String);
		check(reviewId, String);
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid malevolent action but assume innocence
			console.log('hasMoreLackCount - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible

		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}

		collection += 'comments';

		var commentsDocument = Mongo.Collection.get(collection).find({_id: reviewId}).fetch();
		
		if (!commentsDocument.length) {
			return;
		}
		
		var arrayLack = commentsDocument[0]["commentsLack"];

		return arrayLack.length;
	},
	
	reviewCommentInsert: function(bareComment, collection, reviewId, commentsGroup) {
		check(bareComment, {
			comment: String
		});
		check(collection, String);
		check(reviewId, String);
		check(commentsGroup, String);
		
		if(!Meteor.user()) {
			throw new Meteor.Error("Logged-Out", "Sorry! You have to be logged in to submit a snippet.");
		}
		
		if (collection === 'camerasreviews' || collection === 'phonesreviews' || collection === 'computersreviews' || collection === 'tvsreviews' || collection === 'consolesreviews' || collection === 'gamesreviews') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('reviewCommentInsert - collection misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (reviewId.length > 50) {
			throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
 		}
 		
 		if (reviewId.length < 1) {
			throw new Meteor.Error("Too short", "Please keep your review Id to greater than 0 characters.");
 		}
		
		if (commentsGroup === 'comments1' || commentsGroup === 'comments2' || commentsGroup === 'commentsLack') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('reviewCommentInsert - commentsGroup misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		if (bareComment.comment.length > 1000) {
			throw new Meteor.Error("Too long", "Please limit your snippet to 1000 characters.");
		}

		if (!bareComment.comment.replace(/\s/g, '').length || 
		 		bareComment.comment === '' ) {
			throw new Meteor.Error("Incomplete Form", "Sorry, your snippet couldn't be saved because no text was received. To see your previous snippet, please refresh the page.");
		}
		
		collection += 'comments';
		
		var submitted = new Date();
		
		var siReview = SearchIndex.find({_id: reviewId}).fetch();
		var siDate = submitted.getDate() + '-' + submitted.getMonth() + '-' + submitted.getFullYear();

		if (siReview[0]['trendingUpdate'] === siDate) {
			SearchIndex.update({_id: reviewId}, { $inc: { 'trendingCount': 1}});
		} else {
			SearchIndex.update({_id: reviewId}, { $set: {'trendingUpdate': siDate, 'trendingCount': 1} });
		};
		
		submitted = submitted.toDateString();
		
		var user = Meteor.user();
		var comment = _.extend(bareComment, {
			userId: user._id,
			submitted: submitted,
			commentsGroup: commentsGroup,
			_id: Random.id(),
			upvotes: 0,
			downvotes: 0,
			upvoteUsers: [],
			downvoteUsers: [],
			totalScore: 0
		});
		
		var set = {};
		set[commentsGroup] = comment;
		 
		Mongo.Collection.get(collection).update({_id: reviewId}, {$push: set});
		
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
		querySelector[querySelectorThirdField] = comment._id;
		
		if (commentsGroup === 'comments1') {
			Mongo.Collection.get(collection).update(querySelector, {$push: {comments1: {$each: [], $sort: {'totalScore': -1}}}});
		} else if (commentsGroup === 'comments2') {
			Mongo.Collection.get(collection).update(querySelector, {$push: {comments2: {$each: [], $sort: {'totalScore': -1}}}});
		} else if (commentsGroup === 'commentsLack') {
			Mongo.Collection.get(collection).update(querySelector, {$push: {commentsLack: {$each: [], $sort: {'totalScore': -1}}}});
		};
		
		var reviewCollection = collection.substring(0, (collection.length - 8));
				
		var userBullHornArray = Mongo.Collection.get(reviewCollection).find({'_id': reviewId}).fetch()[0]['hornCountUsers'];
		
		var goAheadForNotification;
		
		var commentsCollections = Mongo.Collection.get(collection).find({'_id': reviewId}).fetch();
		
		var querySelectorCommentsArray = {};
		var querySelectorCommentsArraySecondField = '_id';
		querySelectorCommentsArray[querySelectorCommentsArraySecondField] = reviewId;
		
		var review = Mongo.Collection.get(reviewCollection).find(querySelectorCommentsArray).fetch();
		
		if (review[0]['single']) {
			if (commentsCollections[0]['comments1'].length > 10 && commentsCollections[0]['comments2'].length > 10) {
				//keep going
			} else {
				goAheadForNotification = true;
			}
		} else {
			if (commentsCollections[0]['comments1'].length > 10 && commentsCollections[0]['comments2'].length > 10 && commentsCollections[0]['commentsLack'].length > 10) {
				//keep going
			} else {
				goAheadForNotification = true;
			}
		}
		//check if a new snippet has made it into the review if the review is not saturated yet

		if (goAheadForNotification) {			
			for (var x = 0; x < userBullHornArray.length; x++) {
				if (userBullHornArray[x] == this.userId) {
					continue;
				}
				//omit own id
				
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

				var productName1Notification = review[0]['productName1'];
				if (review[0]['single']) {
					if (user.profile.languagePref == 'pl') {
						Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "Nowy wycinke był dodany w recenzji \"" + productName1Notification + "\". Sprawdź!", messageReviewName: productName1Notification}}});
					} else {
						Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "A new snippet has been added to the \"" + productName1Notification + "\" review. Check it out!", messageReviewName: productName1Notification}}});
					}
				} else {
					var productName2Notification = review[0]['productName2'];
					
					if (user.profile.languagePref == 'pl') {
						Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "Nowy wycinke był dodany w recenzji \"" + productName1Notification + " vs " + productName2Notification + "\". Sprawdź!", messageReviewName: productName1Notification + " vs " + productName2Notification}}});
					} else {
						Meteor.users.update({_id: userBullHornArray[x]}, {$push: {'profile.messages': {messageId: Random.id(), messageText: "A new snippet has been added to the \"" + productName1Notification + " vs " + productName2Notification + "\" review. Check it out!", messageReviewName: productName1Notification + " vs " + productName2Notification}}});
					}
				}
				//send message with details about notification
			}
		}
		
		if (UserActivityArchives.find({_id: user._id}).count() === 1) {
			UserActivityArchives.update({_id: user._id},{$push: {'userActivity': {type: 'commentInsert', collection: collection, reviewId: reviewId, commentsGroup: commentsGroup, commentId: comment._id}}}, function(error){
				if (error) {
					console.log('reviewCommentInsert - ' + error);
					throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
				}
			});
		} else {
			UserActivityArchives.insert({_id: user._id, userActivity: [{type: 'commentInsert', collection: collection, reviewId: reviewId, commentsGroup: commentsGroup, commentId: comment._id}]});
		}
		//add snippet to user's userActivity
	}
});
