const https = require('https');
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "?";

const help = "You may try these commands :\n"
  +prefix+"ping : test out if I am connected\n"
  +prefix+"emotion <url | image> : Give me a pic and I'll give the strongest emotion expressed on the identified faces\n"
  +prefix+"emoji <url | image> : Same as above but I'll express an emoji";

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

function emojiHandler(args, message, callback) {
  var url = null, data = {};
  // = args.join(" ");
  if (message.attachments.array().length) url = message.attachments.array()[0].url;
  else if (args.join(" ")!=="") url = args.join(" ");
  else return message.reply("Please include an URL or an image");
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
      if (!jsonChunk.length) return message.reply("No face recognized");
      var i=1;
      for (face of jsonChunk) {
        message.reply("The strongest emotion of face "+i+" is "+callback(face.scores));
        i++;
      }
      return;
    }
    else return message.reply("I received an HTTP code "+ res.statusCode);
  });
}


client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if(message.content.indexOf(prefix) !== 0) return;

  const args = message.content.split(/\s+/g);
  const command = args.shift().slice(prefix.length).toLowerCase();

  /*if (command === 'new-prefix') {
    if (args.join(" ") !== "") {
      prefix = args.join(" ");
      message.reply("New command prefix is "+ prefix);
    }
    else message.reply("Please include a new prefix if you wish to change it");
  }*/

  if (command === 'help') {
    message.reply(help);
  }

  if (command === 'ping') {
    message.reply('pong');
  }

  if (command === 'emotion') {
    emojiHandler(args, message, getStrongestEmotion);
  }

  if (command === 'emoji') {
    emojiHandler(args, message, getEmoji);
  }
});

client.login(process.env.TOKEN);
