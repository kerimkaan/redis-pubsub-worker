require('dotenv').config;
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL); // .env dosyasında belirttiğimiz adrese Redis bağlantısı kurar.

async function subscriber() {
    redis.subscribe('userdata', (err, count) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`${count} adet kanal dinleniyor..`);
        }
    });

    redis.on('message', async (channel, message) => {
        const userData = JSON.parse(message);
        const dateCreated = new Date().toISOString();
        // İlk kullanılan Redis bağlantısı yalnızca subscriber için kullanılmak zorunda, o sebeple SET ve INCR için yeni bir Redis bağlantısı kurulur.
        const redisSet = new Redis(process.env.REDIS_URL);
        const id = await redisSet.get('idCounter'); // Redis içinde idCounter değerini sorgular.
        if (id && id >= 1) {
            const userDataMerge = Object.assign(userData, { ID: id, dateCreated });
            console.log(userDataMerge); // Kullanıcı verileri ekrana yazdırılır.
            redisSet.incr('idCounter'); // idCounter'i bir artırır. Burada Redis'in INCR methodu kullanılmakta, bununla iki uygulama arasında id'leri takip edebiliriz.
            const setUser = `user:${id}` // id'yi setUser'a atar. Redis'in SET methodu kullanılmakta, bu bilgileri Redis'e kaydetmek için key olarak kullanılır.
            redisSet.set(setUser, JSON.stringify(userDataMerge)); // setUser'a userDataMerge'ı string olarak atar.

        } else {
            const userDataMerge = Object.assign(userData, { ID: '0', dateCreated });
            console.log(userDataMerge); // userdata array'i ekrana yazdırılır.
            const setUser = `user:${0}` // id'yi setUser'a atar. Redis'in SET methodu kullanılmakta, bu bilgileri Redis'e kaydetmek için key olarak kullanılır.
            redisSet.set(setUser, JSON.stringify(userDataMerge)); // setUser'a userDataMerge'ı string olarak atar.
            redisSet.incr('idCounter'); // Redis'te idCounter değeri olmadığı için 1 olarak atanır.
        }
    });
}

subscriber();