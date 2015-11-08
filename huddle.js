Accounts.oauth.registerService('huddle');

if (Meteor.isClient) {
  Meteor.loginWithHuddle = function(options, callback) {
    // support a callback without options
    if (!callback && typeof options === "function") {
      callback = options;
      options = {};
    }
    if (!options) options = {};

    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    Huddle.requestCredential(options, credentialRequestCompleteCallback);
  };
} else {
  Accounts.addAutopublishFields({
    forLoggedInUser: _.map(Huddle.whitelistedFields, function (subfield) {
      return 'services.huddle.' + subfield;
    }),

    // Do not publish user emails
    forOtherUsers: _.map(_.without(Huddle.whitelistedFields, 'login', 'email'), function (subfield) {
      return 'services.huddle.' + subfield;
    })
  });
}
