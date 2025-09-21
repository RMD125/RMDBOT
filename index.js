const { Boom } = require('@hapi/boom');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');
const path = require('path');

// Import des handlers
const groupHandler = require('./handlers/group');
const animeHandler = require('./handlers/anime');
const ownerHandler = require('./handlers/owner');
const downloadHandler = require('./handlers/download');
const funHandler = require('./handlers/fun');
const otherHandler = require('./handlers/other');
const toolsHandler = require('./handlers/tools');
const videoHandler = require('./handlers/video');

// Configuration
const config = require('./config');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('./assets/auth_info');
    
    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        browser: ['RMDBOT', 'Chrome', '1.0.0']
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('Scannez le QR Code pour vous connecter');
        }
        
        if (connection === 'close') {
            const shouldReconnect = (new Boom(lastDisconnect?.error))?.output?.statusCode !== 401;
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('Connecté avec succès à WhatsApp');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const body = msg.message.conversation || (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) || '';
        const sender = msg.key.participant ? msg.key.participant.split('@')[0] : from.split('@')[0];
        const isGroup = from.endsWith('@g.us');
        const command = body.startsWith(config.prefix) ? body.slice(config.prefix.length).trim().split(' ')[0].toLowerCase() : '';
        const args = body.slice(config.prefix.length).trim().split(' ').slice(1);
        
        if (!body.startsWith(config.prefix)) return;

        try {
            // Gestion des commandes par catégorie
            if (groupHandler.hasOwnProperty(command)) {
                await groupHandler[command](sock, from, sender, args, msg, isGroup);
            } else if (animeHandler.hasOwnProperty(command)) {
                await animeHandler[command](sock, from, sender, args, msg);
            } else if (ownerHandler.hasOwnProperty(command)) {
                await ownerHandler[command](sock, from, sender, args, msg);
            } else if (downloadHandler.hasOwnProperty(command)) {
                await downloadHandler[command](sock, from, sender, args, msg);
            } else if (funHandler.hasOwnProperty(command)) {
                await funHandler[command](sock, from, sender, args, msg);
            } else if (otherHandler.hasOwnProperty(command)) {
                await otherHandler[command](sock, from, sender, args, msg);
            } else if (toolsHandler.hasOwnProperty(command)) {
                await toolsHandler[command](sock, from, sender, args, msg);
            } else if (videoHandler.hasOwnProperty(command)) {
                await videoHandler[command](sock, from, sender, args, msg);
            } else {
                await sock.sendMessage(from, { text: `Commande inconnue. Tapez ${config.prefix}help pour voir toutes les commandes.` });
            }
        } catch (error) {
            console.error('Erreur:', error);
            await sock.sendMessage(from, { text: 'Une erreur s\'est produite lors de l\'exécution de la commande.' });
        }
    });
}

connectToWhatsApp().catch(err => console.log(err));
