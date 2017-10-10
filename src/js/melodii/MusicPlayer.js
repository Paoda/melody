'use strict';

var mp = new Audio();

export default class MusicPlayer {
    constructor() {
        this.audioElement = mp;
        this.ispaused = false;

        let currentSong = null;
        let pastSongs = [];

        Object.defineProperty(this.audioElement, 'currentSong', {
            configurable: true,
            get: () => {
                return currentSong;
            },
            set: (value) => {
                if (!currentSong) pastSongs.push(currentSong);
                console.log(pastSongs);
                currentSong = value;
            }
        });
    }
    stop() {
        this.pause();
        this.ispaused = false;
        this.audioElement.currentTime = 0.0;
    }
    pause() {
        this.audioElement.pause();
        this.ispaused = true;
    }
    play() {
        if (this.ispaused) {
            this.audioElement.play();
            this.ispaused = false;
        }
    }
    load(obj) {
        let url = obj.location;
        this.audioElement.currentSong = obj;
        if (!this.ispaused) this.pause();
        this.audioElement.src = url;
        this.audioElement.load();
    }
    changeVol(num) {

        if (num <= 1) {
            this.audioElement.volume = num;
        }else {
            console.error(num + ' is greater than 1');
        }
    }
}