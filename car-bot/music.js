module.exports = {
    searchMusic : function(name) {
        if ( /meet you/i.exec(name) ) {
            return 'when-i-meet-you';
        }

        if ( /strong heart/i.exec(name) ) {
            return 'strong-heart-1';
        }

        if ( /deep love/i.exec(name) ) {
            return 'my-deep-love';
        }

        if ( /love girl/i.exec(name) ) {
            return 'my-love-girl-2';
        }

        if ( /boy/i.exec(name) ) {
            return 'pretty-boy';
        }
    }
}