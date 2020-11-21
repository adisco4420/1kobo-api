import { Request } from 'express'

class QueryUtil {
    private strToObj(string: string) {
        return JSON.parse(string);
    }
    private objToStr(object) {
        return JSON.stringify(object)
    }
    buildQuery(query): {sort: any, limit: number, skip: number, filter: any} {
        const { sort, filter, limit, page, filterRange, ...rest } = query;
        let range = filterRange ?  this.strToObj(filterRange) : null;
        const filterx = filter ? this.strToObj(filter) : ({} as any);
        const { key, value } = sort ? this.strToObj(sort) : ({} as any);
        const sortx = {[key || 'date']: value || '-1'}
        const skipx = page ? ((Number(page) - 1) * limit) : 0; 
        const limitx = Number(limit) || 20;
        if(range) {
            const {field, ranges:{from, to} } = range;
            range = {[field]: {$gte: from, $lt: to }}
        }
        const filterResult = rest || range || filterx || {};
        return { sort: sortx, limit: limitx, filter: filterResult, skip: skipx}
    }
}
export default new QueryUtil;