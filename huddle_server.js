Huddle = {};

// For now, might add more fields later
Huddle.whitelistedFields = ['id', 'login', 'firstName', 'lastName', 'name', 'avatar', 'selfLink'];

OAuth.registerService('huddle', 2, null, function(query) {
  // Get token
  var response = getTokens(query);
  var accessToken = response.accessToken;
  // Get identity (name, id, etc.)
  var huddleIdentity = getIdentity(accessToken);
  var avatar = _.where(huddleIdentity.links, { rel: 'avatar' })[0];
  var self = _.where(huddleIdentity.links, { rel: 'self' })[0];
  var id = self.href.split('/').pop();
  var identity = {
    // Basic info
    firstName: huddleIdentity.profile.personal.firstName,
    lastName: huddleIdentity.profile.personal.surname,
    name: huddleIdentity.profile.personal.displayName,
    avatar: avatar.href,
    selfLink: self.href,
    // Id
    id: id,
    // Email contact
    login: huddleIdentity.profile.contacts[0].value,
  };

  var serviceData = {
    accessToken: accessToken,
    expiresAt: (new Date()) + (1000 * response.expiresIn)
  };

  var fields = _.pick(identity, Huddle.whitelistedFields);
  _.extend(serviceData, fields);

  // Add a proxy for the email address to match other accounts-oauth packages
  serviceData.email = serviceData.login;

  // only set the token in serviceData if it's there. this ensures
  // that we don't lose old ones (since we only get this on the first
  // log in attempt)
  if (response.refreshToken) serviceData.refreshToken = response.refreshToken;

  return {
    serviceData: serviceData,
    options: { profile: {
      firstName: identity.firstName,
      lastName: identity.lastName,
      name: identity.name
    }}
  };
});

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
// - refreshToken, if this is the first authorization request
var getTokens = function (query) {
  // debugger;
  var config = ServiceConfiguration.configurations.findOne({service: 'huddle'});
  if (!config) throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    response = HTTP.post(
      "https://login.huddle.net/token", {params: {
        code: query.code,
        client_id: config.clientId,
        client_secret: OAuth.openSecret(config.secret),
        redirect_uri: OAuth._redirectUri('huddle', config, {}, {secure: true}),
        grant_type: 'authorization_code'
      }});
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Huddle. " + err.message), {response: err.response});
  }

  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Huddle. " + response.data.error);
  } else {
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in
    };
  }
};


var getIdentity = function (accessToken) {
  try {
    // Get API entry point (contains basic
    // authenticated user information).
    var entryResponse = HTTP.get(
      "https://api.huddle.net/entry",
      {
        params: { access_token: accessToken },
        headers: { 'Authorization': 'OAuth2 ' + accessToken, 'Accept': 'application/vnd.huddle.data+json' }
      }
    );
    return JSON.parse(entryResponse.content);
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Huddle. " + err.message), {response: err.response});
  }
};


Huddle.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
