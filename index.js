// Importiere benötigte Module
const Discord = require('discord.js');
const nodemailer = require('nodemailer');
require('dotenv').config();  // Zum Laden von Umgebungsvariablen aus einer .env-Datei

// Konfiguration für Discord-Bot und E-Mail
const bot = new Discord.Client();
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Event für den Bot-Start
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

// Event für Nachrichten auf Discord
bot.on('message', async message => {
    // Überprüfe, ob die Nachricht vom Bot kommt oder der Bot selbst die Nachricht sendet
    if (message.author.bot) return;

    // Überprüfe, ob der Befehl zum Senden einer E-Mail ist
    if (message.content.startsWith('!sendmail')) {
        // Extrahiere den E-Mail-Empfänger und die Nachricht aus der Discord-Nachricht
        const args = message.content.slice('!sendmail'.length).trim().split(/ +/);
        const toEmail = args.shift();
        const emailContent = args.join(' ');

        // Konfiguriere die E-Mail-Daten
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: 'Discord Bot Email',
            text: emailContent
        };

        try {
            // Sende die E-Mail
            await transporter.sendMail(mailOptions);
            message.reply(`E-Mail erfolgreich an ${toEmail} gesendet!`);
        } catch (error) {
            console.error('Error sending email:', error);
            message.reply('Es gab einen Fehler beim Senden der E-Mail.');
        }
    }
});

// Verbinde den Bot mit Discord
bot.login(process.env.DISCORD_TOKEN);
