const config = require('../config');

module.exports = {
    // Commandes Owner
    bc: async (sock, from, sender, args, msg) => {
        if (sender !== config.owner.split('@')[0]) return await sock.sendMessage(from, { text: 'Commande réservée au propriétaire.' });
        
        if (!args[0]) return await sock.sendMessage(from, { text: 'Veuillez spécifier un message à diffuser.' });
        
        const message = args.join(' ');
        const chats = await sock.groupFetchAllParticipating();
        
        for (const chat of Object.values(chats)) {
            await sock.sendMessage(chat.id, { text: `*📢 Diffusion de ${config.name}:*\n\n${message}` });
        }
        
        await sock.sendMessage(from, { text: 'Message diffusé à tous les groupes.' });
    },
    
    leave: async (sock, from, sender, args, msg) => {
        if (sender !== config.owner.split('@')[0]) return await sock.sendMessage(from, { text: 'Commande réservée au propriétaire.' });
        
        if (from.endsWith('@g.us')) {
            await sock.groupLeave(from);
            await sock.sendMessage(from, { text: 'Bot a quitté le groupe.' });
        } else {
            await sock.sendMessage(from, { text: 'Cette commande ne peut être utilisée que dans un groupe.' });
        }
    },
    
    // ... Ajoutez d'autres commandes owner
};
