const { Discord, Client, MessageEmbed } = require('discord.js');
const client = global.client = new Client({fetchAllMembers: true});
const ytdlDiscord = require("discord-ytdl-core");
const ayarlar = require('./ayarlar.json');
const fs = require('fs');

client.on("ready", async () => {
    client.user.setPresence({ activity: { name: "Poseidon ❤️ Yashinu" }, status: "idle" });
    let botVoiceChannel = client.channels.cache.get(ayarlar.botVoicebotVoiceChannelID);
    if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Bot ses kanalına bağlanamadı!"));
    setInterval(() => {
        setWelcomeLogin();
}, 1000*60*60*1);
  });
  // Yashinu tarafından kodlanmıştır.


  client.on("message", async message => {
    if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(ayarlar.botPrefix)) return;
    if (message.author.id !== ayarlar.botOwner && message.author.id !== message.guild.owner.id) return;
    let args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0].slice(ayarlar.botPrefix.length);

    if (command === "eval" && message.author.id === ayarlar.botOwner) {
      if (!args[0]) return message.channel.send(`Kod belirtilmedi`);
        let code = args.join(' ');
        function clean(text) {
        if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
        text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
        return text;
      };
      try { 
        var evaled = clean(await eval(code));
        if(evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace(client.token, "Yasaklı komut");
        message.channel.send(`${evaled.replace(client.token, "Yasaklı komut")}`, {code: "js", split: true});
      } catch(err) { message.channel.send(err, {code: "js", split: true}) };
    };
});

client.on('voiceStateUpdate', async (prev, cur) => {
    let logKanali = client.channels.cache.get(ayarlar.seslog);
    if (logKanali) { logKanali.send(new MessageEmbed().setColor("#00ffdd").setTitle('Kayıt Kanalına Giriş Gerçekleşti!').setDescription(`${cur.member} **(${cur.member.id})** tarafından <#${prev.channel.id}> odasına giriş gerçekleşti.`).setFooter(`${client.users.cache.has(ayarlar.botOwner) ? client.users.cache.get(ayarlar.botOwner).tag : "Yashinu"} was here!`).setTimestamp()).catch(); } 

})

client.on('voiceStateUpdate', async function(oldState, newState){
    if((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
    if(newState.botVoiceChannelID == ayarlar.botVoiceChannelID){
      if(client.channels.cache.get(ayarlar.botVoiceChannelID).members.some(member => member.roles.cache.has(ayarlar.yetkiliid)) == true) 
       client.guilds.cache.get(ayarlar.server).me.voice.setMute(true)
    } else if(oldState.botVoiceChannelID == ayarlar.botVoiceChannelID){
      if(client.channels.cache.get(ayarlar.botVoiceChannelID).members.some(member => member.roles.cache.has(ayarlar.yetkiliid)) == false)  play()
    }
  })
  
  
  async function setWelcomeLogin(){ 
    let url = await ytdlDiscord(ayarlar.videoURL, {
              filter: "audioonly",
              opusEncoded: true,
              encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
      });
    let streamType = ayarlar.videoURL.includes("youtube.com") ? "opus" : "ogg/opus"; 
    client.channels.cache.get(ayarlar.botVoiceChannelID).join().then(async connection => { 
      if(client.channels.cache.get(ayarlar.botVoiceChannelID).members.some(member => member.roles.cache.has(ayarlar.yetkiliid)) == false) { 
       client.guilds.cache.get(ayarlar.server).me.voice.setMute(false)
        connection.play(url, {type: streamType}).on("finish", () => { 
          play(url); 
        }); 
      } else play(url); 
    }); 
  }  

  client.on('voiceStateUpdate', async (___, newState) => {
    if (
    newState.member.user.bot &&
    newState.botVoiceChannelID &&
    newState.member.user.id == client.user.id &&
    !newState.selfDeaf
    ) {
    newState.setSelfDeaf(true);
    }
    });
    
 

client.login(ayarlar.token)
