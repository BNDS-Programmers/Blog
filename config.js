config = {
    title: "Blog", 
    subtitle: "My blog", 
    author: "Your Name", 
    article_per_page: 10, 
    admins: {
        root: "root", 
        AD1024: "!QAZXSW@#EDC"
    }, 
    favicon: null, 
    article_cover_count: 19, 
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
    about: {
        avatar_url: 'https://avatars1.githubusercontent.com/u/12641212?s=460&v=4', 
        name: 'AD1024', 
        introduction: "我系渣渣辉，说话战斗，罩衣自由，提现到手，今晚八点，贪玩蓝月，准时开车",
        description: 'A student developer in Beijing National Day School, Grade 12',  
        skills: {
            'C++': 3.5, 
            'C': 4, 
            'Python3': 5, 
            'Javascript': 4, 
            'SML': 3, 
            'Java': 4, 
            'HTML': 4, 
            'Algorithm': 4, 
            'Nodejs': 3.5, 
        },
        github: 'https://github.com/AD1024', 
        facebook: null, 
        twitter: null, 
        weibo: null, 
        email: 'ccoderad@gmail.com',
        steam: null, 
        stackoverflow: null, 
        stackexchange: null, 
    },
    projects:[{
            name: 'Blog', 
            description: 'A common blog system', 
            url: 'https://github.com/BNDS-Programmers/Blog', 
            image: '', 
            stars: 0, 
            forks: 0
        }, {
            name: 'Shiyiquan', 
            description: 'A club management platform for BNDS', 
            url: 'https://github.com/AD1024/ShiyiquanEvent', 
            image: '', 
            stars: 3, 
            forks: 0, 
        }, {
            name: 'BNDSOJ',
            description: 'Online Judge for BNDS Computing Contest class',
            url: 'https://github.com/AD1024/BNDSOJ',
            image: '',
            stars: 3,
            forks: 1, 
        }
    ],
    session_sec: "530ca32adfda2828771cb01a22ae0ab2", 
    url: 'http://localhost:4000', 
    passwd_salt: "blog_xxxx", 
    host: "localhost", 
    port: 4000, 
    mode: "dev"
}

module.exports = config