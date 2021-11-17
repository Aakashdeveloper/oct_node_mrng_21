const TelegramBot = require('node-telegram-bot-api');

const token = "2116027288:AAF-0iI8LU7YZgK0qitrOQLo5L3tBjnvvyc"

const bot = new TelegramBot(token, {polling:true})

bot.onText(/\/echo (.+)/, (msg,match) => {
    const chatId = msg.chat.id;
    console.log(msg.chat.description)
    const resp = match[1];
    bot.sendMessage(chatId, resp)
})

bot.on('message',(msg) => {
    const chatId = msg.chat.id;
    console.log(msg.chat)
    bot.sendMessage(chatId, `Hi ${msg.chat.first_name} Welcome to my  node bot`)
})