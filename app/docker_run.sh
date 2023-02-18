docker build -t MapApp-container .
docker volume create markers
docker run -dp 3001:3001 -v markers:/etc/todos -v $PATH_TO_TILES:/app/src/static/tiles --name MapApp-running MapApp-container