### Starting app

Clone the repo

```sh
cd ksolves
```

Open terminal and run

```sh
docker compose up
```

Open other terminal and run

```sh
npm run docker:dev
```

this will seed the db , install deps & start web app at localhost:3000

since i have not used any auth & instead used sessionStorage so after registering an admin open new tab and register a user after which u can move to admin tab and assign an event to multiple users and users can then accept or decline it.
