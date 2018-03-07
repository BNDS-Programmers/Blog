# Blog - Generic Blog System
 A blog system developed by using Nodejs
 Major modules: Koa2, Sequelize(ORM), EJS(front end engine), Semantic UI
 **Preview: [My New Blog](http://ad1024.tech)**
 Due to the Internet restriction in China, the page sometimes will be redirected to a goverment warning page; you can just refresh from some times. 

 # Requirement
 - Nodejs v9.0+
 - MySQL 5.3+

 # Features
 - Add, Delete, Update articles
 - Archive articles
 - project page
 - Introduction page

 # Installation
 First install all the dependencies
 ```
 $ npm install
 ```
 And then [config](/#Configuration) your blog.
 Finally, run it on your server. You can choose to use `pm2`
 ```
 pm2 start app.js
 ```

 # Configuration
 First copy a `config.js` from `config-example.js`, and then modify it as your will.
 - `title`: The title of the website.
 - `subtitle`: The subtitle of the website.
 - `author`: Your name, 
 - `admins`: all admins will be created at the first time of the execution. Keys are username and values are password.
 - `article_per_page`: You know
 - `favicon`: **(Currently this item is not useful)** The path to the favicon
 - `article_cover_count`: The number of front covers(starts with "material-" and ends with ".png", you can store them in /static/images)
 - `db`: database connection configuration
    - `host`: the host of the database
    - `port`: the port of the database
    - `username`: the root user that can access the database
    - `password`: the password of the user
    - `dialect`: type of databases(you can check [Sequelize](http://docs.sequelizejs.com/) for supported database list)
- `manage`: the configuration of the admin page
    - `article_pageinate`: the maximum count of articles listed in the manage list.
    - `user_pageinate`: **(Currently this item is not useful)**
- `about`: the data for about page
    - `avatar_url`: the url of the avatar
    - `name`: your nickname
    - `introduction`: your full self-intro
    - `description`: your short description
    - `skills`: self-rating skills
- `session_sec`: the session secrete key
- `url`: the url of the blog
- `port`: which port does the blog running on
- `mode`: switch of logging

