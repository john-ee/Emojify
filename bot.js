const https = require('https');
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "/";

const help = "You may try these commands :\n"
  +prefix+"ping : test out if I am connected\n"
  +prefix+"emotion <url> : Give me a pic and I'll give the strongest emotion expressed on the identified faces\n"
  +prefix+"emoji <url> : Same as above but I'll express an emoji";

var getStrongestEmotion = require('./emotion').getStrongestEmotion;
var getEmoji = require('./emotion').getEmoji;

var options = {
  hostname: 'westus.api.cognitive.microsoft.com',
  port: 443,
  path: '/emotion/v1.0/recognize?',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key' : process.env.EMOTE_API_KEY
  }
};

function commandHandler(args, message, callback) {
  var url = args.join(" ");
  var data = {};
  data["url"] = url;
  var req = https.request(options, (res) => responseHandler(res,message,callback));
  req.write(JSON.stringify(data));
  req.end();
  req.on('error', (e) => {
    console.error(e);
    message.reply('An error occured, please consult my log files');
  });
}

function responseHandler(res, message, callback) {
  console.log('STATUS: ' + res.statusCode);
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    if (res.statusCode == 200) {
      var jsonChunk = JSON.parse(chunk);
      console.log(jsonChunk);
      var i=1;
      for (face of jsonChunk) {
        message.reply("The strongest emotion of face "+i+" is "+callback(face.scores));
        i++;
      }
      return;
    }
    else return ;message.reply("I received an HTTP code "+ res.statusCode);
  });
}


client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if(message.content.indexOf(prefix) !== 0) return;

  const args = message.content.split(/\s+/g);
  const command = args.shift().slice(prefix.length).toLowerCase();

  if (command === 'help') {
    message.reply(help);
  }

  if (command === 'ping') {
    message.reply('pong');
  }

  if (command === 'emotion') {
    commandHandler(args, message, getStrongestEmotion);
  }

  if (command === 'emoji') {
    commandHandler(args, message, getEmoji);
  }
});

client.login(process.env.TOKEN);
