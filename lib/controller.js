// @flow Created by 陈其丰 on 2017/6/23.

const config = require('../config');
const Router = require('koa-router');
const controllerList = [];//所有controller容器
class Controller {
    constructor(filename,urlMapping = '/'){
        this.filename = filename;
        this.requestMappingValue = urlMapping;
        return this;
    }
    /**
     * 设置基准url值
     * @param {string} value 设置基准url值
     * @returns {Controller} 当前controller实例
     */
    requestMapping(value) {
        this.requestMappingValue = value;
        return this;
    }

    _request(type = 'get', url,callback) {
        this.requestMappingValue === '/' && (url = url.substr(1, url.length));
        this.router[type](`${url}`, async function (ctx, next) {
            await callback(ctx,ctx.params,next);
        });
    }

    get(...params) {
        params.unshift('get');
        this._request.apply(this, params);
        return this;
    }

    post(...params) {
        params.unshift('post');
        this._request.apply(this, params);
        return this;
    }
    all(...params) {
        this.get.apply(this, params);
        this.post.apply(this, params);
        return this;
    }
}
module.exports = {
    controllerList(){
        return controllerList;
    },
    factory(filename, urlMapping = '/'){
        let ins = new Controller(filename, urlMapping);
        ins.router = new Router();
        controllerList.push(ins);
        return ins;
    }
};