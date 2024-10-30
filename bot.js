import { Telegraf } from 'telegraf';
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

const API_KEY = 'b766f5267e6c368577915f4082d19f69';
const TELEGRAM_TOKEN = '7757763639:AAERrMKrqaKmHcOIKHTKgWDrgv7vI870ktw';

const bot = new Telegraf(TELEGRAM_TOKEN);

bot.start((ctx) => {
    ctx.reply('Привет! Я бот для получения погоды.\n' +
              'Напишите /weather, чтобы узнать текущую погоду. После этого введите название города.');
});

bot.command('weather', (ctx) => {
    ctx.reply('Введите название города:');
    bot.on('text', async (ctx) => {
        const city = ctx.message.text;

        try {
            const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`);
            
            if (!response.ok) {
                return ctx.reply('Не удалось получить данные о погоде. Попробуйте позже.');
            }
            
            const data = await response.json();
            if (data.cod !== 200) {
                return ctx.reply('Город не найден! Попробуйте другой.');
            }

            const weatherInfo = `Погода в ${data.name}:\n` +
                                `Температура: ${data.main.temp}°C\n` +
                                `Описание: ${data.weather[0].description}\n` +
                                `Влажность: ${data.main.humidity}%\n` +
                                `Скорость ветра: ${data.wind.speed} м/с`;
            ctx.reply(weatherInfo);
        } catch (error) {
            ctx.reply('Произошла ошибка, попробуйте позже.');
        }
    });
});

bot.command('help', (ctx) => {
    ctx.reply('Команды бота:\n' +
              '/start - приветственное сообщение.\n' +
              '/weather - узнать текущую погоду.');
});

bot.launch();
console.log('Бот запущен...');
