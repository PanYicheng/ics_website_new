cd `dirname $0`

openssl genrsa -out ca-key.pem 2048
openssl req -new -sha256 -x509 -days 365 -key ca-key.pem -out ca-cert.pem

openssl genrsa -out server-key.pem 2048
openssl req -new -sha256 -key server-key.pem -out server-csr.pem -config openssl.cnf
openssl x509 -req -in server-csr.pem -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem -extensions v3_req -extfile openssl.cnf

