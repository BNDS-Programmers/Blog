const func_dict = {
    async page(model, paginate, page, order=[["createdAt", "DESC"]]) {
        await model.findAll().then(async ret => {
            let total = ret.length;
            let last_page = Math.ceil(total / paginate);
            if (page < 1) page = 1;
            else if (page > last_page) page = last_page;
        });
        return (model.findAll({ offset: (page - 1) * paginate, limit: paginate, order: order }));
    }, 
    async page_count(model, paginate) {
        let total = 0;
        await model.findAll().then(ret => {
            total = ret.length;
        });
        return Math.ceil(total / paginate);
    }
}

module.exports = func_dict