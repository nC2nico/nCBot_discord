const http = require('http');
const querystring = require('querystring');
const discord = require('discord.js');
const client = new discord.Client();

http.createServer(function(req, res){
 if (req.method == 'POST'){
   var data = "";
   req.on('data', function(chunk){
     data += chunk;
   });
   req.on('end', function(){
     if(!data){
        console.log("No post data");
        res.end();
        return;
     }
     var dataObject = querystring.parse(data);
     console.log("post:" + dataObject.type);
     if(dataObject.type == "wake"){
       console.log("Woke up in post");
       res.end();
       return;
     }
     res.end();
   });
 }
 else if (req.method == 'GET'){
   res.writeHead(200, {'Content-Type': 'text/plain'});
   res.end('Discord Bot is active now\n');
 }
}).listen(3000);

client.on('ready', message =>{
 console.log('Bot準備完了～');
 client.user.setActivity('ニンゲンの愚かさ', { type: 'WATCHING' });
});

client.on('message', message =>{
 if (message.author.id == client.user.id){
   return;
 }
 if(message.isMemberMentioned(client.user)){
   sendReply(message, "呼びましたか？");
   return;
 }
 if (message.content.match(/にゃ～ん|にゃーん/)){
   let text = "にゃ～ん";
   sendMsg(message.channel.id, text);
   return;
 }
 if (message.author.id == client.user.id || message.author.bot){
   return;
 }
 if (message.content.match(/^!dr/) ||
     (message.isMemberMentioned(client.user) && message.content.match(/dr/))){
   let arr  = message.content
   let arr2 = arr.match(/[0-9]+\.?[0-9]*/g);
   lottery(message.channel.id, parseInt(arr2[0]), parseInt(arr2[1]));
 }else if (message.isMemberMentioned(client.user)) {
   sendReply(message, "呼びましたか？");
 }
});

function lottery(channelId, arr, arr2){
  for (let i = 0; i < arr; i++) {
    let random = random+Math.floor( Math.random() * arr2)+1;
  }
  sendMsg(channelId, arr+"d"+arr2+" -> "+random);
}

if(process.env.DISCORD_BOT_TOKEN == undefined){
console.log('DISCORD_BOT_TOKENが設定されていません。');
process.exit(0);
}

client.login( process.env.DISCORD_BOT_TOKEN );

function sendReply(message, text){
 message.reply(text)
   .then(console.log("リプライ送信: " + text))
   .catch(console.error);
}

function sendMsg(channelId, text, option={}){
 client.channels.get(channelId).send(text, option)
   .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
   .catch(console.error);
}
