docker exec mongodb sh -c '
mongodump -d ics -o /data/backup/backup_`date +%Y%m%d_%H%M`'
