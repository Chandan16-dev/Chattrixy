// Pool of realistic stranger opening messages and replies
export const GREETINGS = [
  'hey 👋',
  'hi there!',
  'hello?',
  'hey, asl?',
  'sup',
  'hi!! how are you?',
  'heyyy',
  'hello hello',
  'hey what\'s good',
  'hi :)',
]

export const REPLIES = [
  'lol yeah same',
  'oh interesting, tell me more',
  'haha that\'s funny',
  'wait really??',
  'same here tbh',
  'I feel you',
  'omg yes!!!',
  'no way 😂',
  'that\'s actually wild',
  'fr fr',
  'okay but like what do you think?',
  'honestly yeah',
  'I was just thinking about that lol',
  'where are you from?',
  'that made me laugh 😅',
  'hmm, idk',
  'ngl that\'s pretty cool',
  'what do you do for fun?',
  'haha you seem fun',
  'bruh 💀',
  'okay so random question but...',
  'wdym?',
  'wait i need context',
  'lmaoo okay',
  'actually that makes sense',
]

export const getRandomGreeting = () =>
  GREETINGS[Math.floor(Math.random() * GREETINGS.length)]

export const getRandomReply = () =>
  REPLIES[Math.floor(Math.random() * REPLIES.length)]

export const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min
