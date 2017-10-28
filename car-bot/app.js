// This loads the environment variables from the .env file
require('dotenv-extended').load();

var restify = require('restify');
var builder = require('botbuilder');
var carSvc = require('./car-service');
var musicRepo = require('./music');
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

/*
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded && message.membersAdded.length > 0) {
        // Say hello
        var isGroup = message.address.conversation.isGroup;
        var txt = isGroup ? "Hello everyone!" : "Hello,";
        var reply = new builder.Message()
                .address(message.address)
                .text(txt + " I'm Smart Car Bot.");
        bot.send(reply);
    } else if (message.membersRemoved) {
        // See if bot was removed
        var botId = message.address.bot.id;
        for (var i = 0; i < message.membersRemoved.length; i++) {
            if (message.membersRemoved[i].id === botId) {
                // Say goodbye
                var reply = new builder.Message()
                        .address(message.address)
                        .text("Goodbye");
                bot.send(reply);
                break;
            }
        }
    }
});
*/


// Ask the user for their name and greet them by name.
bot.dialog('greetings', [
    function (session) {
        session.userData.firstRun = true;
        session.send("Hello, I'm Smart Car Bot.").endDialog();
    }
])
.triggerAction({
    onFindAction: function (context, callback) {
        if (!context.userData.firstRun) {
            callback(null, 1.1);
        }
        else {
            callback(null, 0.0);
        }
    }
});

bot.dialog('playMusic', [
    function (session, args, next) {
        if (!args) {
            session.endDialog();
            return;
        }

        var intent = args.intent;
        var musicName = builder.EntityRecognizer.findEntity(intent.entities, 'Music.Name');
        //save the music info in session dialog data
        session.dialogData.music = {
            name: musicName? musicName.entity:null,
        };
        console.log(JSON.stringify(intent));

        var music = session.dialogData.music;
        if ( !music.name ) {
            //builder.Prompts.text(session, 'Which song you would like me to play?');
            builder.Prompts.text(session, 'Would you like to choose a song or tell me the song name?', {
                speak: 'Would you like to choose a song or tell me the song name?',
                retrySpeak: 'Would you like to choose a song or tell me the song name?',
                inputHint: builder.InputHint.expectingInput
            });
        }
        else {
            next();
        }
    },
    function (session, results, next) {
        var music = session.dialogData.music;

        //Get music info from user's response?
        if ( results.response ) {
            var choose = /choose|select/i.exec(results.response)
            if (choose) {              
                var message = new builder.Message(session);
                message.attachmentLayout =(builder.AttachmentLayout.carousel);
                message.attachments([
                    new builder.HeroCard(session)
                        .title("当我遇见你")
                        .subtitle("Andy Lau")
                        .text("When I meet you...")
                        .images([
                            builder.CardImage.create(session, 'https://gmsmartcarstorage.blob.core.windows.net/images/musiccover.png')
                        ])
                        .buttons([
                            //builder.CardAction.postBack(session, 'play music when-i-meet-you', 'Play this one') //post back this message
                            builder.CardAction.dialogAction(session, 'selectMusicPlayAction', 'when-i-meet-you', 'Play')
                        ]),
                    new builder.HeroCard(session)
                        .title("对你的爱越深就越来越心痛")
                        .subtitle("Jacky Zhang")
                        .text("When I meet you...")
                        .images([
                            builder.CardImage.create(session, 'https://gmsmartcarstorage.blob.core.windows.net/images/musiccover.png')
                        ])
                        .buttons([
                            //builder.CardAction.imBack(session, 'play music when-i-meet-you', 'Play this one'), //post back this message
                            builder.CardAction.dialogAction(session, 'selectMusicPlayAction', 'my-deep-love', 'Play')
                        ]),
                ]);
                session.send(message);
            }
            else {
                carSvc.playMusic(musicRepo.searchMusic(results.response));
                var message = 'OK, The song ' + results.response + ' is playing now.';
                session.say(message, message);
                session.endDialog();                
            }
        }
        else {
            //Play music
            carSvc.playMusic(musicRepo.searchMusic(music.name));
            var message = 'OK, The song ' + music.name + ' is playing now.';
            session.say(message, message);
            session.endDialog();
        }
    }
])
.triggerAction({
    matches: 'Entertainment.PlayMusic',
    confirmPrompt: "You are leaving the music play, sure?",
})
.cancelAction('CancelPlayMusic', "Music canceled", {
    matches: /^(cancel|nevermind)/i,
    confirmPrompt: "Are you sure?"
})
.beginDialogAction('selectMusicPlayAction', 'selectedMusicPlay', {
    matches:/^(play music)/i
});

bot.dialog('selectedMusicPlay', function(session, args, next){
    if (args.data) {
        carSvc.playMusic(args.data);
        session.say('OK, the song you selected is playing now', 'OK, the song you selected is playing now');
    }
    else {
        session.say('please select one of the songs listed above.');
    }

    session.endDialog();
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
//Car go right
//
bot.dialog('carTurnRL', [
    function(session, args, next) {
        var intent = args.intent;
        var direction = builder.EntityRecognizer.findEntity(intent.entities, 'Car.Direction');

        if (direction) {
            session.dialogData.carDir = direction.entity;
            next();
        }
        else {
            builder.Prompts.text(session,"Please tell me the direction(right or left).");
        }
    },
    function(session, results) {
        var msg = 'no direction, will not turn.';
        var direction = null;
        if (results.response) {
            direction = results.response;
        }
        else {
            direction = session.dialogData.carDir;
        }

        if (/right/i.exec(direction)) {
            carSvc.moveCar('turnRight');
            msg = 'Car is turning right now.';
        }
        else if (/left/i.exec(direction)) {
            carSvc.moveCar('turnLeft');
            msg = 'Car is turning left now.';        
        }

        session.endDialog(msg);        
    }
])
.triggerAction({
    matches: 'Car.TurnRL',
    confirmPrompt: 'Car will cancel turning, sure?'
});

//
//Car light on
//
bot.dialog('carLightOn', function(session, args, next) {
    carSvc.carLight('on');
    session.endDialog('Sure, I will turn on car light now.');
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
    session.endDialog('Sure, I will turn off car light now.');
})
.triggerAction({
    matches: 'Car.LightOff',
    confirmPrompt: 'Car light will be off, are you sure?'
});