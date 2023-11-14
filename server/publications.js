Meteor.publish('categories', function() {
	return Categories.find({}, { fields: {'_id': 1, 'title': 1, 'reviews': 1}});
});

let categories_publish = {
	type: 'subscription',
	name: 'categories'
};
DDPRateLimiter.addRule(categories_publish, 5, 1000);


//ReviewPage
Meteor.publish('reviewPage', function(category, reviewId, limit) {
	check(category, String);
	check(reviewId, String);
	check(limit, Number);
	
	if (category === 'camerasreviews' || category === 'phonesreviews' || category === 'computersreviews' || category === 'tvsreviews' || category === 'consolesreviews' || category === 'gamesreviews') {
		//proceed
	} else {
		//else exit to avoid malevolent action but assume innocence
		console.log('review publish error - category misspelled?');
		throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
	}
	//basic security practice - limit input value possiblities as much as possible
	
	if (reviewId.length > 50) {
		throw new Meteor.Error("Too long", "Please limit your review Id to 50 characters.");
	}
	
	if (reviewId.length < 1) {
		throw new Meteor.Error("Too short", "Please keep your review Id to greater than 0 characters.");
	}
	
	if (limit < 1) {
		limit = 1;
	}
	
	let categoryComments = category;
	categoryComments += 'comments';
	
	return [Mongo.Collection.get(category).find({_id: reviewId}, { fields: {'_id': 1, 'language': 1, 'single': 1, 'category': 1, 'productName1': 1, 'productName2': 1, 'picUrl1': 1, 'picUrl2': 1, 'likes1': 1, 'likes2': 1, 'hornCount': 1, 'picSource1': 1, 'picSource2': 1, 'product1Price': 1, 'product1PricePlaceLink': 1, 'product1PricePlaceName': 1, 'product2Price': 1, 'product2PricePlaceLink': 1, 'product2PricePlaceName': 1, 'priceNotChecked': 1, 'comparisonCriteria._id': 1, 'comparisonCriteria.compCriteriaName': 1, 'comparisonCriteria.compCriteriaDescription': 1, 'comparisonCriteria.compCriteriaVotes1': 1, 'comparisonCriteria.compCriteriaVotes2': 1, 'comparisonCriteria.compCritPicUrl1': 1, 'comparisonCriteria.compCritPicUrl2': 1, 'comparisonCriteria.compCriteriaRatingSum': 1, 'comparisonCriteria.compCriteriaRatesTotal': 1, /*'comparisonCriteria.compCriteriaRatesUsers': 0,*/ 'criteriaSuggestions._id': 1, 'criteriaSuggestions.criteriaSuggestion': 1, 'criteriaSuggestions.criteriaDescription': 1, 'criteriaSuggestions.upvotes': 1, 'morePrices.extraProductName': 1, 'morePrices.extraPrice': 1, 'morePrices.extraProduct1PricePlace': 1, 'morePrices.extraProduct1PriceLink': 1 /*, 'userId': 0, 'author': 0, 'submitted': 0, 'likes1Users': 0, 'likes2Users': 0, 'hornCountUsers': 0, comparisonCriteria.userId: 0,  */ }}), Mongo.Collection.get(categoryComments).find({_id: reviewId}, { fields: {'comments1.comment': 1, 'comments2.comment': 1, 'commentsLack.comment': 1, 'comments1.author': 1, 'comments2.author': 1, 'commentsLack.author': 1, 'comments1.submitted': 1, 'comments2.submitted': 1, 'commentsLack.submitted': 1, 'comments1.commentsGroup': 1, 'comments2.commentsGroup': 1, 'commentsLack.commentsGroup': 1, 'comments1._id': 1, 'comments2._id': 1, 'commentsLack._id': 1, 'comments1.upvotes': 1, 'comments2.upvotes': 1, 'commentsLack.upvotes': 1, 'comments1.downvotes': 1, 'comments2.downvotes': 1, 'commentsLack.downvotes': 1, 'comments1.totalScore': 1, 'comments2.totalScore': 1, 'commentsLack.totalScore': 1,  /*'comments1.userId': 0, 'comments2.userId': 0, 'commentsLack.userId': 0, 'comments1.upvoteUsers': 0, 'comments1.downvoteUsers': 0, 'comments2.upvoteUsers': 0, 'comments2.downvoteUsers': 0, 'commentsLack.upvoteUsers': 0, 'commentsLack.downvoteUsers': 0,*/ 'comments1': { $slice: limit }, 'comments2': { $slice: limit }, 'commentsLack': { $slice: limit } } })];

});

let review_page_publish = {
	type: 'subscription',
	name: 'reviewPage'
};
DDPRateLimiter.addRule(review_page_publish, 5, 1000);


//NewestPage

Meteor.publish('newestSubscription', function(newestPostsLimit, currentLangLabel) {
	check(newestPostsLimit, Number);
	check(currentLangLabel, String);

	//1000 limit to guard against DOS
	if (newestPostsLimit > 1000) {
		newestPostsLimit = 1000;
	} else if (newestPostsLimit < 1) {
		newestPostsLimit = 1;
	}
	
	if (currentLangLabel === 'en' || currentLangLabel === 'pl') {
		//proceed
	} else {
		//else exit to avoid unnecessary errors
		console.log('newest publish error - currentLangLabel misspelled?');
		throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
	}
	//basic security practice - limit input value possiblities as much as possible
	
	return ReactiveAggregate(this, SearchIndex, [
					{ $match: { language: currentLangLabel } }, 
					{ $project: { single: 1, views: 1,  revTitle1: 1, revTitle2: 1, category: 1, revPicUrl1: 1, revPicUrl2: 1, submitted: 1, likes1: 1, likes2: 1 } },
					{ $sort: { submitted: -1 } },
					{ $limit: newestPostsLimit }
				]);
});

let newest_subscription_publish = {
	type: 'subscription',
	name: 'newestSubscription'
};
//For performance security, all publications with a limit of 1000 must have a DDPRateLimiter of 1 per 1 second
DDPRateLimiter.addRule(newest_subscription_publish, 1, 1000);


//TrendingPage

Meteor.publish('trendingSubscription', function(trendingPostsLimit, currentLangLabel) {
		check(trendingPostsLimit, Number);
		check(currentLangLabel, String);
		
		//1000 limit to guard against DOS
		if (trendingPostsLimit > 1000) {
			trendingPostsLimit = 1000;
		} else if (trendingPostsLimit < 1) {
			trendingPostsLimit = 1;
		}
		
		if (currentLangLabel === 'en' || currentLangLabel === 'pl') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('trending publish error - currentLangLabel misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible
		
		let date = new Date();
		date = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();

		let query = {};
		query['$query'] = {};
		query['$query']['language'] = currentLangLabel;
		query['$query']['trendingUpdate'] = date;
		query['$query']['trendingCount'] = {};
		query['$query']['trendingCount']['$gte'] = 10;

		trendingPostsLimit = Math.ceil(trendingPostsLimit);

		let options = {};
		options['limit'] = trendingPostsLimit;
		options['sort'] = {};
		options['sort']['trendingCount'] = -1;
		options['fields'] = {
			"_id": 1, 
			"single": 1, 
			"language": 1, 
			"revTitle1": 1, 
			"revTitle2": 1, 
			"category": 1, 
			"revPicUrl1": 1, 
			"revPicUrl2": 1, 
			"submitted": 1, 
			"likes1": 1, 
			"likes2": 1,
			"trendingCount": 1, 
			"trendingUpdate": 1, 
			"hornCount": 1,
			"hornDay": 1, 
			"hornTime": 1, 
			"price1": 1, 
			"price2": 1, 
			"views": 1
		};
		
		return SearchIndex.find(query, options);
});

let trending_subscription_publish = {
	type: 'subscription',
	name: 'trendingSubscription'
};
DDPRateLimiter.addRule(trending_subscription_publish, 1, 1000);


Meteor.publish('trendingSubscriptionAmended', function(trendingPostsLimit, currentLangLabel) {
		check(trendingPostsLimit, Number);
		check(currentLangLabel, String);

		//1000 limit to guard against DOS
		if (trendingPostsLimit > 1000) {
			trendingPostsLimit = 1000;
		} else if (trendingPostsLimit < 0) {
			trendingPostsLimit = 0;
			//0 case is caught later on in publication
		}
		
		if (currentLangLabel === 'en' || currentLangLabel === 'pl') {
			//proceed
		} else {
			//else exit to avoid unnecessary errors
			console.log('trendingAmended publish error - currentLangLabel misspelled?');
			throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
		}
		//basic security practice - limit input value possiblities as much as possible

		trendingPostsLimit = Math.floor(trendingPostsLimit);

		if (trendingPostsLimit != 0) {
			let date = new Date();
			date = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
	
			let query = {};
			query['$query'] = {};
			query['$query']['language'] = currentLangLabel;
			query['$query']['hornDay'] = date;
			//sort by newest to keep constantly popular reviews up high
		
			let options = {};
			options['sort'] = {};
			options['sort']['hornTime'] = -1;
			options['limit'] = trendingPostsLimit;
			options['fields'] = {
				"_id": 1, 
				"single": 1, 
				"language": 1, 
				"revTitle1": 1, 
				"revTitle2": 1, 
				"category": 1, 
				"revPicUrl1": 1, 
				"revPicUrl2": 1, 
				"submitted": 1, 
				"likes1": 1, 
				"likes2": 1,
				"trendingCount": 1, 
				"trendingUpdate": 1, 
				"hornCount": 1,
				"hornDay": 1, 
				"hornTime": 1, 
				"price1": 1, 
				"price2": 1, 
				"views": 1
			};
			
			return SearchIndex.find(query, options);
		} else {
			return;
		}
});

let trending_subscription_amended_publish = {
	type: 'subscription',
	name: 'trendingSubscriptionAmended'
};
DDPRateLimiter.addRule(trending_subscription_amended_publish, 1, 1000);


//searchLandingPage
Meteor.publish('searchLandingSubscription', function(searchString1, searchString2, typeFilter, range1, range2, searchLimit, currentLangLabel) {
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
	
	if (currentLangLabel === 'en' || currentLangLabel === 'pl') {
		//proceed
	} else {
		//else exit to avoid unnecessary errors
		console.log('search publish error - currentLangLabel misspelled?');
		throw new Meteor.Error("Internal Server Error", "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.");
	}
	//basic security practice - limit input value possiblities as much as possible
	
	//1000 limit to guard against DOS
	if (searchLimit > 1000) {
		searchLimit = 1000;
	} else if (searchLimit < 0) {
		searchLimit = 0;
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
		throw new Meteor.Error("Range error", "Please enter your range from lowest to highest."); 
	}
	
	if (typeFilter === 'single' || typeFilter === 'comparison' || typeFilter === 'all') {
		//proceed
	} else {
		//else exit to avoid malevolent but assume innocence
		console.log('search publish error - typeFilter misspelled?');
		throw new Meteor.Error("Internal Server Error", "Please check that the type filter is spelled correctly in the url. This is probably the site's fault. This error has been logged and will be worked on as soon as possible.");
	}
	//basic security practice - limit input value possiblities as much as possible

	///search 'Methods'
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
				return ReactiveAggregate(this, SearchIndex, [
					{ $match: {$and: [{revTitle1: {$regex: regExpObject1} }, {revTitle2: {$regex: regExpObject2}}, {price1: {$gte: range1}}, {price1: {$lte: range2}}, {price2: {$gte: range1}}, {price2: {$lte: range2}}], language: currentLangLabel }}, 
					{ $project: { single: 1, views: 1, revTitle1: 1, revTitle2: 1, category: 1, revPicUrl1: 1, revPicUrl2: 1, likes1: 1, likes2: 1, difference: { $abs: { $subtract: ['$likes1', '$likes2'] } }, summation: { $add: ['$likes1', '$likes2'] } } },
					{ $sort: { summation: -1 } },
					{ $sort: { difference: 1 } },
					{ $sort: { single: -1 } },
					{ $limit: searchLimit}
				]);
			} else if (typeFilter === 'single') {
				return ReactiveAggregate(this, SearchIndex, [
					{ $match: {$and: [{revTitle1: {$regex: regExpObject1}}, {price1: {$gte: range1}}, {price1: {$lte: range2}}/*, {price2: {$gte: range1}}, {price2: {$lte: range2}} --- even though price2 exists for search purposes, when searching for singles there is no point in searching price2 as it will be the same as price1*/], single: true, language: currentLangLabel } }, 
					{ $project: { single: 1, views: 1, revTitle1: 1, revTitle2: 1, category: 1, revPicUrl1: 1, likes1: 1 } },
					{ $sort: { likes1: -1 } },
					{ $sort: { single: -1 } },
					//another sort here in an attempt to stop limit from working before sort has a chance to sort whole interest group
					{ $limit: searchLimit }
				]);
			} else if (typeFilter === 'comparison') {
				return ReactiveAggregate(this, SearchIndex, [
					{ $match: {$and: [{revTitle1: {$regex: regExpObject1} }, {revTitle2: {$regex: regExpObject2}}, {price1: {$gte: range1}}, {price1: {$lte: range2}}, {price2: {$gte: range1}}, {price2: {$lte: range2}}], single: false, language: currentLangLabel } }, 
					{ $project: { single: 1, views: 1, revTitle1: 1, revTitle2: 1, category: 1, revPicUrl1: 1, revPicUrl2: 1, likes1: 1, likes2: 1, difference: { $abs: { $subtract: ['$likes1', '$likes2'] } }, summation: { $add: ['$likes1', '$likes2'] } } },
					{ $sort: { summation: -1 } },
					{ $sort: { difference: 1 } },
					{ $sort: { single: -1 } },
					//another sort here in an attempt to stop limit from working before sort has a chance to sort whole interest group
					{ $limit: searchLimit }
				]);
			}
		} else if (SearchIndex.find({$and: [{revTitle1: {$regex: regExpObject2} }, {revTitle2: {$regex: regExpObject1}}], language: currentLangLabel}, {score: {$meta: "textScore"}, limit: searchLimit}).fetch().length > 0) {
			if (typeFilter === 'all') {
				return ReactiveAggregate(this, SearchIndex, [
					{ $match: {$and: [{revTitle1: {$regex: regExpObject2} }, {revTitle2: {$regex: regExpObject1}}, {price1: {$gte: range1}}, {price1: {$lte: range2}}, {price2: {$gte: range1}}, {price2: {$lte: range2}}], language: currentLangLabel }}, 
					{ $project: { single: 1, views: 1, revTitle1: 1, revTitle2: 1, category: 1, revPicUrl1: 1, revPicUrl2: 1, likes1: 1, likes2: 1, difference: { $abs: { $subtract: ['$likes1', '$likes2'] } }, summation: { $add: ['$likes1', '$likes2'] } } },
					{ $sort: { summation: -1 } },
					{ $sort: { difference: 1 } },
					{ $sort: { single: -1 } },
					{ $limit: searchLimit}
				]);
			} else if (typeFilter === 'single') {
				return ReactiveAggregate(this, SearchIndex, [
					{ $match: {$and: [{revTitle1: {$regex: regExpObject2}}, {price1: {$gte: range1}}, {price1: {$lte: range2}}/*, {price2: {$gte: range1}}, {price2: {$lte: range2}} --- even though price2 exists for search purposes, when searching for singles there is no point in searching price2 as it will be the same as price1*/], single: true, language: currentLangLabel } }, 
					{ $project: { single: 1, views: 1, revTitle1: 1, revTitle2: 1, category: 1, revPicUrl1: 1, likes1: 1 } },
					{ $sort: { likes1: -1 } },
					{ $sort: { single: -1 } },
					//another sort here in an attempt to stop limit from working before sort has a chance to sort whole interest group
					{ $limit: searchLimit }
				]);
			} else if (typeFilter === 'comparison') {
				return ReactiveAggregate(this, SearchIndex, [
					{ $match: {$and: [{revTitle1: {$regex: regExpObject2} }, {revTitle2: {$regex: regExpObject1}}, {price1: {$gte: range1}}, {price1: {$lte: range2}}, {price2: {$gte: range1}}, {price2: {$lte: range2}}], single: false, language: currentLangLabel } }, 
					{ $project: { single: 1, views: 1, revTitle1: 1, revTitle2: 1, category: 1, revPicUrl1: 1, revPicUrl2: 1, likes1: 1, likes2: 1, difference: { $abs: { $subtract: ['$likes1', '$likes2'] } }, summation: { $add: ['$likes1', '$likes2'] } } },
					{ $sort: { summation: -1 } },
					{ $sort: { difference: 1 } },
					{ $sort: { single: -1 } },
					//another sort here in an attempt to stop limit from working before sort has a chance to sort whole interest group
					{ $limit: searchLimit }
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
					return ReactiveAggregate(this, SearchIndex, [
						{ $match: {$or: [{revTitle1: {$regex: regExpObject1} }, {revTitle2: {$regex: regExpObject1}}], $and: [{price1: {$gte: range1}}, {price1: {$lte: range2}}, {price2: {$gte: range1}}, {price2: {$lte: range2}}], language: currentLangLabel }}, 
						{ $project: { single: 1, views: 1, revTitle1: 1, revTitle2: 1, category: 1, revPicUrl1: 1, revPicUrl2: 1, likes1: 1, likes2: 1, difference: { $abs: { $subtract: ['$likes1', '$likes2'] } }, summation: { $add: ['$likes1', '$likes2'] } } },
						{ $sort: { summation: -1 } },
						{ $sort: { difference: 1 } },
						{ $sort: { single: -1 } },
						{ $limit: searchLimit}
					]);
				} else if (typeFilter === 'single') {
					return ReactiveAggregate(this, SearchIndex, [
						{ $match: {revTitle1: {$regex: regExpObject1}, $and: [{price1: {$gte: range1}}, {price1: {$lte: range2}}/*, {price2: {$gte: range1}}, {price2: {$lte: range2}} --- even though price2 exists for search purposes, when searching for singles there is no point in searching price2 as it will be the same as price1*/],  single: true, language: currentLangLabel } }, 
						{ $project: { single: 1, views: 1, revTitle1: 1, revTitle2: 1, category: 1, revPicUrl1: 1, likes1: 1 } },
						{ $sort: { likes1: -1 } },
						{ $sort: { single: -1 } },
						//another sort here in an attempt to stop limit from working before sort has a chance to sort whole interest group
						{ $limit: searchLimit }
					]);
				} else if (typeFilter === 'comparison') {
					return ReactiveAggregate(this, SearchIndex, [
						{ $match: {$or: [{revTitle1: {$regex: regExpObject1} }, {revTitle2: {$regex: regExpObject1}}], $and: [{price1: {$gte: range1}}, {price1: {$lte: range2}}, {price2: {$gte: range1}}, {price2: {$lte: range2}}], single: false, language: currentLangLabel } }, 
						{ $project: { single: 1, views: 1, revTitle1: 1, revTitle2: 1, category: 1, revPicUrl1: 1, revPicUrl2: 1, likes1: 1, likes2: 1, difference: { $abs: { $subtract: ['$likes1', '$likes2'] } }, summation: { $add: ['$likes1', '$likes2'] } } },
						{ $sort: { summation: -1 } },
						{ $sort: { difference: 1 } },
						{ $sort: { single: -1 } },
						//another sort here in an attempt to stop limit from working before sort has a chance to sort whole interest group
						{ $limit: searchLimit }
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
					return ReactiveAggregate(this, SearchIndex, [
						{ $match: {$or: [{revTitle1: {$regex: regExpObject2} }, {revTitle2: {$regex: regExpObject2}}], $and: [{price1: {$gte: range1}}, {price1: {$lte: range2}}, {price2: {$gte: range1}}, {price2: {$lte: range2}}], language: currentLangLabel }}, 
						{ $project: { single: 1, views: 1, revTitle1: 1, revTitle2: 1, category: 1, revPicUrl1: 1, revPicUrl2: 1, likes1: 1, likes2: 1, difference: { $abs: { $subtract: ['$likes1', '$likes2'] } }, summation: { $add: ['$likes1', '$likes2'] } } },
						{ $sort: { summation: -1 } },
						{ $sort: { difference: 1 } },
						{ $sort: { single: -1 } },
						{ $limit: searchLimit}
					]);
				} else if (typeFilter === 'single') {
					return ReactiveAggregate(this, SearchIndex, [
						{ $match: {revTitle1: {$regex: regExpObject2}, $and: [{price1: {$gte: range1}}, {price1: {$lte: range2}}/*, {price2: {$gte: range1}}, {price2: {$lte: range2}} --- even though price2 exists for search purposes, when searching for singles there is no point in searching price2 as it will be the same as price1*/], single: true, language: currentLangLabel } }, 
						{ $project: { single: 1, views: 1, revTitle1: 1, revTitle2: 1, category: 1, revPicUrl1: 1, likes1: 1 } },
						{ $sort: { likes1: -1 } },
						{ $sort: { single: -1 } },
						//another sort here in an attempt to stop limit from working before sort has a chance to sort whole interest group
						{ $limit: searchLimit }
					]);
				} else if (typeFilter === 'comparison') {
					return ReactiveAggregate(this, SearchIndex, [
						{ $match: {$or: [{revTitle1: {$regex: regExpObject2} }, {revTitle2: {$regex: regExpObject2}}], $and: [{price1: {$gte: range1}}, {price1: {$lte: range2}}, {price2: {$gte: range1}}, {price2: {$lte: range2}}], single: false, language: currentLangLabel } }, 
						{ $project: { single: 1, views: 1, revTitle1: 1, revTitle2: 1, category: 1, revPicUrl1: 1, revPicUrl2: 1, likes1: 1, likes2: 1, difference: { $abs: { $subtract: ['$likes1', '$likes2'] } }, summation: { $add: ['$likes1', '$likes2'] } } },
						{ $sort: { summation: -1 } },
						{ $sort: { difference: 1 } },
						{ $sort: { single: -1 } },
						//another sort here in an attempt to stop limit from working before sort has a chance to sort whole interest group
						{ $limit: searchLimit }
					]);
				}
			}
		}
	}
});

let search_landing_subscription_publish = {
	type: 'subscription',
	name: 'searchLandingSubscription'
};
DDPRateLimiter.addRule(search_landing_subscription_publish, 1, 1000);
