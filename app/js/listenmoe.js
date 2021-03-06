/* Listen.MOE Support, no I'm not a weeb */
'use strict';
class ListenMoe {
    connect() {
        this.socket = new WebSocket('wss://listen.moe/api/v2/socket');

        this.socket.onopen = () => {
            console.log('Connection Established: LISTEN.moe Websocket');
            this.img = document.getElementById('albumImg');
            this.img.style.width = '100%';
            this.img.style.height = 'auto';
            Global.melodii.metadata = { format: { duration: null } };
            this.img.src = 'https://listen.moe/files/images/logo_big.png';
        };
        this.socket.onerror = (e) => console.log('LISTEN.moe Websocket Error: + ' + e);
        this.socket.onclose = () => {

            if (this.userExit === true) {
                console.log('LISTEN.moe Websocket Closed (User Requested)');
                this.img = document.getElementById('albumImg');
                this.img.style.width = 'auto';
                this.img.style.height = '100%';
                this.socket = null;
            } else {
                console.error('LISTEN.moe Websocked Closed. Reopening...');
                window.setTimeout(this.createWebSocket, 10000);
            }
        };
        this.socket.onmessage = (msg) => {
            if (Global.musicPlayer.src !== 'http://listen.moe:9999/stream') {
                //User has loaded some other file, LISTEN.moe support can shutdown.
                this.userExit = true; //Allowing for Proper 
                this.socket.close();
            }

            try {
                this.metadata = JSON.parse(msg.data);
            } catch (e) {
                console.log('Faulty Response from LISTEN.moe Websocket');
                return -1;
            }
            this.loadSongInfo();
        };
    }
    listen() {
        Global.musicPlayer.src = 'http://listen.moe:9999/stream';
        Global.melodiiCNTRL.toggle();
    }
    loadSongInfo() {
        let lastfmEnable = Global.settings.general.lastfm.enable;
        let title = this.metadata.song_name;
        let artist = this.metadata.artist_name;
        let listeners = this.metadata.listeners;

        if (this.song) { //Essentially if it's the first time running this function.
            if (title !== this.song.title) { //If this is a different song
                this.lastSong = this.song; //Moving the Last Song to a different variable (so that we can scrobble);
                if (lastfmEnable) this.readyToScrobble = true; 
                this.song = { //Updating Song so that it's new;
                    title: title,
                    artist: artist,
                    listeners: listeners,
                    timeBegun: (new Date().getTime() / 1000)
                };
            }
        } else {
            this.song = {
                title: title,
                artist: artist,
                listeners: listeners,
                timeBegun: (new Date().getTime() / 1000)
            };
        }
        if (this.readyToScrobble === true) {
            let duration = Math.floor((new Date().getTime() / 1000) - this.songs.timeBegun);

            Global.lastfm.lfm.track.scrobble({
                'artist': this.song.artist,
                'track': this.song.title,
                'timestamp': Math.floor((new Date().getTime / 1000) - duration)
            }, (err, scrobble) => {
                if (err) throw err;
                console.log('(LISTEN.moe) Scrobbling Successful');
            });
        }
        Global.songInfo.innerHTML = `${title} - ${artist} [Listeners: ${listeners}]`;
    }
}

Global.eventEmitter.on('Settings Loaded', () => {
    if (Global.settings.general.listenmoe.enable) {
        Global.listenmoe = new ListenMoe();
    } else {
        console.log('LISTEN.MOE support Disabled');
    }
});

document.getElementById('listenmoeBtn').onclick = () => {
    Global.settings.general.listenmoe.enable = true;
    Global.settings.saveSettings();

    Global.listenmoe = new ListenMoe();
    Global.listenmoe.connect();
    Global.listenmoe.listen();
};