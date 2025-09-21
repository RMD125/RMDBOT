const axios = require('axios');

module.exports = {
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
    
    groupinfo: async (sock, from, sender, args, msg, isGroup) => {
        if (!isGroup) return await sock.sendMessage(from, { text: 'Cette commande est réservée aux groupes.' });
        
        const metadata = await sock.groupMetadata(from);
        const participants = metadata.participants;
        
        const text = `
*Informations du Groupe*
📛 Nom: ${metadata.subject}
👥 Participants: ${participants.length}
🏆 Créateur: ${metadata.owner.split('@')[0]}
📅 Création: ${new Date(metadata.creation * 1000).toLocaleDateString()}
        `;
        
        await sock.sendMessage(from, { text });
    },
    
    invite: async (sock, from, sender, args, msg, isGroup) => {
        if (!isGroup) return await sock.sendMessage(from, { text: 'Cette commande est réservée aux groupes.' });
        
        const code = await sock.groupInviteCode(from);
        await sock.sendMessage(from, { text: `Lien d'invitation: https://chat.whatsapp.com/${code}` });
    },
    
    revoke: async (sock, from, sender, args, msg, isGroup) => {
        if (!isGroup) return await sock.sendMessage(from, { text: 'Cette commande est réservée aux groupes.' });
        
        await sock.groupRevokeInvite(from);
        await sock.sendMessage(from, { text: 'Lien d\'invitation régénéré avec succès.' });
    },
    
    setname: async (sock, from, sender, args, msg, isGroup) => {
        if (!isGroup) return await sock.sendMessage(from, { text: 'Cette commande est réservée aux groupes.' });
        if (!args[0]) return await sock.sendMessage(from, { text: 'Veuillez spécifier un nouveau nom.' });
        
        const name = args.join(' ');
        await sock.groupUpdateSubject(from, name);
        await sock.sendMessage(from, { text: 'Nom du groupe modifié avec succès.' });
    },
    
    setdesc: async (sock, from, sender, args, msg, isGroup) => {
        if (!isGroup) return await sock.sendMessage(from, { text: 'Cette commande est réservée aux groupes.' });
        if (!args[0]) return await sock.sendMessage(from, { text: 'Veuillez spécifier une nouvelle description.' });
        
        const desc = args.join(' ');
        await sock.groupUpdateDescription(from, desc);
        await sock.sendMessage(from, { text: 'Description du groupe modifiée avec succès.' });
    },
    
    listadmins: async (sock, from, sender, args, msg, isGroup) => {
        if (!isGroup) return await sock.sendMessage(from, { text: 'Cette commande est réservée aux groupes.' });
        
        const metadata = await sock.groupMetadata(from);
        const admins = metadata.participants.filter(p => p.admin).map(p => p.id.split('@')[0]);
        
        await sock.sendMessage(from, { text: `Administrateurs du groupe:\n${admins.map((a, i) => `${i+1}. ${a}`).join('\n')}` });
    }
};
