#/bin/sh
echo 'Uploading to server ...'
rsync -arv --exclude 'node_modules' / root@ServerAddress:/addressOnTheServer
