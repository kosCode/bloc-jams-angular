(function () {
    function SongPlayer() {
        var SongPlayer = {};

        var currentSong = null;
        /**
        * @desc Buzz object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;

        /**
         * @function setSong
         * @desc Stops currently playing song and loads new audio file as currentBuzzObject
         * @param {Object} song
         */

        var setSong = function (song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                currentSong.playing = null;
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });

            currentSong = song;
        };

/**
 * @function playSong
 * @desc Uses the Buzz library to play the sound file, and flips the CurrentSong playing flag to true
 * @param {Object} song
 */

        playSong = function () {
            currentBuzzObject.play();
            currentSong.playing = true;
        }

/**
 * @function SongPlayer.play 
 * @desc This will play a song if it is paused, or set a new current song and play the nwly created song.   
 * @param {Object} song
 */

        SongPlayer.play = function (song) {

            if (currentSong !== song) {
                setSong(song);
                playSong();


            } else if (currentSong === song) {

                if (currentBuzzObject.isPaused()) {
                    playSong();

                }
            }
        };

/**
 * @function SongPlayer.pause 
 * @desc This will pause the curently playing song.  
 * @param {Object} song
 */

        SongPlayer.pause = function (song) {
            currentBuzzObject.pause();
            song.playing = false;

        }

        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', SongPlayer);
})();