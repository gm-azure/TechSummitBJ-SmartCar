// This loads the environment variables from the .env file
require('dotenv-extended').load();

var restify = require('restify');
var builder = require('botbuilder');
var carSvc = require('./car-service');
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
    //session.send("You said: %s.", session.message.text);
    //session.beginDialog('greetings');

    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

var luisModelUrl = process.env.LUIS_MODEL_URL;
bot.recognizer(new builder.LuisRecognizer(luisModelUrl));

// Ask the user for their name and greet them by name.
bot.dialog('greetings', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What command your want to invoke?');
    },
    function (session, results) {
        //carSvc.invokeDeviceCommand();
        session.endDialog(`Command ${results.response} started!`);
    }
]);

bot.dialog('PlayMusic', [
    function (session, args, next) {
        var intent = args.intent;
        var musicName = builder.EntityRecognizer.findEntity(intent.entities, 'Music.Name');
        //save the music info in session dialog data
        session.dialogData.music = {
            name: musicName? musicName.entity:null,
        };
        console.log(JSON.stringify(intent));

        var music = session.dialogData.music;
        if ( !music.name ) {
            builder.Prompts.text(session, 'Which song you would like me to play?');
        }
        else {
            next();
        }
    },
    function (session, results) {
        var music = session.dialogData.music;

        //Get music info from user's response?
        if ( results.response ) {
            music.name = results.response;
        }

        //Play music
        carSvc.playMusic(music.name);

        session.endDialog('Playing the music named "%s"', music.name);
    }
])
.triggerAction({
    matches: 'Entertainment.PlayMusic',
    confirmPrompt: "This will play an music for you. Are you sure?"
})
.cancelAction('CancelPlayMusic', "Music canceled", {
    matches: /^(cancel|nevermind)/i,
    confirmPrompt: "Are you sure?"
});

//
//Car stop
//
bot.dialog('carStop', function(session, args, next) {
    carSvc.moveCar('stop');
    session.endDialog('Car is stopped now.');
})
.triggerAction({
    matches: 'Car.Stop',
    confirmPrompt:'Car will be stopped, are you sure?'
});

//
//Car Start
//
bot.dialog('carStart', function(session, args, next) {
    carSvc.moveCar('start');
    session.endDialog('Car is started now.');
})
.triggerAction({
    matches: 'Car.Start',
    confirmPrompt: 'Car will be started, are you sure?'
});

//
//Car go forward
//
bot.dialog('carGoForward', function(session, args, next) {
    carSvc.moveCar('forward');
    session.endDialog('Car is going forward now.');
})
.triggerAction({
    matches: 'Car.GoForward',
    confirmPrompt:'Car will go forward, are you sure?'
});

//
//Car go backward
//
bot.dialog('carGoBackward', function(session, args, next) {
    carSvc.moveCar('backward');
    session.endDialog('Car is going backward now.');
})
.triggerAction({
    matches: 'Car.GoBackward',
    confirmPrompt: 'Car will go backward, are you sure?'
});

//
//Car go left
//
bot.dialog('carTurnLeft', function(session, args, next) {
    carSvc.moveCar('turnLeft');
    session.endDialog('Car is turning left now.');
})
.triggerAction({
    matches: 'Car.TurnLeft',
    confirmPrompt: 'Car will go left, are you sure?'
});

//
//Car go right
//
bot.dialog('carTurnRight', function(session, args, next) {
    carSvc.moveCar('turnRight');
    session.endDialog('Car is turning right now.');
})
.triggerAction({
    matches: 'Car.TurnRight',
    confirmPrompt: 'Car will go right, are you sure?'
});

//
//Car light on
//
bot.dialog('carLightOn', function(session, args, next) {
    carSvc.carLight('on');
    session.endDialog('Car light is on.');
})
.triggerAction({
    matches: 'Car.LightOn',
    confirmPrompt: 'Car light will be on, are you sure?'
});

//
//Car light off
//
bot.dialog('carLightOff', function(session, args, next) {
    carSvc.carLight('off');
    session.endDialog('Car light is off.');
})
.triggerAction({
    matches: 'Car.LightOff',
    confirmPrompt: 'Car light will be off, are you sure?'
});