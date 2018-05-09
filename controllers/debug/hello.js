var fn_hello = async (ctx, next) => {
    var name = ctx.params.name;
    var type = typeof name;
    ctx.response.body = `<h1>Hello, ${name}! type: ${type}</h1>`;
};

module.exports = {
    'GET /hello/:name': fn_hello
};