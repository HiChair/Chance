const Connection = require('./play.js')

module.exports = {
    name: 'pause',
    description: 'pauses music',
    async execute(message, args) {

        const voiceChannel = message.member.voice.channel;
        if(!message.member.hasPermission('CONNECT')) return message.channel.send("You don't have the correct permissions for this command");
        if(!message.member.hasPermission('SPEAK')) return message.channel.send("You don't have the correct permissions for this command");
        if(!message.member.voice.channel) return message.channel.send("You need to be in channel to pause music");
        await Connection.playSong('pause');
    }
}