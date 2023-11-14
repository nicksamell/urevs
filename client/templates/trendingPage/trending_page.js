Template.trendingPage.onRendered(function() {
	Session.set('searchBoxSummonedTrending', false);
});

Template.trendingPage.helpers({
	searchBoxSummoned: function() {
		return Session.get('searchBoxSummonedTrending');
	}
});


Template.trendingPageReviewItem.helpers({
	notFirstTimeVisitTrending: function() {
		if (localStorage.getItem('notFirstTimeVisitTrending') == 'true') {
			return true;
		} else {
			return false;
		}
	},
	postsCount: function() {
		if ($(window).width() > 768) {
			let array = SearchIndex.find().fetch();
			 
			for(let i = 0; i < array.length; i++) { 
				if(array[i]['_id'] === this._id) { 
		
					switch (Math.round((((i + 1)/8)%1)*100)/100) {
						case 0.13:
							if (Math.floor(((i + 1)/8)%2) == 0) {
								if (i == 0) {
									return 'item-1-trend ball-1-attach'; 
								}
							
								return 'item-1-trend ball-1-attach ball-4-attach';	
							} else {
								return 'item-1-trend';
							}
							break;
						case 0.25:
							return 'item-2-trend';
							break;
						case 0.38:
							if (Math.floor(((i + 1)/8)%2) == 0) {
								return 'item-3-trend ball-2-attach';	
							} else {
								return 'item-3-trend';
							}
							break;
						case 0.5:
							return 'item-4-trend';
							break;
						case 0.63:
							return 'item-5-trend';
							break;
						case 0.75:
							return 'item-6-trend';
							break;
						case 0.88:
							if (Math.floor(((i + 1)/8)%2) == 0) {
								return 'item-1-trend';
							} else {
								return 'item-7-trend ball-3-attach';
							}
							break;
						case 0:
							return 'item-8-trend';
							break;
					}
				} 
			} 
		}
	},
	actualPostsCount: function() {
		let array = SearchIndex.find().fetch();
		 
		for(let i = 0; i < array.length; i++) { 
			if(array[i]['_id'] === this._id) { 
				return 'real-item-' + (i+1);
			} 
		} 
	},
	ballMake: function() {
		let array = SearchIndex.find().fetch();
		 
		for(let i = 0; i < array.length; i++) { 
			if(array[i]['_id'] === this._id) { 
		
				switch (Math.round((((i + 1)/8)%1)*100)/100) {
					case 0.13:
						return;
						break;
					case 0.25:
						return;
						break;
					case 0.38:
						if (Math.floor(((i + 1)/8)%2) == 0) {
							return 'ball-1-left';	
						} else {
							return 'ball-1-right';
						}
						break;
					case 0.5:
						return;
						break;
					case 0.63:
						if (Math.floor(((i + 1)/8)%2) == 0) {
							return 'ball-2-left';
						} else {
							return 'ball-2-right';
						}
						break;
					case 0.75:
						return;
						break;
					case 0.88:
						if (Math.floor(((i + 1)/8)%2) == 0) {
							return 'ball-3-left';
						} else {
							return 'ball-3-right';
						}
						break;
					case 0:
						return;
						break;
				}
			} 
		}
	},
	isHorn: function() {
		let reviewId = this._id;
		
		return ReactiveMethod.call('isHorn', reviewId);
	},
	revTitleDouble: function() {
		var title1 = this.revTitle1;
		var title2 = this.revTitle2;
		
		var fullTitle = title1 + ' vs ' + title2; 
		return fullTitle;
	}
});

Template.trendingPage.events({
	'click #another-search-button': function() {
		Session.set('searchBoxSummonedTrending', true);		
		
		$('html, body').animate({ scrollTop: $(document).height()}, 2000); 
	},
	'click .generic-search, submit .generic-site-search-form': function(e) {
		e.preventDefault();

		let searchString1;
		let searchString2;
		let typeFilter = 'all';
	
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
	
		Router.go('searchLandingPage', {searchString1, searchString2, typeFilter});
	}
});

if ($(window).width() > 768) {
	$(window).scroll(function() {
		var number;
		var className;
	
		if (((150 + window.pageYOffset)/200) >= (parseInt((150 + window.pageYOffset)/200))) {
			number = parseInt((250 + window.pageYOffset)/200);
			className = '.real-item-';
			className += number;
		
			if ($(className).parent().attr("style") != "transform: scale(1.2,1.2); margin-bottom: 40px;") {
				$(className).parent().attr("style", "transform: scale(1.2,1.2); margin-bottom: 40px;");
				number -= 1;
				className = '.real-item-';
				className += number;
			
				$(className).parent().attr("style", "");
				number += 2;
				className = '.real-item-';
				className += number;
				$(className).parent().attr("style", "");
			}
		}
	});
}
