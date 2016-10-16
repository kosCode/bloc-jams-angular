(function () {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        var currentAlbum = Fixtures.getAlbum();

        /**
        * @function getSongIndex
        * @desc gets the curren index of the song from a list of songs
        * @type {Object} song
        */
        var getSongIndex = function (song) {
            return currentAlbum.songs.indexOf(song);
        };

        /**
        * @desc Current song that is playing from the list of songs in the album object
        * @type {object}
        */
        SongPlayer.currentSong = null;

        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;

        /**
        * @desc current volume 0-100 of currently playing song
        * @type {Number}
        */
        SongPlayer.volume = 80;
        SongPlayer.volumeMax = 100;

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
                SongPlayer.currentSong.playing = null;
            }

            // Utilizes the Buzz library to play an audio file in an mp3 format
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });

            // This puts the current time of the song in the $root scope that so that all parts of the application can access the variable.
            currentBuzzObject.bind('timeupdate', function () {
                $rootScope.$apply(function () {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });

            SongPlayer.currentSong = song;
        };



        /**
         * @function playSong
         * @desc Uses the Buzz library to play the sound file, and flips the SongPlayer.currentSong playing flag to true
         * @param {Object} 
         */
        playSong = function () {
            currentBuzzObject.play();
            SongPlayer.currentSong.playing = true;
        }

        /**
         * @function stopSong
         * @desc Uses the Buzz library to stop the currently playing sound file, and flips the SongPlayer.currentSong playing flag to null
         * @param {Object}
         */
        stopSong = function () {
            currentBuzzObject.stop();
            SongPlayer.currentSong.playing = null;
        }

        /**
         * @function SongPlayer.play 
         * @desc This will play a song if it is paused, or set a new current song and play the nwly created song.   
         * @param {Object} song
         */
        SongPlayer.play = function (song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong();
                console.log(SongPlayer.currentSong.title + SongPlayer.currentSong.duration);


            } else if (SongPlayer.currentSong === song) {

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
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;

        }

        /**
         * @function SongPlayer.previous 
         * @desc We use the getSongIndex function to get the index of the currently playing song and then decrease that index by one. 
         * @param {Object} 
         */
        SongPlayer.previous = function () {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if (currentSongIndex < 0) {
                stopSong();

            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }

        }

        /**
         * @function SongPlayer.next 
         * @desc We use the getSongIndex function to get the index of the currently playing song and then increase that index by one. 
         * @param {Object} 
         */
        SongPlayer.next = function () {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;

            if (currentSongIndex >= currentAlbum.songs.length) {
                stopSong();

            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }

        }

        /**
        * @function setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function (time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };

        SongPlayer.setVolume = function(volLevel) {
            currentBuzzObject.setVolume(volLevel);
        }

        return SongPlayer;

    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();

