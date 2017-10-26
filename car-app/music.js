const Player = require('playsound');

module.exports = {
    play: function (music_name) {
        Player.play('./media/' + music_name + '.mp3', function(err){
            if (err) {
                console.log('Play music: ' + music_name + ' failed.');
            }
        })
    }
}