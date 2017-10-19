// This loads the environment variables from the .env file
require('dotenv-extended').load();

var restify = require('restify');
var builder = require('botbuilder');

//Setup the restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log('%s listening to %s.', server.name, server.url);
});

//Create a chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId:process.env.MICROSOFT_APP_ID, 
    appPassword:process.env.MICROSOFT_APP_PASSWORD
});

//Listen the messages
server.post('/api/messages', connector.listen());

//Receive messages from users and respond it
var bot = new builder.UniversalBot(connector, function(session){
    session.send("You said: %s.", session.message.text);
    //session.beginDialog('greetings');
});

// Ask the user for their name and greet them by name.
bot.dialog('greetings', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.endDialog(`Hello ${results.response}!`);
    }
]);

