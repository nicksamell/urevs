Template.newestPage.onRendered(function() {
	Session.set('searchBoxSummonedNewest', false);
});

Template.newestPage.helpers({
	searchBoxSummoned: function() {
		return Session.get('searchBoxSummonedNewest');
	}
});

Template.newestPageReviewItem.helpers({
	revTitleDouble: function() {
		var title1 = this.revTitle1;
		var title2 = this.revTitle2;
		
		var fullTitle = title1 + ' vs ' + title2; 
		return fullTitle;
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
									return 'item-1 ball-1-attach'; 
								}
							
								return 'item-1 ball-1-attach ball-4-attach';	
							} else {
								return 'item-1';
							}
							break;
						case 0.25:
							return 'item-2';
							break;
						case 0.38:
							if (Math.floor(((i + 1)/8)%2) == 0) {
								return 'item-3 ball-2-attach';	
							} else {
								return 'item-3';
							}
							break;
						case 0.5:
							return 'item-4';
							break;
						case 0.63:
							return 'item-5';
							break;
						case 0.75:
							return 'item-6';
							break;
						case 0.88:
							if (Math.floor(((i + 1)/8)%2) == 0) {
								return 'item-1';
							} else {
								return 'item-7 ball-3-attach';
							}
							break;
						case 0:
							return 'item-8';
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
	}
});

Template.newestPage.events({
	'click #another-search-button': function() {
		Session.set('searchBoxSummonedNewest', true);
		
		$('html, body').animate({ scrollTop: $(document).height()}, 2000);
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
