/* 
    Twilio Service to make twilio API calls and send SMS messages
*/

var Q = require('q');
var request = require('request');

var TwilioService = function() {

    var apiEndpoint, credentials, accounts;

    apiEndpoint = 'https://api.twilio.com/2010-04-01/';

    credentials = {
        accountSid: '',
        authToken: ''
    };

    accounts = {
        _default: ''
    };

    function __initialize(accountSid, authToken) {
        credentials.accountSid = accountSid;
        credentials.authToken = authToken;
        accounts._default = accountSid;
    }

    function __transformRequest(data, getHeaders) {
        return __serializeData(data);
    };

    function __serializeData(data) {
        // If this is not an object, defer to native stringification.
        if (!(typeof data === "object")) {
            return (data === null) ? '' : data.toString();
        }

        var buffer = [];
        // Serialize each key in the object.
        for (var name in data) {
            if (!data.hasOwnProperty(name)) continue;
            var value = data[name];
            buffer.push(
                encodeURIComponent(name) +
                '=' +
                encodeURIComponent((value === null) ? '' : value)
            );
        }

        // Serialize the buffer and clean it up for transportation.
        var source = buffer
            .join('&')
            .replace(/%20/g, '+');

        return source;
    };

    function __transformResourceUrl(url) {
        if (url.substr(-1) === '/')
            url = url.substr(0, url.length - 1);
        return url + '.json';
    };

    function __generateRequest(method, resource, data, account) {
        var deferred = Q.defer();
        method = method.toUpperCase();

        if (!(typeof account === "string") || account.length < 1)
            account = '_default';
        resource = 'Accounts/' +
            accounts[account] + '/' +
            __transformResourceUrl(resource);

        var credentialsB64 = new Buffer(credentials.accountSid + ':' + credentials.authToken).toString('base64');

        var options = {
            method: method,
            url: apiEndpoint + resource,
            headers: {
                'Authorization': 'Basic ' + credentialsB64,
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        };

        if (data) options.form = __serializeData(data);

        request(options, function(error, response, body){
            if (!error){
                deferred.resolve(response);
            } else {
                deferred.reject(err);
            }
            
        });

        return deferred.promise;
    };

    this.init = __initialize;
    this.create = function(resource, data, account) {
        return __generateRequest('POST', resource, data, account);
    };
    
    return this;
};

module.exports = TwilioService;
