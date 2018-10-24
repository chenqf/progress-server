// @flow Created by 陈其丰 on 2018/9/28.

function conversionKey(str) {
    return str.replace(/[A-Z]/g,(s)=>'_' + s.toLowerCase());
}


class Sql{
    constructor(table){
        this.table = table;
        this.randomFlg = false;
        this.randomCount = 0;
        this.startNum = undefined;
        this.pageCount = undefined;
        this.whereData = {};
        this.data = {};
        this.orderData = [];
    }
    random(count){
        this.randomFlg = true;
        this.randomCount = count;
        return this;
    }
    //等于
    whereEqual(data){
        this.whereData.equal = Object.assign(this.whereData.equal || {},data);
        return this;
    }
    //不等于
    whereNotEqual(data){
        this.whereData.notEqual = Object.assign(this.whereData.notEqual || {},data);
        return this;
    }
    //大于
    whereGt(data){
        this.whereData.gt = Object.assign(this.whereData.gt || {},data);
        return this;
    }
    //大于等于
    whereGtEqual(data){
        this.whereData.gtEqual = Object.assign(this.whereData.gtEqual || {},data);
        return this;
    }
    //小于
    whereLt(data){
        this.whereData.lt = Object.assign(this.whereData.lt || {},data);
        return this;
    }
    //小于等于
    whereLtEqual(data){
        this.whereData.ltEqual = Object.assign(this.whereData.ltEqual || {},data);
        return this;
    }
    toWhere(){
        let {equal,notEqual,gt,lt,gtEqual,ltEqual} = this.whereData;
        let list = [];
        if(equal){
            for(let key in equal){
                list.push(`${conversionKey(key)} = "${equal[key]}"`);
            }
        }
        if(notEqual){
            for(let key in notEqual){
                list.push(`${conversionKey(key)} <> "${notEqual[key]}"`);
            }
        }
        if(gt){
            for(let key in gt){
                list.push(`${conversionKey(key)} > "${gt[key]}"`);
            }
        }
        if(gtEqual){
            for(let key in gtEqual){
                list.push(`${conversionKey(key)} >= "${gtEqual[key]}"`);
            }
        }
        if(lt){
            for(let key in lt){
                list.push(`${conversionKey(key)} < "${lt[key]}"`);
            }
        }
        if(ltEqual){
            for(let key in ltEqual){
                list.push(`${conversionKey(key)} <= "${ltEqual[key]}"`);
            }
        }
        if(list.length){
            return `WHERE ${list.join(' AND ')}`;
        }else{
            return '';
        }
    }
    orderBy(column,by = 'ASC'){
        this.orderData = [...(this.orderData || []),{column,by}];
        return this;
    }
    toOrder(){
        if(this.randomFlg && this.randomCount){
            return 'ORDER BY RAND()'
        }
        let list = [];
        for(let i = 0; i<this.orderData.length; i++){
            let {column,by} = this.orderData[i];
            list.push(`${column} ${by}`)
        }
        return list.length ? 'ORDER BY ' + list.join(' , ') : '';
    }
    limit(startNum,pageCount){
        this.startNum = startNum;
        this.pageCount = pageCount;
        return this;
    }
    toLimit(){
        if(this.randomFlg && this.randomCount){
            return `LIMIT ${this.randomCount}`
        }
        if(this.startNum !== undefined && this.pageCount !== undefined){
            return `LIMIT ${this.startNum} , ${this.pageCount}`
        }
        return '';
    }
    set(data){
        this.data = Object.assign(this.data || {},data);
        return this;
    }
    toInsert(){
        let result = {};
        for(let key in this.data){
            result[conversionKey(key)] = this.data[key];
        }
        return result;
    }
    toUpdate(){
        let list = [];
        for(let key in this.data){
            list.push(`\`${conversionKey(key)}\` = "${this.data[key]}"`);
        }
        return list.join(' , ');
    }
}


module.exports = Sql;