Template.reviewCategoryForm.onRendered(function() {
	Session.set('firstQuestionAnswered', false);
});

Template.reviewCategoryForm.helpers({
	reviewFormCategories: function() {
		if (TAPi18n.getLanguage() == 'es') {
			return [
						{
							"title" : "Cámaras",
							"reviews" : "camerasreviews"
						},
						{
							"title" : "Móviles & Relacionado",
							"reviews" : "phonesreviews"
						},
						{
							"title" : "Computadoras, Tablets & Relacionado",
							"reviews" : "computersreviews"
						},
						{
							"title" : "Televisoras & Relacionado",
							"reviews" : "tvsreviews"
						},
						{
							"title" : "Videoconsolas & VR",
							"reviews" : "consolesreviews"
						}

			];
		}
		
		if (TAPi18n.getLanguage() == 'pl') {
			return [
						{
							"title" : "Kamery",
							"reviews" : "camerasreviews"
						},
						{
							"title" : "Komórki i Akcesoria",
							"reviews" : "phonesreviews"
						},
						{
							"title" : "Komputery, Tablety, i Akcesoria",
							"reviews" : "computersreviews"
						},
						{
							"title" : "Telewizory i Akcesoria",
							"reviews" : "tvsreviews"
						},
						{
							"title" : "Konsole & VR",
							"reviews" : "consolesreviews"
						},
						{
							"title" : "Gry",
							"reviews" : "gamesreviews"
						}

			];
		}
		
		return Categories.find();
	},
	firstQuestionAnswered: function() {
		return Session.get('firstQuestionAnswered');
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
	productA: function() {
		return Session.get('productA');
	},
	productB: function() {
		return Session.get('productB');
	},
	picPreviewName1: function() {
		return Session.get('previewName1');
	},
	picPreviewName2: function() {
		return Session.get('previewName2');
	},
	picPreviewName3: function() {
		return Session.get('previewName3');
	}
});

Template.reviewCategoryForm.events({
	'click a[href="#comparison"]': function() {
		$('.tab-content').children('#single').removeClass('active');
		$('.tab-content').children('#single').removeClass('in');
		$('.tab-content').children('#comparison').addClass('active');
		$('.tab-content').children('#comparison').addClass('in');
	},
	'change #review-language-select': function() {
		let languageSelected = $('#review-language-select').find(":selected").attr("title");
		
		TAPi18n.setLanguage(languageSelected);
	},
	'click .first-question-pill': function() {
		Session.set('firstQuestionAnswered', true);
	},
	'keyup #revPickA': function(e) {
		Session.set('productA', $(e.target).val());
	},
	'keyup #revPickB': function(e) {
		Session.set('productB', $(e.target).val());
	},
	'click #reviewsingle': function() {
		var reviewCheck = {
			single: true,
			language: $('#review-language-select').find(":selected").attr("title"),
			category: $('#createReview').find('[id=categPick]').val(),
			productName1: $('#srevPick').val()
		};

		reviewCheck.category = reviewCheck.category.toLowerCase();
		
		$('#reviewsingle').attr('value', 'Creating...');

		Meteor.call('checkReviewExists', reviewCheck, function(error, checkResult) {
			if (error) {
				$('#reviewsingle').attr('value', 'Create!');
				
				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
					 case 'Please fill in all required form fields to create a new review.':
					 	return throwError(TAPi18n.__('review_all_form_fields'));
					 	break;
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;
					}
				}

				return throwError(error);
			}
			
			if (checkResult.reviewExists) {
				Session.set('newReviewCategory', reviewCheck.category);
				Session.set('newReviewId', checkResult._id);

				$('#review-already-started').modal();
			} else {
				//no duplicate - continue on
			
				var review = _.extend(reviewCheck, {
					picUrl1: '',
					picSource1: $('#suploadPicSource').val(),
					product1Price: parseInt($('#sinputPrice').val(), 10),
					product1PricePlaceLink: $('#sinputPriceLocation').val()
				});
		
				if (!review.picSource1) {
					review.picSource1 = "";
				}
		
				if (!review.product1Price) {
					review.product1Price = undefined;
				}
		
				var file1 = document.getElementById('suploadPic').files[0];
				var metaContext = {reviewName1: review.productName1};

				if (file1) {
					var uploader = new Slingshot.Upload("productPhotoUploads", metaContext);
		
					uploader.send(file1,
						function(error, downloadUrl) {
							if (error) {
								console.error('Error uploading', uploader.xhr.response);
								return throwError(error);
							} else {
								downloadUrl = downloadUrl.replace("https://productphotosbucket.s3.amazonaws.com/", '');
								review.picUrl1 = downloadUrl;
				
								Meteor.call('reviewInsert', review, function(error, result) {
									if (error) {
										$('#reviewsingle').attr('value', 'Create!');
			
										if (TAPi18n.getLanguage() != 'en') {
											switch (error.message) {
											 case 'Sorry! You have to be logged in to submit a review': 
											 	return throwError(TAPi18n.__('review_log_out'));
											 	break;
											 case 'Please fill in all required form fields to create a new review.':
											 	return throwError(TAPi18n.__('review_all_form_fields'));
											 	break;
											 case 'Please enter a product name less than 50 characters long.':
											 	return throwError(TAPi18n.__('review_name_less_than_50'));
											 	break;
											 case 'Please enter an image url less than 1000 characters long.':
											 	return throwError(TAPi18n.__('review_image_less_than_1000'));
											 	break;
											 case	'Please enter a source url less than 1000 characters long.':
											 	return throwError(TAPi8n.__('review_source_less_than_1000'));
											 	break;
											 case 'Please submit two different products for a comparison review.':
											 	return throwError(TAPi18n.__('review_identical_products'));
											 	break;
											 case 'Please enter a non-negative price.': 
											 	return throwError(TAPi18n.__('review_price_negative'));
											 case 'Please enter a price less than 10001.':
											 	return throwError(TAPi18n.__('review_price_too_long'));
											 case 'Please enter a url less than 1000 characters long.':
											 	return throwError(TAPi18n.__('review_price_location_too_long'));
											 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
												return throwError(TAPi18n.__('internal_server_error'));
												break;
											}
										}
			
										return throwError(error);
									}
			
									if (result.reviewExists) {
										Session.set('newReviewCategory', review.category);
										Session.set('newReviewId', result._id);
			
										$('#review-already-started').modal();
									} else {
										newReview = true;
								//variable set to let review page know that it must reload since new review causes shade screen
			
										Router.go('reviewPage', {category: review.category, _id: result._id});
									}
								});
							}
					});
				} else {
					Meteor.call('reviewInsert', review, function(error, result) {
						if (error) {
							$('#reviewsingle').attr('value', 'Create!');

							if (TAPi18n.getLanguage() != 'en') {
								switch (error.message) {
								 case 'Sorry! You have to be logged in to submit a review': 
								 	return throwError(TAPi18n.__('review_log_out'));
								 	break;
								 case 'Please fill in all required form fields to create a new review.':
								 	return throwError(TAPi18n.__('review_all_form_fields'));
								 	break;
								 case 'Please enter a product name less than 50 characters long.':
								 	return throwError(TAPi18n.__('review_name_less_than_50'));
								 	break;
								 case 'Please enter an image url less than 1000 characters long.':
								 	return throwError(TAPi18n.__('review_image_less_than_1000'));
								 	break;
								 case	'Please enter a source url less than 1000 characters long.':
								 	return throwError(TAPi8n.__('review_source_less_than_1000'));
								 	break;
								 case 'Please submit two different products for a comparison review.':
								 	return throwError(TAPi18n.__('review_identical_products'));
								 	break;
								 case 'Please enter a non-negative price.': 
								 	return throwError(TAPi18n.__('review_price_negative'));
								 case 'Please enter a price less than 10001.':
								 	return throwError(TAPi18n.__('review_price_too_long'));
								 case 'Please enter a url less than 1000 characters long.':
								 	return throwError(TAPi18n.__('review_price_location_too_long'));
								 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
									return throwError(TAPi18n.__('internal_server_error'));
									break;
								}
							}

							return throwError(error);
						}

						if (result.reviewExists) {
							Session.set('newReviewCategory', review.category);
							Session.set('newReviewId', result._id);

							$('#review-already-started').modal();
						} else {
							newReview = true;
					//variable set to let review page know that it must reload since new review causes shade screen

							Router.go('reviewPage', {category: review.category, _id: result._id});
						}
					});
				}
			}
		});
	},
	'click #reviewcomparison': function() {
		var reviewCheck = {
			single: false,
			language: $('#review-language-select').find(":selected").attr("title"),
			category: $('#createReview').find('[id=categPick]').val(),
			productName1: $('#revPickA').val(),
			productName2: $('#revPickB').val(),
		};
	
		reviewCheck.category = reviewCheck.category.toLowerCase();
	
		$('#reviewcomparison').attr('value', 'Creating...');
		
		Meteor.call('checkReviewExists', reviewCheck, function(error, checkResult) {
			if (error) {
				$('#reviewcomparison').attr('value', 'Create!');

				if (TAPi18n.getLanguage() != 'en') {
					switch (error.message) {
					 case 'Please fill in all required form fields to create a new review.':
					 	return throwError(TAPi18n.__('review_all_form_fields'));
					 	break;
					 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
						return throwError(TAPi18n.__('internal_server_error'));
						break;
					}
				}

				return throwError(error);
			}

			if (checkResult.reviewExists) {
				Session.set('newReviewCategory', reviewCheck.category);
				Session.set('newReviewId', checkResult._id);

				$('#review-already-started').modal();
			} else {
				//no duplicate - continue on
		
				var review = _.extend(reviewCheck, {
					picUrl1: '',
					picUrl2: '',
					picSource1: $('#uploadPicSourceA').val(),
					picSource2: $('#uploadPicSourceB').val(),
					product1Price: parseInt($('#dinputPrice1').val(), 10),
					product1PricePlaceLink: $('#dinputPriceLocation1').val(),
					product2Price: parseInt($('#dinputPrice2').val(), 10),
					product2PricePlaceLink: $('#dinputPriceLocation2').val()
				});
		
				if (!review.picSource1) {
					review.picSource1 = "";
				}
	
				if (!review.picSource2) {
					review.picSource2 = "";
				}
		
				if (!review.product1Price) {
					review.product1Price = undefined;
				}
	
				if (!review.product2Price) {
					review.product2Price = undefined;
				}
		
				var file1 = document.getElementById('uploadPicA').files[0];
				var file2 = document.getElementById('uploadPicB').files[0];
				var metaContext = {reviewName1: review.productName1, reviewName2: review.productName2};
		
				if (file1 && file2) {
					var uploader = new Slingshot.Upload("productPhotoUploads", metaContext);
	
					uploader.send(file1,
						function(error, downloadUrl) {
							if (error) {
								console.error('Error uploading', uploader.xhr.response);
								return throwError(error);
							} else {
								downloadUrl1 = downloadUrl.replace("https://productphotosbucket.s3.amazonaws.com/", '');
								review.picUrl1 = downloadUrl1;
					

								var uploader = new Slingshot.Upload("productPhotoUploads", metaContext);
	
								uploader.send(file2,
									function(error, downloadUrl) {
										if (error) {
											console.error('Error uploading', uploader.xhr.response);
											return throwError(error);
										} else {
											downloadUrl2 = downloadUrl.replace("https://productphotosbucket.s3.amazonaws.com/", '');
											review.picUrl2 = downloadUrl2;
								
											Meteor.call('reviewInsert', review, function(error, result) {
												if (error) {
													$('#reviewcomparison').attr('value', 'Create!');
		
													if (TAPi18n.getLanguage() != 'en') {
														switch (error.message) {
														 case 'Sorry! You have to be logged in to submit a review': 
														 	return throwError(TAPi18n.__('review_log_out'));
														 	break;
														 case 'Please fill in all required form fields to create a new review.':
														 	return throwError(TAPi18n.__('review_all_form_fields'));
														 	break;
														 case 'Please enter a product name less than 50 characters long.':
														 	return throwError(TAPi18n.__('review_name_less_than_50'));
														 	break;
														 case 'Please enter an image url less than 1000 characters long.':
														 	return throwError(TAPi18n.__('review_image_less_than_1000'));
														 	break;
														 case	'Please enter a source url less than 1000 characters long.':
														 	return throwError(TAPi8n.__('review_source_less_than_1000'));
														 	break;
														 case 'Please enter a non-negative price.': 
														 	return throwError(TAPi18n.__('review_price_negative'));
														 case 'Please enter a price less than 10001.':
														 	return throwError(TAPi18n.__('review_price_too_long'));
														 case 'Please submit two different products for a comparison review.':
														 	return throwError(TAPi18n.__('review_identical_products'));
														 	break;
														 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
															return throwError(TAPi18n.__('internal_server_error'));
															break;
														}
													}
		
													return throwError(error);
												}
		
												if (result.reviewExists) {
													Session.set('newReviewCategory', review.category);
													Session.set('newReviewId', result._id);
		
													$('#review-already-started').modal();
												} else {
													newReview = true;
											//variable set to let review page know that it must reload since new review causes shade screen
			
													Router.go('reviewPage', {category: review.category, _id: result._id});
												}
											});
										}
								});
							}
					});
				} else if (file1 || file2) {
					var fileToBeSent;
			
					if (file1) {
						fileToBeSent = file1;
					} else {
						fileToBeSent = file2;
					}

					var uploader = new Slingshot.Upload("productPhotoUploads", metaContext);
	
					uploader.send(file1,
						function(error, downloadUrl) {
							if (error) {
								console.error('Error uploading', uploader.xhr.response);
								return throwError(error);
							} else {
								downloadUrl1 = downloadUrl.replace("https://productphotosbucket.s3.amazonaws.com/", '');
								review.picUrl1 = downloadUrl1;
					

								var uploader = new Slingshot.Upload("productPhotoUploads", metaContext);
	
								uploader.send(file2,
									function(error, downloadUrl) {
										if (error) {
											console.error('Error uploading', uploader.xhr.response);
											return throwError(error);
										} else {
											downloadUrl2 = downloadUrl.replace("https://productphotosbucket.s3.amazonaws.com/", '');
											review.picUrl2 = downloadUrl2;
								
											Meteor.call('reviewInsert', review, function(error, result) {
												if (error) {
													$('#reviewcomparison').attr('value', 'Create!');
		
													if (TAPi18n.getLanguage() != 'en') {
														switch (error.message) {
														 case 'Sorry! You have to be logged in to submit a review': 
														 	return throwError(TAPi18n.__('review_log_out'));
														 	break;
														 case 'Please fill in all required form fields to create a new review.':
														 	return throwError(TAPi18n.__('review_all_form_fields'));
														 	break;
														 case 'Please enter a product name less than 50 characters long.':
														 	return throwError(TAPi18n.__('review_name_less_than_50'));
														 	break;
														 case 'Please enter an image url less than 1000 characters long.':
														 	return throwError(TAPi18n.__('review_image_less_than_1000'));
														 	break;
														 case	'Please enter a source url less than 1000 characters long.':
														 	return throwError(TAPi8n.__('review_source_less_than_1000'));
														 	break;
														 case 'Please enter a non-negative price.': 
														 	return throwError(TAPi18n.__('review_price_negative'));
														 case 'Please enter a price less than 10001.':
														 	return throwError(TAPi18n.__('review_price_too_long'));
														 case 'Please submit two different products for a comparison review.':
														 	return throwError(TAPi18n.__('review_identical_products'));
														 	break;
														 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
															return throwError(TAPi18n.__('internal_server_error'));
															break;
														}
													}
		
													return throwError(error);
												}
		
												if (result.reviewExists) {
													Session.set('newReviewCategory', review.category);
													Session.set('newReviewId', result._id);
		
													$('#review-already-started').modal();
												} else {
													newReview = true;
											//variable set to let review page know that it must reload since new review causes shade screen
			
													Router.go('reviewPage', {category: review.category, _id: result._id});
												}
											});
										}
								});
							}
					});
				} else {
					Meteor.call('reviewInsert', review, function(error, result) {
						if (error) {
							$('#reviewcomparison').attr('value', 'Create!');

							if (TAPi18n.getLanguage() != 'en') {
								switch (error.message) {
								 case 'Sorry! You have to be logged in to submit a review': 
								 	return throwError(TAPi18n.__('review_log_out'));
								 	break;
								 case 'Please fill in all required form fields to create a new review.':
								 	return throwError(TAPi18n.__('review_all_form_fields'));
								 	break;
								 case 'Please enter a product name less than 50 characters long.':
								 	return throwError(TAPi18n.__('review_name_less_than_50'));
								 	break;
								 case 'Please enter an image url less than 1000 characters long.':
								 	return throwError(TAPi18n.__('review_image_less_than_1000'));
								 	break;
								 case	'Please enter a source url less than 1000 characters long.':
								 	return throwError(TAPi8n.__('review_source_less_than_1000'));
								 	break;
								 case 'Please enter a non-negative price.': 
								 	return throwError(TAPi18n.__('review_price_negative'));
								 case 'Please enter a price less than 10001.':
								 	return throwError(TAPi18n.__('review_price_too_long'));
								 case 'Please submit two different products for a comparison review.':
								 	return throwError(TAPi18n.__('review_identical_products'));
								 	break;
								 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
									return throwError(TAPi18n.__('internal_server_error'));
									break;
								}
							}

							return throwError(error);
						}

						if (result.reviewExists) {
							Session.set('newReviewCategory', review.category);
							Session.set('newReviewId', result._id);

							$('#review-already-started').modal();
						} else {
							newReview = true;
					//variable set to let review page know that it must reload since new review causes shade screen

							Router.go('reviewPage', {category: review.category, _id: result._id});
						}
					});
				}
			}
		});
	},
	'click #go-to-review': function() {						
				newReview = true;
				//variable set to let review page know that it must reload since new review causes shade screen
				
				Router.go('reviewPage', {category: Session.get('newReviewCategory'), _id: Session.get('newReviewId')});
	},
	'click #categorycreatebutton': function() {
			var categoryProposal = {
				proposedName: $('#createcategPick').val()
			};
			
			$('#categorycreatebutton').attr('value', 'Sending...');
			
				Meteor.call('newCategoryProposalInsert', categoryProposal, function(error, result) {
					if (error) {
						$('#categorycreatebutton').attr('value', 'Submit');
			
						if (TAPi18n.getLanguage() != 'en') {
							switch (error.message) {
							 case 'Sorry! You have to be logged in to submit a new category proposal.':
							 	return throwError(TAPi18n.__('log_in_to_propose_category'));
							 	break;
							 case "Please fill in all required form fields to propose a new category.":
							 	return throwError(TAPi18n.__('all_form_fields_category_proposal'));
							 	break;
							 case "Please limit category proposals to 50 characters.":
							 	return throwError(TAPi18n.__('limit_category_proposal_to_50'));
							 	break;
							 case "Sorry for the trouble! This error has been logged and will be worked on as soon as possible.":
								return throwError(TAPi18n.__('internal_server_error'));
								break;
							}
						}
				
						return throwError(error);
					}
				
					$('#createCategory').modal('toggle');
					$('#thank-you-for-category').modal('toggle');
				
					$('#categorycreatebutton').attr('value', 'Submit');
					$('#createcategPick').val('');
				});
	},
	'change input[id="suploadPic"]': function(e) {
		let fileName = $(e.target).val().split('/').pop().split('//').pop();		
		fileName = fileName.replace("C:\\fakepath\\", '');

		Session.set('previewName1', fileName);
	},
	'change input[id="uploadPicA"]': function(e) {
		let fileName = $(e.target).val().split('/').pop().split('//').pop();		
		fileName = fileName.replace("C:\\fakepath\\", '');

		Session.set('previewName2', fileName);
	},
	'change input[id="uploadPicB"]': function(e) {
		let fileName = $(e.target).val().split('/').pop().split('//').pop();		
		fileName = fileName.replace("C:\\fakepath\\", '');

		Session.set('previewName3', fileName);
	}	
});
