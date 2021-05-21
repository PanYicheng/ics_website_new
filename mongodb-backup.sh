DIR_LOCAL="/Users/hzw/demo/backup/"
DIR_REMOTE="/Users/hzw/demo/remote/"

dump() {
    BACKUP_NAME='backup_'`date +%Y%m%d_%H%M`
    docker exec mongodb sh -c "mongodump -d ics -o /data/backup/${BACKUP_NAME}"
    scp -r ${DIR_LOCAL}${BACKUP_NAME} ${DIR_REMOTE}
}


restore() {
    # 按文件名排序，找到最新的备份
    BACKUP_NAME=`ls -r ${DIR_LOCAL} | head -1`
    if [ -z $BACKUP_NAME ]
    then
        echo "no local backup found. try remote backup..."
        # 远程备份的文件名需要手动输入
        BACKUP_NAME="something"
        scp -r ${DIR_REMOTE}${BACKUP_NAME} ${DIR_LOCAL}
    fi

    docker exec mongodb sh -c "mongorestore /data/backup/${BACKUP_NAME}"
}

case $1 in
    dump)
        dump;;
    restore)
        restore;;
esac
