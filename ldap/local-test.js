const ldapClient = require("./ldap-client")

ldapClient.validateUser("test", "test")
.then(success => {
    console.log(`validate status: ${success}`)
})
.catch(err => console.log(err))

ldapClient.findUser("test")
.then(res => {
    console.log(res)
})
.catch(err => console.log(err))