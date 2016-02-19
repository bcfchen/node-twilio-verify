# node-twilio-verify
## Node module for twilio phone number verification via SMS

This module verifies the user's phone number by generating a unique code and sending it to the user's phone via SMS. The user then sends the code back to the node server, and if the two codes match, the user is verified. 

Most of the logic behind this module came from mcwebb's [angular-twilio-verification] (https://github.com/mcwebb/angular-twilio-verification). This module adapted the logic to node for the sake of convenience. 

**Note: you must have a Twilio account with a valid accountSid and authToken to use this module.**

### Setup
Require the module into your Node application with the line:

TwilioAuthService = require('node-twilio-verify')

Create a new instance of TwilioAuthService, initialize with the accountSid, authToken, and set the "from" number that comes with your Twilio account:
```
    var accountSid = "xxxxxxxx",
        authToken = "yyyyyyyyyy",
        fromNumber = '+1xxxxxxxxxx';

    twilioAuthService = new TwilioAuthService();
    twilioAuthService.init(accountSid, authToken);
    twilioAuthService.setFromNumber(fromNumber);
```
### Use
Fire away with sendCode or verifyCode!!
```
    twilioAuthService.sendCode(toNumber, msgBody).then(function(results) {
        res.send(200, results);
    }, function error(err) {
        res.send(500, err);
    });
    
    var isValid = twilioAuthService.verifyCode(phoneNumber, code);
    if (isValid){
        res.send(200, "Validation success");
    } else {
        res.send(422, "Code validation failed");
    }
```
