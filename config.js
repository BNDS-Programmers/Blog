config = {
    title: "Blog", 
    description: "My blog", 
    author: "Your Name", 
    admins: {
        root: "root"
    }, 
    favicon: null, 
    db: {
        host: "localhost",
        port: 3306,  
        username: "root", 
        password: "root", 
        database: "blog", 
        dialect: "mysql"
    }, 
    passwd_salt: "blog_xxxx", 
    host: "localhost", 
    port: 4000, 
    mode: "dev"
}

module.exports = config