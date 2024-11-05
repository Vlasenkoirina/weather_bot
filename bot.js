import { Telegraf } from 'telegraf';
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

const API_KEY = 'b766f5267e6c368577915f4082d19f69'; 
const TELEGRAM_TOKEN = '7757763639:AAERrMKrqaKmHcOIKHTKgWDrgv7vI870ktw';

const bot = new Telegraf(TELEGRAM_TOKEN);
const userRequests = {};

bot.start((ctx) => {
    ctx.reply('Привет! Напишите /weather, чтобы узнать текущую погоду.');
});

bot.command('weather', (ctx) => {
    ctx.reply('Введите название города:');
    userRequests[ctx.from.id] = { type: 'weather' };
});

bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const userRequest = userRequests[userId];

    if (!userRequest) return;

    const city = ctx.message.text.trim(); 
    console.log(`Получен город: ${city}`); 

    try {
        let response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`);

        if (!response.ok) {
            return ctx.reply('Не удалось получить данные. Проверьте название города и попробуйте снова.');
        }

        const data = await response.json();
        console.log('Ответ API:', data); 
        console.log('Код ответа API:', data.cod); // Проверка кода ответа

        if (data.cod !== 200) {
            return ctx.reply('Город не найден! Попробуйте другой.');
        }

        const weatherInfo = `
            Погода в *${data.name}*:
            Температура: *${data.main.temp}°C*
            Описание: *${data.weather[0].description}*
            Влажность: *${data.main.humidity}%*
            Скорость ветра: *${data.wind.speed} м/с*
        `;
        ctx.replyWithMarkdown(weatherInfo);
        delete userRequests[userId]; 
    } catch (error) {
        console.error('Ошибка:', error);
        ctx.reply('Произошла ошибка при получении данных, попробуйте позже.');
    }
});

bot.launch();
console.log('Бот запущен...');


