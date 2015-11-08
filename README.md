## accounts-huddle

Huddle.com OAuth2 login service for use with Meteor Accounts.

### Huddle API
Before usage, be sure to get access to the Huddle API. You'll need to contact their API team with some basic information in order to obtain access to an API key. You can get started on that by visiting the [Huddle API docs](https://login.huddle.net/docs/index.html).

Be sure to provide exact redirect URIs in the following format:
`http://yoursiteurl.xyz/_oauth/huddle?close`

### Package Dependencies

* accounts-base
* accounts-oauth

### Usage

1. `meteor add typ:accounts-huddle`
2. Read the 'Integrating with Login Services' section of [Getting Started with Auth](https://github.com/meteor/meteor/wiki/Getting-started-with-Auth) and make sure you set up your config correctly.
3. Call `Meteor.loginWithHuddle();`
4. You also have access to a `Huddle` API object, to control the lower layers of the client
   and server flows. Don't use it unless you know what you're doing!

The redirect URI must be set to '${yoursiteurl}/_oauth/huddle?close'

### Credits

* Shamelessly based on the `accounts-box` package which was shamelessly based on the core `accounts-google` and `google` packages. Thanks guys :)
