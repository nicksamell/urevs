Template.layout.onRendered(function() {
	TAPi18n.setLanguage(localStorage.getItem('urevsLanguagePreference'));

	if (localStorage.getItem("suggestionInProgress")) {
		$('#suggestionInProgressModal').modal();
	}	
});

Template.registerHelper("assetUrl", (asset) => {
	switch(asset) {
		case 'dual_system.png':
			return '/' + asset; 
			break;
		case 'pending_approval.png':
			return '/' + asset; 
			break;
		case 'pro_pic_1.png':
			return '/' + asset; 
			break;
		case 'pro_pic_2.png':
			return '/' + asset; 
			break;
		case 'pro_pic_3.png':
			return '/' + asset; 
			break;
		case 'pro_pic_4.png':
			return '/' + asset; 
			break;
		case 'pro_pic_5.png':
			return '/' + asset; 
			break;
		case 'pro_pic_6.png':
			return '/' + asset; 
			break;
		case 'pro_pic_default.png':
			return '/' + asset; 
			break;
		case 'tutorial_1.png':
			return '/' + asset; 
			break;
		case 'tutorial_2.png':
			return '/' + asset; 
			break;
		case 'tutorial_3.png':
			return '/' + asset; 
			break;
		case 'urevs_logo.png':
			return asset; 
			break;
		case 'intro-works-1.gif':
			return asset; 
			break;
		case 'intro-works-2.png':
			return asset; 
			break;
		case 'intro-works-3.png':
			return asset; 
			break;
		default:
			return "https://s3.amazonaws.com/productphotosbucket/" + asset;
	}
});

Template.layout.helpers({
	xs: function() {
		if ($(window).width() < 768) {
			return true;
		} else {
			return false;
		}		
	},
	
	notFirstTimeVisitAnywhere: function() {
		if (localStorage.getItem('notFirstTimeVisitAnywhere') == "true") {
			return true;
		} else {
			Meteor.setTimeout(function() {
				$('#introMessage').modal();
			}, 1000);
		}
	},
	notificationCount: function() {
		let user = Meteor.user();
		
		if (!user) {
			return;
		} else {
			return Meteor.user().profile.notificationCount;
		}
	},
	languages: function() {
		let obj = TAPi18n.getLanguages();
		let languages = [];
		
		let currentLanguageCode = TAPi18n.getLanguage();
		
		for (let	key in obj) {
			languages.push({code: key, lang: obj[key]['name']});
		}
		
		if (languages) {
			return languages;
		}
		
		//Thanks to the MeteorChef article, "i18n and Meteor", for providing the majority of the code in the "languages" and currentLanguageName helpers
	},
	currentLanguage: function() {
		if (this.code === TAPi18n.getLanguage()) {
			return true;
		}
	},
	currentLanguageName: function() {
		let currentLanguageCode = TAPi18n.getLanguage();
		let appLanguages = TAPi18n.getLanguages();
		let currentLanguage = [];
		
		for (let code in appLanguages) {
			if (code === currentLanguageCode) {
				currentLanguage.push({code: code, lang: appLanguages[code].name});
			}
		}
		
		return currentLanguage;
	},
	langLabel: function() {
		return this.code;
	},
	commentInProgress: function() {
		if (localStorage.getItem("commentInProgress")) {
			return localStorage.getItem("commentInProgress");
		} else {
			return false;
		}
	},
	commentInEdit: function() {
		if (localStorage.getItem("commentInEdit")) {
			return localStorage.getItem("commentInEdit");
		} else {
			return false;
		}
	},
	flagCommentInProgress: function() {
		if (localStorage.getItem("flagCommentInProgress")) {
			return localStorage.getItem("flagCommentInProgress");
		} else {
			return false;
		}
	},
	flagReviewInProgress: function() {
		if (localStorage.getItem("flagReviewInProgress")) {
			return localStorage.getItem("flagReviewInProgress");
		} else {
			return false;
		}
	},
	suggestionInProgress: function() {
		if (localStorage.getItem("suggestionInProgress")) {
			return localStorage.getItem("suggestionInProgress");
		} else {
			return false;
		}
	},
	layoutClass: function() {
		if (Router.current().route.getName() == 'landingPage') {
			return 'layoutFooterHome';
		} else {
			return 'layoutFooter';
		}
	},
	blogUrl: function() {
		return 'null';
	},
	privacyFirstContact: function() {
		Meteor.setTimeout(function() {
			if (Meteor.user()) {
				if (Meteor.user().profile.privacyFCUnderstand && Meteor.user().profile.privacyFCUnderstandAmend12_09_2017) {
					//do nothing
					return;
				} else if (Meteor.user().profile.privacyFCUnderstand) {
					$('#privacyAmendmentDialog').modal();
				} else {
					$('#privacyFirstContactDialog').modal();
				}
			} else {
				if (localStorage.getItem('IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement') && localStorage.getItem('a_12_09_2017_IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement')) {
					//do nothing
					return;
				} else if (localStorage.getItem('IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement')) {
					$('#privacyAmendmentDialog').modal();
				} else {
					$('#privacyFirstContactDialog').modal();					
				}
			}
		}, 1000);
	},
	inProgressHelper: function() {	
		Meteor.setTimeout(function() {
			if (localStorage.getItem("commentInProgress") || localStorage.getItem("commentInEdit") || localStorage.getItem("flagCommentInProgress") || localStorage.getItem("flagReviewInProgress") || localStorage.getItem("suggestionInProgress")) {
				$('#inProgressModal').modal('show');
			}
		}, 1000);
	},
	newestTitle: function() {
		return TAPi18n.__('newest_link_title');
	},
	trendingTitle: function () {
		return TAPi18n.__('trending_link_title');
	},
	suggestionsTitle: function() {
		return TAPi18n.__('suggestions_link_title');
	},
	gratitudesTitles: function() {
		return TAPi18n.__('gratitudes_link_title');
	},
	missionTitle: function() {
		return TAPi18n.__('our_mission_link_title');
	},
	legalTitle: function() {
		return TAPi18n.__('legal_and_privacy_link_title');
	},
	blogTitle: function() {
		return TAPi18n.__('blog_link_title');
	}
});

Template.layout.events({
	'click #fromIntroModal': function() {
		Session.set('fromIntroModal', true);
	},
	'change #language-select': function() {
		let languageSelected = $('#language-select').find(":selected").attr("title");
		
		TAPi18n.setLanguage(languageSelected);

		if (Meteor.user()) {
			Meteor.call('userLanguageSave', languageSelected, function(error) {
				if (error) {
					if (TAPi18n.getLanguage() != 'en') {
						switch(error.message) {
							case 'Please log in to change your language setting.':
								throwError(TAPi18n.__('log_in_to_change_language')); 
								break;
							case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
								return throwError(TAPi18n.__('internal_server_error'));
								break;
						}
				
						return throwError(error);
					}
				}
			});
		}
		
		localStorage.setItem('urevsLanguagePreference', languageSelected);
		
		Meteor.setTimeout(function() {
			$('#moreTranslations').modal('hide');
		}, 400);
	},
	'click .layout-login-div': function() {
		if ($('.login-button').length) {
			if ($('.legal-sign-in-reminder').length == 0) {
				if (TAPi18n.getLanguage() == 'es') {
					$('.dropdown-menu').append("<p class='legal-sign-in-reminder'>Cuando usas urevs.com, indicas que has leído, entiendes y estás de acuerdo con los términos de uso y política de privacidad escribida, EN INGLÉS, por <a title='Lea sobre tus derechos y obligaciones cuando usas este sitio' href='#' data-toggle='modal' data-target='#legalPrivacy'>aquí</a>.</p>");
				} else {
					$('.dropdown-menu').append("<p class='legal-sign-in-reminder'>By using urevs.com, you indicate that you have read, understand, and agree to the terms of use and privacy policy outlined <a title='Read about your rights and obligations when using the site' href='#' data-toggle='modal' data-target='#legalPrivacy'>here</a>.</p>");
				}
				
				$('.dropdown-menu').append("<input type='checkbox' id='agreeCheckBox' value='I understand and AGREE to the Terms of Use and Privacy Policy of urevs.com.'><span>I understand and AGREE to the Terms of Use and Privacy Policy of urevs.com.</span>");
				
				$('.login-button').css({display: 'none'});
				$('#agreeCheckBox').click(function() {if ($('#agreeCheckBox').is(':checked')) {
					$('.login-button').css({display: 'inline'});
				} else {
					$('.login-button').css({display: 'none'});
				}});
				
				if (localStorage.getItem('IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement') && localStorage.getItem('a_12_09_2017_IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement')) {
					$('#agreeCheckBox').click();
				}
			}
		}
		
		if ($('#login-buttons-logout').length) {
			if ($('#my-account').length == 0) {
				if (Meteor.user().profile.notificationCount) {
					$('.dropdown-menu').prepend("<a id='my-account' title='Do strony mojego konta' href='/myaccount'>" + TAPi18n.__('My_Account') + "</a><div class='notification-bubble' id='acct-acc-note'>" + Meteor.user().profile.notificationCount + "</div>");
				} else {
					$('.dropdown-menu').prepend("<a id='my-account' title='Do strony mojego konta' href='/myaccount'>" + TAPi18n.__('My_Account') + "</a>");
				}
			}
			
			$('#login-buttons-logout').html(TAPi18n.__('log_out_of_acct'));
		}
	},
	'click #login-buttons-password': function() {
		Meteor.setTimeout(function() {
			if (Meteor.user()) {
				if (Meteor.user().profile.privacyFCUnderstand && Meteor.user().profile.privacyFCUnderstandAmend12_09_2017) {
					//do nothing
					return;
				} else if (Meteor.user().profile.privacyFCUnderstand) {
					$('#privacyAmendmentDialog').modal();
				} else {
					$('#privacyFirstContactDialog').modal();
				}
			} else {
				if (localStorage.getItem('IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement') && localStorage.getItem('a_12_09_2017_IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement')) {
					//do nothing
					return;
				} else if (localStorage.getItem('IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement')) {
					$('#privacyAmendmentDialog').modal();
				} else {
					$('#privacyFirstContactDialog').modal();					
				}
			}
		}, 1000);
	},
	'click #login-buttons-logout': function() {
		Meteor.setTimeout(function() {
			$('.dropdown-toggle').html('sign in');
		}, 200);
	},
	'click .dropdown-toggle': function() {
		if ($('#layout-note')) {
			$('#layout-note').remove();
		}
	},
	'click #my-account': function() {
		if ($('#acct-acc-note')) {
			$('#acct-acc-note').remove();
		}
		
		Meteor.call('deleteNotificationAlert', function(error) {
			if (error == "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.") {
								return throwError(TAPi18n.__('internal_server_error'));
			}
		});
	},
	'click .privacy-fc-understand-btn': function() {
		if (Meteor.user()) {
			Meteor.call('IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement', function(error) {
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
			});
			
			Meteor.call('a_12_09_2017_IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement', function(error) {
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
			});
			//call this too because the amendment is accepted as part of the first time user's visit to page
		} else {
			localStorage.setItem('IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement', true);
			//ALSO, if present, delete old update item
			localStorage.setItem('a_12_09_2017_IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement', true);
			//call this too because the amendment is accepted as part of the first time user's visit to page
		}
	},
	'click .privacy-fc-understand-amendment-btn': function() {
		if (Meteor.user()) {
			Meteor.call('a_12_09_2017_IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement', function(error) {
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
			});
		} else {
			//ALSO, if present, delete old item
			localStorage.setItem('a_12_09_2017_IUnderstandAndAgreeToTheCurrentlyEnforcedUrevsLegalAgreement', true);
		}
	},
	//Populate Emergency Suggestion Creation Cache
	'keyup #suggestion': function(e) {
		var body = $(e.target);
		
		localStorage.setItem("suggestionInProgress", body.val());
	},
	'click #delete-recovered-work-link': function() {
		$('#inProgressConfirmDeleteModal').modal();
	},
	'click .reject-recovered-delete-btn': function() {
		$('#inProgressConfirmDeleteModal').modal('hide');
	},
	'click .confirm-recovered-delete-btn': function() {
		localStorage.removeItem("commentInProgress");
		localStorage.removeItem("commentInEdit");
		localStorage.removeItem("flagCommentInProgress");
		localStorage.removeItem("flagReviewInProgress");
		localStorage.removeItem("suggestionInProgress");
		$('#inProgressConfirmDeleteModal').modal('hide');
		$('#inProgressModal').modal('hide');
	},
	'click #suggestion-submit': function() {
		var suggestion = $('#suggestion').val();
		
		Meteor.call('suggestionInsert', suggestion, function(error) {
			if (error) {
				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
					 case 'Sorry! You have to be logged in to submit a suggestion.':
					 	return throwError(TAPi18n.__('suggestion_log_out'));
					 	break;
					 case "Wow! Thanks for such a response! However, it's a little too long for here. If you'd like, you can leave an email address in your suggestion/question with which Urevs can contact you to discuss your idea/question in more detail.":
					 	return throwError(TAPi18n.__('thanks_but_suggestion_too_long'));
					 	break;
					 case "Sorry. Your suggestion couldn't be saved because no text was received. Please try again.":
					 	return throwError(TAPi18n.__('suggestion_no_text'));
					 	break;
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;

					}
				}
			
				return throwError(error);
			}
			
			throwSuccess(TAPi18n.__('success_thanks_input'));
			$('#suggestions').modal('toggle');
			$('#suggestion').val('');
			localStorage.removeItem('suggestionInProgress');
		});
	},
	'click #moretext': function() {
		if ($('#moretext').html() == 'More') {
			$('#moretext').html('Less');
		} else {
			$('#moretext').html('More');
		}
	},
	'click .glyphicon-globe': function() {
		if (Router.current().route.getName() == 'landingPage') {
			location.reload();
		}
	}
});
