# Redis ile Pub/Sub Uygulaması - Worker

Bu NodeJS uygulaması ile Redis kullanılarak Pub/Sub mimarisi kurgulanmıştır. Detaylı anlatımına [blog](https://kerimkaan.com/redis-ile-pub-sub-uygulamasi-nasil-yapilir/) yazımdan ulaşabilirsiniz.

Akış basitçe şöyledir:

Kullanıcı -> Ana Uygulama (POST isteği) -> Redis (Publish) -> Redis-PubSub-Worker (Subscribe) -> Redis (Set) -> Ana Uygulama Redis (GET isteği) -> Ana Uygulama (Response)