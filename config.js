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
    manage: {
        article_pageinate: 10, 
        user_pageinate: 10, 
    },
    session_sec: "530ca32adfda2828771cb01a22ae0ab2", 
    passwd_salt: "blog_xxxx", 
    host: "localhost", 
    port: 4000, 
    mode: "dev"
}

module.exports = config