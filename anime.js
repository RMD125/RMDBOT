const axios = require('axios');

module.exports = {
    // Commandes Anime
    anime: async (sock, from, sender, args, msg) => {
        if (!args[0]) return await sock.sendMessage(from, { text: 'Veuillez spécifier un nom d\'anime.' });
        
        const query = args.join(' ');
        try {
            const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`);
            const anime = response.data.data[0];
            
            if (!anime) return await sock.sendMessage(from, { text: 'Aucun anime trouvé.' });
            
            const caption = `
*${anime.title}*
📺 Épisodes: ${anime.episodes}
⭐ Score: ${anime.score}
📊 Statut: ${anime.status}
📖 Synopsis: ${anime.synopsis.substring(0, 200)}...
            `;
            
            await sock.sendMessage(from, { 
                image: { url: anime.images.jpg.image_url },
                caption: caption
            });
        } catch (error) {
            await sock.sendMessage(from, { text: 'Erreur lors de la recherche d\'anime.' });
        }
    },
    
    manga: async (sock, from, sender, args, msg) => {
        // Commande pour rechercher des mangas
    },
    
    // ... Ajoutez d'autres commandes anime
};
