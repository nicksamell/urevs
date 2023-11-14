Template.accountPage.onRendered(function() {
	if (Meteor.user().profile.proPic) {
		var userProPic = Meteor.user().profile.proPic;
	
		if (userProPic.includes('facebookId - ')) {
			var fbID = userProPic.substring(13, userProPic.length);
		
			HTTP.call('GET', 'https://graph.facebook.com/' + fbID + '/picture/?redirect=0&type=large', function (err, res) { 
				if (res) {
					Session.set('proPic', res.data.data.url);
				}
			});
		} else {
			Session.set('proPic', userProPic);
		}
	}
	
	var SMProPic = Meteor.call('getSMUserPic');
		
	if (SMProPic.includes('facebookId - ')) {
		var fbID = SMProPic.substring(13, SMProPic.length);
		
		HTTP.call('GET', 'https://graph.facebook.com/' + fbID + '/picture/?redirect=0&type=large', function (err, res) {
			if (res) {
				Session.set('userSMProPic', res.data.data.url);
			}
		});
	} else {
		Session.set('userSMProPic', SMProPic);
	}
});

Template.accountPage.helpers({
	ppSMChosen: function() {
		var proPicLink = Meteor.user().profile.proPic;
		
		if (proPicLink.includes('facebookId - ') || proPicLink.includes('https://lh3.googleusercontent.com')) {
			return true;
		}
	},	
	xsTextCenter: function() {
		if ($(window).width() < 768) {
			return 'text-center';
		} else {
			return;
		}		
	},
	userName: function() {
		return Meteor.user().profile.name;
	},
	proPic: function() {
		return Session.get('proPic');
	},
	userSMProPic: function() {
		return Session.get('userSMProPic');
	},
	messages: function() {
		return Meteor.user().profile.messages;
	},
	isYoutube: function() {
		return Meteor.user().profile.youtubeSettings;
	},
	youtubeLink: function() {
		if (Meteor.user().profile.youtubeApproved) {
			return Meteor
		}
	},
	isSearchChecked: function() {
		if (Meteor.user().profile.searchSettings == 'single') {
			return true;
		} else {
			return false;
		}
	},
	isSearchBottom: function() {
		if (Meteor.user().profile.reviewSearchBoxPref === 'bottom' || Meteor.user().profile.reviewSearchBoxPref == undefined) {
			return true;
		}
	},
	isLikeChecked: function() {
		if (Meteor.user().profile.likeSettings == 'bottom') {
			return true;
		} else {
			return false;
		}
	},
	isShowChecked: function() {
		if (Meteor.user().profile.showShareSettings || Meteor.user().profile.showShareSettings == undefined) {
			return 'checked';
		}
	},
	isShowRecChecked: function() {
		if (Meteor.user().profile.showShareRecSettings || Meteor.user().profile.showShareRecSettings == undefined) {
			return 'checked';
		}
	},
	cSSSettingLeft: function() {
		if (Meteor.user().profile.cSSSetting === 'left' || Meteor.user().profile.cSSSetting == undefined) {
			return 'checked';
		}
	},
	cSSSettingRight: function() {
		if (Meteor.user().profile.cSSSetting === 'right') {
			return 'checked';
		}
	},
	cSSSettingBoth: function() {
		if (Meteor.user().profile.cSSSetting === 'both') {
			return 'checked';
		}
	},
	bullHornReviews: function() {
		return Meteor.user().profile.bullHornReviews;
	},
	ppSMChecked: function() {
		var proPicLink = Meteor.user().profile.proPic;
		
		if (proPicLink.includes('facebookId - ') || proPicLink.includes('https://lh3.googleusercontent.com')) {
			return 'checked';
		}
	},
	ppDefaultChecked: function() {
		if (Meteor.user().profile.proPic == undefined || Meteor.user().profile.proPic == 'pro_pic_default.png') {
			return 'checked';
		}
	},
	pp1Checked: function() {
		if (Meteor.user().profile.proPic == 'pro_pic_1.png') {
			return 'checked';
		}
	},
	pp2Checked: function() {
		if (Meteor.user().profile.proPic == 'pro_pic_2.png') {
			return 'checked';
		}
	},
	pp3Checked: function() {
		if (Meteor.user().profile.proPic == 'pro_pic_3.png') {
			return 'checked';
		}
	},
	pp4Checked: function() {
		if (Meteor.user().profile.proPic == 'pro_pic_4.png') {
			return 'checked';
		}
	},
	pp5Checked: function() {
		if (Meteor.user().profile.proPic == 'pro_pic_5.png') {
			return 'checked';
		}
	},
	pp6Checked: function() {
		if (Meteor.user().profile.proPic == 'pro_pic_6.png') {
			return 'checked';
		}
	},
	deleteActive: function() {
		return Meteor.user().profile.deleteActive;
	}
});

Template.bullHornReviewItem.helpers({
	revTitleDouble1: function() {
		var title1 = this.revTitle1;
		
		return title1;
	},
	revTitleDouble2: function() {
		var title2 = this.revTitle2;
		
		return title2;
	},
	accountColMd: function() {
		if (this.single) {
			return 'col-md-3';
		} else if (!this.single) {
			 return 'col-md-6';
		}
	},
	notificationBubble: function() {
		if (this.hasNotifications) {
			return true;
		}
	}
});

Template.bullHornReviewItem.events({
	'click .account-page-bull-horn-review-item-wrapper': function() {
		var reviewId = this._id;
	
		Meteor.call('deNotifyBullHornReview', reviewId);
	}
});

Template.messageItem.events({
	'click .message-x-button': function() {
		messageRemoveObject = {};
		messageRemoveObject['messageText'] = this.messageText;
		messageRemoveObject['messageId'] = this.messageId;
		
		$('#confirmMessageRemove').modal();
	}
});

Template.accountPage.events({
	'click': function(e) {
		if ($(e.target).parents('#yesYoutube').hasClass('in')) {
			//do nothing
		} else {
			if (Meteor.user().profile.youtubeSettings) {
				$('#no-youtube').removeClass('active');
				$('#yes-youtube').addClass('active');
			} else {
				$('#yes-youtube').removeClass('active');			
				$('#no-youtube').addClass('active');
			}
		}
	},
	'click .pro-pic-settings-change-class': function() {
		$('.pro-pic-settings-change-class').html('Save');
		$('.pro-pic-settings-change-class').addClass('pro-pic-settings-save-class');
		$('.pro-pic-settings-change-class').removeClass('pro-pic-settings-change-class');
	},
	'click .pro-pic-settings-save-class': function() {
		let proPicOption = $('input[name=proPicSet]:checked', '#proPicSettingsForm').val();
		
		Meteor.call('proPicSave', proPicOption, function(error) {
			$('.pro-pic-settings-save-class').html('Change');
			$('.pro-pic-settings-save-class').addClass('pro-pic-settings-change-class');
			$('.pro-pic-settings-save-class').removeClass('pro-pic-settings-save-class');
			
			if (error) {
				if (TAPi18n.getLanguage() != 'en') {
					switch(error.message) {
						case 'Please log in to change your profile picture.':
							throwError(TAPi18n.__('log_in_change_pro_pic')); 
							break;
						case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
							return throwError(TAPi18n.__('internal_server_error'));
							break;
					}
				
					return throwError(error);
				}
			}
			
			var userProPic = Meteor.user().profile.proPic;
	
			if (userProPic.includes('facebookId - ')) {
				var fbID = userProPic.substring(13, userProPic.length);
		
				HTTP.call('GET', 'https://graph.facebook.com/' + fbID + '/picture/?redirect=0&type=large', function (err, res) { 
					if (res) {
						Session.set('proPic', res.data.data.url);
					}
				});
			} else {
				Session.set('proPic', userProPic);
			}
		});
	},
	'click #confirm-message-remove-yes': function() {
		Meteor.call('userMessageRemove', messageRemoveObject, function(error) {
			$('#confirmMessageRemove').modal('toggle');
			messageRemoveObject = {};
			if (error) {
				if (TAPi18n.getLanguage() != 'en') {
					switch(error.message) {
						case 'Please log in to delete your messages.':
							throwError(TAPi18n.__('log_in_to_delete_messages')); 
							break;
					}
				
					return throwError(error);
				}
			}
		})
	},
	'click #reviewerSetSave': function() {
		let tubeInput = $('#youtube-input').val();

		$('#reviewerSetSave').attr('value', 'Sending...');
		
		Meteor.call('tubeRequestSend', tubeInput, function (error) {
			if (error) {
				$('#reviewerSetSave').attr('value', 'Send');
				
				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
					 case 'Please log in to change your account settings.': 
					 	return throwError(TAPi18n.__('log_in_change_acct_settings'));
					 	break;
					 case 'Please enter a youtube channel id.':
					 	return throwError(TAPi18n.__('enter_youtube_id'));
					 	break;
					 case 'Please enter a valid youtube channel id.': 
					 	return throwError(TAPi18n.__('enter_valid_youtube_id'));
					 	break;
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;
					}
				}
				
				return throwError(error);
			}
			
			throwSuccess(TAPi18n.__('success_message_on_yt'));
				
			$('#yesYoutube').modal('toggle');
			$('#reviewerSetSave').attr('value', 'Send');
			$('#yes-youtube').addClass('active');			
			$('#no-youtube').removeClass('active');
			$('#youtube-input').val('');
		});		
	},
	'click #no-youtube': function() {
		$('#noYoutube').modal();
	},
	'click #confirm-delete-youtube-yes': function() {
		Meteor.call('noYoutube', function(error) {
			if (error) {
				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
						case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
							return throwError(TAPi18n.__('internal_server_error'));
							break;
					}
				}
			
				return throwError(error);
			}
			
			$('#noYoutube').modal('toggle');
			$('#yes-youtube').removeClass('active');			
			$('#no-youtube').addClass('active');
		});
	},
	'confirm-delete-youtube-cancel': function() {
		$('#noYoutube').modal('toggle');
	},
	'click #likeSetSave': function() {
		let pref;
		let showShare;
		let showShareRec;
		let cSSSetting;
		let reviewSearchBoxPref;
	
		if($("input[value='top']").is(':checked')) {
			pref = 'top';
		} else if($("input[value='bottom']").is(':checked')) {
			pref = 'bottom';
		}
		
		if ($('#show-share').is(':checked')) {
			showShare = true;
		} else {
			showShare = false;
		}
		
		if ($('#show-share-rec').is(':checked')) {
			showShareRec = true;
		} else {
			showShareRec = false;
		}
		
		if($("input[value='left']").is(':checked')) {
			cSSSetting = 'left';
		} else if($("input[value='right']").is(':checked')) {
			cSSSetting = 'right';
		} else if($("input[value='both']").is(':checked')) {
			cSSSetting = 'both';
		}
		
		if($("input[value='searchTop']").is(':checked')) {
			reviewSearchBoxPref = 'top';
		} else if($("input[value='searchBottom']").is(':checked')) {
			reviewSearchBoxPref = 'bottom';
		}
		
		Meteor.call('likeSettingsPrefSave', pref, showShare, showShareRec, cSSSetting, reviewSearchBoxPref, function (error) {
			if (error) {
				if (TAPi18n.getLanguage() != 'en') {
					switch(error.message) {
						case 'Please log in to change your account settings.':
							throwError(TAPi18n.__('log_in_change_acct_settings')); 
							break;
						case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
							return throwError(TAPi18n.__('internal_server_error'));
							break;
					}
				
					return throwError(error);
				}
			}
		
			throwSuccess(TAPi18n.__('success_settings_saved'));
		});
	},
	'click #acct-delete-dismiss-btn2': function() {
		$('#firstDeleteConfirm').modal('toggle');
	},
	'click #second-delete-confirm-btn': function() {
		let whyMessage = $('#whyDeleteAccountMessage').val();
	
		Meteor.call('requestAccountDelete', whyMessage, function(error) {
			if (error) {
				if (TAPi18n.getLanguage() != 'en') {
					switch(error.message) {
						case 'Your detailed response is appreciated. However, there is a limit of 10000 characters. If you would like to write a longer one, please send an email with your response to support@urevs.com':
							throwError(TAPi18n.__('please_limit_to_10000')); 
							break;
						case 'Please log in to delete your account.':
							throwError(TAPi18n.__('log_in_to_delete_acct'));
							break;
						case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
							return throwError(TAPi18n.__('internal_server_error'));
							break;
					}
				
					return throwError(error);
				}
			}
			
			$('#finalDeleteConfirm').modal('toggle');
			$('#firstDeleteConfirm').modal('toggle');
			$('#goodbyeModal').modal('toggle');
		});
	},
	'click #acct-delete-cancel-confirm-btn': function() {
		Meteor.call('cancelAccountDelete', function(error) {
			if (error) {
				if (TAPi18n.getLanguage() != 'en') {
					switch(error.message) {
						case 'Great to see you back! Please log in to cancel deletion of your account, if you had requested it before.':
							throwError(TAPi18n.__('log_in_to_cancel_delete_acct')); 
							break;
						case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
							return throwError(TAPi18n.__('internal_server_error'));
							break;
					}
					
					return throwError(error);
				}
			}
		});
		
		$('#greatToSeeYouBack').modal();
	}
});

//pre-beta only
//re-do when doing Oauth and understand each line
if (Meteor.isClient) {
	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY",
		extraSignupFields: [
			{
				fieldName: 'terms',
				fieldLabel: 'I have read, understand, and accept the terms of use and privacy policy found at the bottom of this page by clicking on "More", and then on "Legal & Privacy"',
				inputType: 'checkbox',
				visible: true,
				saveToProfile: true,
				validate: function(value, errorFunction) {
					if (value) {
						return true;
					} else {
						errorFunction('You must accept the terms and conditions in order to contribute fully to the community');
						return false;
					}
				}
			}
		]
	});
}
