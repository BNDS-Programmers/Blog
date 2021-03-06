const UserAgentSnap = {
    response(req, current='', title='', subtitle='') {
        let dict_render = {};
        dict_render.csrf = req.csrf;
        dict_render.current = current;
        dict_render.title = title === ''? global.config.title: title;
        dict_render.subtitle = subtitle === ''? global.config.subtitle: subtitle;
        dict_render.current_location = req.request.url;
        return dict_render;
    }, 
    paginate(dict_render, current, last, paginate, href, param=[]) {
        return Object.assign({pagination: {current: current, last_page: last, item_each: paginate, href: href, param: param}}, dict_render);
    }
}

module.exports = UserAgentSnap;