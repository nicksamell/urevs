Slingshot.createDirective("productPhotoUploads", Slingshot.S3Storage, {
  bucket: "productphotosbucket",

  acl: "public-read",

  authorize: function () {
    var user = Meteor.user();
	 var now = new Date();
	 var todayDate = now.getDate() + '-' + now.getMonth() + '-' + now.getFullYear();
    
    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "You can submit reviews without logging in. However, please login to submit product photos";
      throw new Meteor.Error("Login Required", message);
    } else {
		//This statement is an anti-spam measure
		if (user.lastDatePicPosted == todayDate) {
			if (user.picsPostedToday > 50) {
				throw new Meteor.Error("Photo Limit Exceeded", "For security reasons, Urevs must have a limit on how many photos a user posts during the day. You have reached this limit. Urevs apologizes for any inconvenience this may cause.")
			} else {
				Meteor.users.update({_id: user._id}, {$inc: {'picsPostedToday': 1}});
			}
		} else {
			Meteor.users.update({_id: user._id}, {$set: {'picsPostedToday': 1, 'lastDatePicPosted': todayDate}});
		}
	 }

    return true;
  },

  key: function (file, metaContext) {
    //Store file into a directory by the review's products
    var prodPhotoId = Random.id();
    
    if (metaContext.reviewName2) {
    	return metaContext.reviewName1 + "_VS_" + metaContext.reviewName2 + "/" + file.name + '(' + prodPhotoId + ')';
    } else {
    	return metaContext.reviewName1 + "/" + file.name + '(' + prodPhotoId + ')';
    }
  }
});
