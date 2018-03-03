const model = require('../models/user');

const UserSnap = {
    async find_nickname_by_id(id) {
        let ret = '';
        await model.findById(id).then(ans => ret = ans.nickname);
        return ret;
    }
}

module.exports = UserSnap;