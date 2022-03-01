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

client.once('ready', () => {
    console.log('Chance is online!');
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

//client.login(process.env['TOKEN']);
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