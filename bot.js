require('dotenv').config();
const {Telegraf} = require('telegraf');
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);



if (!TELEGRAM_BOT_TOKEN) {
    console.error('ERROR: telegram bot toke not set in you .env');
    process.exit(1);
}



const countryData ={
     "ethiopia": {
        name: "Ethiopia",
        capital: "Addis Ababa",
        population: "120 million (approx.)",
        area: "1,104,300 sq km",
        currency: "Ethiopian Birr (ETB)",
        language: "Amharic, Oromo, Tigrinya, Somali, Sidama, Wolaytta, Gurage, Afar, Hadiya, Gamo, Kafa, Gedeo, Kambaata, Kistane, Silt'e, Dawro, Bench, Shekkacho",
        description: "Ethiopia is a landlocked country in the Horn of Africa. It is the second-most populous country in Africa and has a rich history, being one of the oldest countries in the world. It is known for its ancient culture, the origins of coffee, and its unique calendar."
    },
    "japan": {
        name: "Japan",
        capital: "Tokyo",
        population: "125.7 million (approx.)",
        area: "377,975 sq km",
        currency: "Japanese Yen (JPY)",
        language: "Japanese",
        description: "Japan is an island nation in East Asia. Known for its distinct culture, technological advancements, cherry blossoms, and delicious cuisine, it's a blend of ancient traditions and modern innovation."
    },
    "brazil": {
        name: "Brazil",
        capital: "Brasília",
        population: "215 million (approx.)",
        area: "8,515,767 sq km",
        currency: "Brazilian Real (BRL)",
        language: "Portuguese",
        description: "Brazil is the largest country in both South America and Latin America. It is the world's fifth-largest country by area and the seventh most populous. Famous for its vibrant carnivals, football, and the Amazon rainforest."
    },
    "india": {
        name: "India",
        capital: "New Delhi",
        population: "1.4 billion (approx.)",
        area: "3,287,590 sq km",
        currency: "Indian Rupee (INR)",
        language: "Hindi, English, and many regional languages",
        description: "India is a vast South Asian country with diverse landscapes, rich cultural heritage, and a long history. It is known for its ancient civilizations, spiritual traditions, and vibrant festivals."
    },
    "germany": {
        name: "Germany",
        capital: "Berlin",
        population: "83 million (approx.)",
        area: "357,588 sq km",
        currency: "Euro (EUR)",
        language: "German",
        description: "Germany is a Western European country with a landscape of forests, rivers, mountain ranges and North Sea beaches. It has a history spanning more than two millennia and is known for its engineering, art, and world-renowned beer."
    }
};

function escapeMarkdown(text) {
    if (typeof text !== 'string') {
        return String(text); 
    }
    // Escape specific Markdown v1 characters that might cause issues
    return text
        .replace(/\*/g, '\\*') // Escapes asterisks
        .replace(/_/g, '\\_') // Escapes underscores
        .replace(/`/g, '\\`') // Escapes backticks
        .replace(/\[/g, '\\[') // Escapes opening square brackets
        .replace(/\]/g, '\\]') // Escapes closing square brackets
        .replace(/\(/g, '\\(') // Escapes opening parentheses
        .replace(/\)/g, '\\)') // Escapes closing parentheses
        // Also replace any internal newlines with spaces to prevent breaking Markdown parsing
        .replace(/\n/g, ' '); // <-- This was crucial for your "Bench, Shekkacho" issue
}

function formatCountryInfo(data){
    if (!data || !data.name){
        return "Sorry, I couldn't find";
    }


    const escapeData = {};
    for (const key in data){
        escapeData[key] = escapeMarkdown(data[key]);
    }


    return `
*🌎 Country:* ${data.name || 'N/A'}
*🏛️ Capital:* ${data.capital || 'N/A'}
*🧑‍🤝‍🧑 Population:* ${data.population || 'N/A'}
*📏 Area:* ${data.area || 'N/A'}
*💰 Currency:* ${data.currency || 'N/A'}
*🗣️ Language(s):* ${data.language || 'N/A'}

${escapeData.description || 'No descritption available.'}`.trim();
}
bot.start((ctx) => ctx.reply('Welcome! Send me the name of a country, and I\'ll give you some information about it from my internal data.')); 


bot.help((ctx) => ctx.reply('Just type a country name (e.g., "Ethiopia" or "Japan"')); 
// bot.on('text', (ctx) => ctx.reply(`You said: ${ctx.message.text}`)); // Responds to any text message


// ... (rest of your code)

// Listener for any text message that is not a command
bot.on('text', async (ctx) => {
    console.log('Received text message:', ctx.message.text); // <-- Add this
    const userInput = ctx.message.text.trim();

    if (userInput.startsWith('/')) {
        console.log('Ignoring command:', userInput); // <-- Add this
        return;
    }

    // Normalize input for lookup (e.g., "ethiopia" for "Ethiopia")
    const countryKey = userInput.toLowerCase();
    console.log('Normalized country key:', countryKey); // <-- Add this

    // Check if the country exists in our local data
    const countryInfo = countryData[countryKey];

    if (countryInfo) {
        console.log('Country info found for:', countryKey); // <-- Add this
        const replyMessage = formatCountryInfo(countryInfo);
        await ctx.reply(replyMessage, { parse_mode: 'Markdown' });
    } else {
        console.log('No country info found for:', countryKey); // <-- Add this
        await ctx.reply(`Sorry, I don't have information for "${userInput}" in my local database. Try another country!`);
    }
});

// ... (rest of your code)
bot.launch()
 .then(() => {
    console.log('Bot is running and listening for messages...');
 })
 .catch((err) => {
    console.error('Failed to launch bot:', err);
 });


 process.once('SIGINT', () => bot.stop('SIGINT'));
 process.once('SIGTERM', () => bot.stop('SIGTERM'));
