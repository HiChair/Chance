const Connection = require('./play.js')
module.exports = {
    name: 'skip',
    description: 'skips music',
    async execute(message,args){
        //const voiceChannel = message.member.voice.channel;
        //const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!message.member.hasPermission('CONNECT')) return message.channel.send("You don't have the correct permissions for this command");
        if(!message.member.hasPermission('SPEAK')) return message.channel.send("You don't have the correct permissions for this command");
        if(!message.member.voice.channel) return message.channel.send("You need to be in channel to skip music");
        await Connection.playSong('skip');
    }
}