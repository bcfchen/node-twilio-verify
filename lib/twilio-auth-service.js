/* 
    Twilio Service to send verification code to phone number via SMS
*/

var Q = require('q');
var TwilioService = require('./twilio-service.js');

var TwilioAuthService = function() {

    var opts = {},
        attempts = {},
        twilioService = new TwilioService();

    function __init(accountSid, authToken){
        twilioService.init(accountSid, authToken);
    }

    function __setFromNumber(number) {
        opts.fromNumber = number;
    }

    function __verifyCode(phoneNumber, code) {
        var correct = attempts[phoneNumber];
        console.log("phoneNumber", phoneNumber);
        console.log("code", code);
        if (code == correct) return true;
        else {
            return false;
        }
    }

    function __generateCode() {
        return Math.floor(Math.random() * 100000);
    };

    function __sendCode(to, body) {
        var deferred = Q.defer(),
            code = __generateCode();

        if (body && body.length > 0)
            body = body + ' ' + code;
        else body = code;

        twilioService.create('Messages', {
            From: opts.fromNumber,
            To: to,
            Body: body
        }).then(function success() {
            attempts[to] = code;
            deferred.resolve(code);
        }, function error() {
            deferred.reject('communication with Twilio failed');

        });

        return deferred.promise;
    }

    this.init = __init;
    this.sendCode = __sendCode;
    this.verifyCode = __verifyCode;
    this.setFromNumber = __setFromNumber;

    return this;
};

module.exports = TwilioAuthService;
