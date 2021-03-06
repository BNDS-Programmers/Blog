const func_dict = {
    async page(model, paginate, page, where = {}, order = [["createdAt", "DESC"]]) {
        await model.findAll().then(async ret => {
            let total = ret.length;
            let last_page = Math.ceil(total / paginate);
            if (page < 1) page = 1;
            else if (page > last_page) page = last_page;
        });
        return (model.findAll({ offset: (page - 1) * paginate, limit: paginate, order: order , where: where}));
    }, 
    async page_count(model, paginate, where={}) {
        let total = 0;
        await model.findAll({where: where}).then(ret => {
            total = ret.length;
        });
        return Math.ceil(total / paginate);
    }
}

module.exports = func_dict