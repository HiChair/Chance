const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

var songQueue = [];
var titleQueue = [];
var voiceChannel;
var Message;
var vid;
module.exports = {
    name: 'play',
    description: 'plays music',
    musicPlaying: false,
    pausing: false,
    timeoutId: undefined,
    /*
    listens to users message and calls songQueue function to add song to queue and then play
    */
    async addSong(message, args) {
        Message = message;
        //const permissions = voiceChannel.permissionsFor(message.client.user);
        voiceChannel = message.member.voice.channel;
        if (!message.member.hasPermission('CONNECT')) return message.channel.send("You don't have the correct permissions for this command");
        if (!message.member.hasPermission('SPEAK')) return message.channel.send("You don't have the correct permissions for this command");
        if (!args.length) return message.channel.send("You need to tell me to play something, dipshit...");
        if (!message.member.voice.channel) return message.channel.send("You need to be in channel to play music");


        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);
            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }
       
        if (args[0].includes("https://")){
            const splitArgs = args[0].split("&list")
            video = await videoFinder(splitArgs[0]);
            vid = true;
        }
        else{
            video = await videoFinder(args.join(' '));
            console.log(video);
            vid = false
        }
        if (songQueue.length === 0) { this.musicPlaying = false; }
        this.queueSong(video,vid);
    },
    /*
    Adds song to queue as well as video title
    -needs optimized 
    */
    async queueSong(video,vid) {
        // checks if args links to a video
        if (vid){
            if (video) {
                console.log(`Adding video ${video.url}`);
                songQueue.push(ytdl(video.url, { filter: 'audioonly' }));
                titleQueue.push(video.title);
                this.playSong('queue');
            } 
            else{
                Message.channel.send("No video results found");
            }
        }
        else{
            try{
                const songInfo = await ytdl.getInfo(video.url);
                const song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                };
                if(song){
                    console.log(`Adding song ${song.url}`);
                    songQueue.push(ytdl(song.url, {filter: 'audioonly' }));
                    titleQueue.push(song.title);
                    this.playSong('queue');
                    return;
                }
            }catch(err){
                console.log(err.stack);
            }
        }
    },
    //removed seek: 0 from connection.play options
    /*
    Plays Song from queue and updates queue
    -need to make sure queue gets updated correctly
    */
    async playSong(command) {
        const connection = await voiceChannel.join();
        if (command === 'queue') {
            if (!this.musicPlaying) {
                this.timeout(false);
                this.musicPlaying = true;
                await Message.reply(`Now playing ***${titleQueue[0]}***`)
                const dispatcher = connection.play(songQueue[0], { volume: 1 })
                    .on('finish', () => {
                        songQueue.shift();
                        titleQueue.shift();
                        console.log(`Song finished, ${songQueue.length}`);
                        this.musicPlaying = false;
                        if (songQueue.length === 0) { 
                            this.timeout(true);
                            return 
                        }
                        else{
                            this.playSong('queue');
                        }
                    })
                    .on('error', error => console.error(error));
            }
            else {
                Message.reply(`${titleQueue[titleQueue.length-1]}*** has been added to the queue.`)
            }
            
        } else if (command === 'pause') {
            try{
                connection.dispatcher.pause();
                this.timeout(true);
            }catch(err){
                return {Error: err.stack};
            }

        } else if (command === 'stop') {
            while (songQueue.length > 0) {
                songQueue.shift();
                titleQueue.shift();
            }
            this.timeout(false);
        }else if(command === 'resume'){
            try{
                connection.dispatcher.resume();
                this.timeout(false);
            }catch(err){
                return {Error: err.stack};
            }
            

        }else if(command === 'skip'){
            try{
                await Message.reply(`Skipping ***${titleQueue[0]}***`)
                songQueue.shift();
                titleQueue.shift();
                this.musicPlaying = false;
                if (songQueue.length === 0) { 
                    connection.dispatcher.destroy();
                    this.timeout(true);
                }
                else{
                    this.playSong('queue');
                }
            }catch(err){
                return {Error: err.stack};
            }
        }
    },

    
    async timeout(bool) {        
       if(bool){
            this.timeoutId = setTimeout(() => {Message.channel.send('See ya');this.playSong('stop');voiceChannel.leave()},300000)
            console.log(`Setting timeout ${this.timeoutId}`);
    }
       else{
            console.log("Trying to clear...");
            if(this.timeoutId){
                console.log(`Clearing Timeout ${this.timeoutId}`);
                clearTimeout(this.timeoutId);
           }
       }
    }
}
