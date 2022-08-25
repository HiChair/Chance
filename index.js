const discord = require('discord.js');
const client = new discord.Client();
require('dotenv').config();
const fs = require('fs');

client.commands = new discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles ){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const prefix = "-";

var timerId;
function kickRoyce(newMember){
    console.log('working');
    newMember.member.voice.kick();
}

client.once('ready', () => {
    console.log('Chance is online!');
});
// me 539995396630380572
// rdog 228671751326924811
client.on('voiceStateUpdate', (oldMember, newMember) =>{
    let oldVoice = oldMember.channelID; 
    let newVoice = newMember.channelID; 
    let rdogID = '228671751326924811'
    let channelName = 'general'



    const d = new Date();
    let s = d.toLocaleString('en-US', { timeZone: 'America/New_York' });
    const myArray = s.split(" ");

    // Royce Appreciation Day
    if (myArray[0].includes('4/5/')){
        if (oldVoice === null){
            //user joins
            if (newMember.member.id === rdogID){
                const channel = client.channels.cache.find(channel => channel.name === channelName)
                channel.send('Hi Royce, I appreciate you!');
            }
        }
        else if(newVoice === null) {
            //user disconnects
            if (newMember.member.id === rdogID){
                const channel = client.channels.cache.find(channel => channel.name === channelName)
                channel.send('Bye Royce, I still appreciate you!');
            }
        }
    }
     // Fuck Royce Day
    else if (myArray[0].includes('4/6/')){
        if (oldVoice === null){
            //user joins
            if (newMember.member.id === rdogID){

                const channel = client.channels.cache.find(channel => channel.name === channelName)
                channel.send('Oh god not Royce, fuck off');
                // sets delay between 30 60 minutes
                let delay = Math.floor(Math.random() * (3600000 - 1800000 + 1 ) + 1800000);
                console.log(delay);
                this.timerId = setTimeout(() => {kickRoyce(newMember)}, delay);
            }
        }
        else if(newVoice === null) {
            //user disconnects
            if (newMember.member.id === rdogID){
                const channel = client.channels.cache.find(channel => channel.name === channelName)
                channel.send('Fuck you Royce');
                clearTimeout(this.timerId);
            }
        }
    }

    

});

client.on('message' , message => {
        if(!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if(command === 'ping'){
           client.commands.get('ping').execute(message,args);
        }else if(command ==='play'){
            client.commands.get('play').addSong(message,args);
        }else if(command ==='stop'){
            client.commands.get('stop').execute(message,args);
        }else if(command ==='pause'){
            client.commands.get('pause').execute(message,args);
        }else if(command ==='resume'){
            client.commands.get('resume').execute(message,args);
        }else if(command ==='skip'){
            client.commands.get('skip').execute(message,args);
        }else{
            message.channel.send("That command doesn't mean shit to me...try another one")
        }
});

client.login(process.env.TOKEN);
/*
#### KNOWN BUGS #####
1 1. Audio Randomly Stopping when hosted on heroku
1 2. Timeout not cancelling properly and disconnects bot 
0 3. 
#### FEATURES TO ADD #####
0 1. SoundCloud support
0 2. Better Error Handling

*/