Meteor.startup(function() {
	BrowserPolicy.content.allowImageOrigin("https://s3.amazonaws.com");
	BrowserPolicy.content.allowImageOrigin("https://lh3.googleusercontent.com");
	BrowserPolicy.content.allowImageOrigin("https://scontent.xx.fbcdn.net");
	BrowserPolicy.content.disallowInlineScripts();
	BrowserPolicy.framing.disallow();
});
