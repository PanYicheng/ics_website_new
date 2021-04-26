cd `dirname $0`

openssl genrsa -out server-key.pem 2048
openssl req -new -sha256 -key server-key.pem -out server-csr.pem #-config openssl.cnf
openssl x509 -req -days 3650 -in server-csr.pem -signkey server-key.pem -out server-cert.pem #-extensions v3_req -extfile openssl.cnf

#openssl genrsa -out client-key.pem 2048
#openssl req -new -sha256 -key client-key.pem -out client-csr.pem    #$//在CN出填写客户端主机名
#openssl x509 -req -CA server-cert.pem -CAkey server-key.pem -CAcreateserial -in client-csr.pem -out client-cert.pem
