const model = require('../models/user');

const UserSnap = {
    async find_nickname_by_id(id) {
        let ret = '';
        await model.findById(id).then(ans => ret = ans.nickname);
        return ret;
    }, 
    async find_id_by_nickname(username) {
        let result = 1;
        await model.find({ where: { nickname: username } }).then(async ret => {
            result = ret.id;
        });
        return result;
    }, 
    hash_passwd(passwd) {
        const salt = global.config.passwd_salt;
        var salted = salt + passwd;
        var actual = require('crypto').createHash('md5').update(salted).digest('hex');
        return actual;
    }, 
    async verify_passwd(username, password) {
        let result = {success: false};
        await model.find({where: {nickname: username}}).then(async ret => {
            if(ret === null) {
                return {
                    success: false, 
                    code: 1, 
                }
            }
            let hashed_passwd = this.hash_passwd(password);
            if(hashed_passwd === ret.password) {
                result.success = true;
                result.code = 0;
            }else{
                result.code = 2;
            }
        });
        return result;
    }
}

module.exports = UserSnap;