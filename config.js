config = {
    title: "Blog", 
    subtitle: "My blog", 
    author: "Your Name", 
    article_per_page: 10, 
    admins: {
        root: "root"
    }, 
    favicon: null, 
    article_cover_count: 14, 
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
    url: 'http://localhost:4000', 
    passwd_salt: "blog_xxxx", 
    host: "localhost", 
    port: 4000, 
    mode: "dev"
}

module.exports = config