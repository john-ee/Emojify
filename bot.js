const https = require('https');
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "!";

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

function getStrongestEmotion(scores) {
  var highest = 0;
  var strongest;
  for (var emotion in scores) {
    if (scores.hasOwnProperty(emotion)) {
      if (scores[emotion] > highest) {
        strongest = emotion;
        highest = scores[emotion];
      };
    }
  }
  return strongest;
}

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if(message.content.indexOf(prefix) !== 0) return;

  const args = message.content.split(/\s+/g);
  const command = args.shift().slice(prefix.length).toLowerCase();

  if (command === 'ping') {
    message.reply('pong');
  }

  if (command === 'emotion') {
    var url = args.join(" ");
    var data = {};
    data["url"] = url;
    var req = https.request(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        if (res.statusCode == 200) {
          var jsonChunk = JSON.parse(chunk);
          console.log(jsonChunk);
          var i=1;
          for (face of jsonChunk) {
            message.reply("The strongest emotion of face "+i+" is "+getStrongestEmotion(face.scores));
            i++;
          }
        }
        else message.reply("I received an HTTP code "+ res.statusCode);
      });
    });
    req.write(JSON.stringify(data));
    req.end();
    req.on('error', (e) => {
      console.error(e);
      message.reply('An error occured, please consult my log files');
    });
  }
});

client.login(process.env.TOKEN);
