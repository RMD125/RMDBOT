const fs = require('fs');
const axios = require('axios');

module.exports = {
    // Commandes de groupe
    promote: async (sock, from, sender, args, msg, isGroup) => {
        if (!isGroup) return await sock.sendMessage(from, { text: 'Cette commande est réservée aux groupes.' });
        if (!args[0]) return await sock.sendMessage(from, { text: 'Veuillez mentionner un utilisateur.' });
        
        const participant = args[0].replace('@', '') + '@s.whatsapp.net';
        await sock.groupParticipantsUpdate(from, [participant], 'promote');
        await sock.sendMessage(from, { text: 'Utilisateur promu avec succès.' });
    },
    
    demote: async (sock, from, sender, args, msg, isGroup) => {
        if (!isGroup) return await sock.sendMessage(from, { text: 'Cette commande est réservée aux groupes.' });
        if (!args[0]) return await sock.sendMessage(from, { text: 'Veuillez mentionner un utilisateur.' });
        
        const participant = args[0].replace('@', '') + '@s.whatsapp.net';
        await sock.groupParticipantsUpdate(from, [participant], 'demote');
        await sock.sendMessage(from, { text: 'Utilisateur rétrogradé avec succès.' });
    },
    
    kick: async (sock, from, sender, args, msg, isGroup) => {
        if (!isGroup) return await sock.sendMessage(from, { text: 'Cette commande est réservée aux groupes.' });
        if (!args[0]) return await sock.sendMessage(from, { text: 'Veuillez mentionner un utilisateur.' });
        
        const participant = args[0].replace('@', '') + '@s.whatsapp.net';
        await sock.groupParticipantsUpdate(from, [participant], 'remove');
        await sock.sendMessage(from, { text: 'Utilisateur expulsé avec succès.' });
    },
    
    add: async (sock, from, sender, args, msg, isGroup) => {
        if (!isGroup) return await sock.sendMessage(from, { text: 'Cette commande est réservée aux groupes.' });
        if (!args[0]) return await sock.sendMessage(from, { text: 'Veuillez spécifier un numéro.' });
        
        const participant = args[0].replace('+', '').replace(' ', '') + '@s.whatsapp.net';
        await sock.groupParticipantsUpdate(from, [participant], 'add');
        await sock.sendMessage(from, { text: 'Utilisateur ajouté avec succès.' });
    },
    
    // ... Ajoutez d'autres commandes de groupe
};
