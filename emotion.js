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

exports.getStrongestEmotion = getStrongestEmotion;

function getEmoji(scores) {
  switch (getStrongestEmotion(scores)) {
    case "anger":
      return ":rage:";
    case "contempt":
      return ":unamusd:";
    case "disgust":
      return ":persevere:";
    case "fear":
      return ":scream:";
    case "happiness":
      return ":smiley:";
    case "neutral":
      return ":no_mouth:";
    case "sadness":
      return ":sob:";
    case "surprise":
      return ":astonished:";
    default:
      break;
  }
  return "no_emoji";
}

exports.getEmoji = getEmoji;
