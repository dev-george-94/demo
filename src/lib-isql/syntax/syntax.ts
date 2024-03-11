import { agg_list, agg_listall, agg_count, agg_sum, agg_average, agg_min, agg_max, d_RowNum, d_Rank } from "../aggregates"
import { Aggregate, Condition, ConditionSet, DomainAggregate, Expression, Field, Refference, Sort } from "./classes"
import { isQueryLike, isTableLike } from "../interpreter/definitions"
import { typeOf } from "../utility/functions"
import { dataKey, getSchema } from "../utility/utility"



// Fields
export const field = (fieldName,as?) => {
    return new Field(fieldName,as)
}

export const fields = (obj) => {

    if( obj instanceof Array ){ 
        return getSchema(obj).map((column)=>field(column))  
    }

    if( isTableLike(obj) ){ 
        return getSchema(obj[dataKey]).map((column)=>field(column)) 
    } 

    if( isQueryLike(obj) ){ 

        const select = obj.select || obj.distinct
        const columns = select.map((column) => column.as || column.field )

        return columns.map((column)=>field(column))

    }

}


// Expressions
export const exp = (args?,fn,as?) => new Expression(fn,args,as)


// Sort
export const sortDirectionOptions = ["asc","desc"]
export const nullSortOptions = ["nullFirst","nullLast"]


export const sort = (expression,sortDirection?,nullSort?) =>{ 

    return new Sort(
        expression,
        typeOf(sortDirection)==="undefined" ? sortDirectionOptions[0] : sortDirection,
        typeOf(nullSort)==="undefined" ? nullSortOptions[1] : nullSort
    )
}


// Filter
export const AND = "AND" 
export const OR = "OR"
export const logicalOperators = [AND,OR]

export function condition ( term1,operator,term2,expect? ) {
    if(typeof expect === "undefined"){ expect=true }
    return new Condition(term1,operator,term2,expect)
} 


export const set = (tokens,expect?) => {
    if(typeof expect === "undefined"){ expect=true }
    return new ConditionSet(tokens,expect)
}


// Reference
export const ref = ( expression ) => new Refference(expression)

// Aggregates
export function List    ( expression, as? ) { return new Aggregate( agg_list,    expression, as ) }
export function ListAll ( expression, as? ) { return new Aggregate( agg_listall, expression, as ) }
export function Count   ( expression, as? ) { return new Aggregate( agg_count,   expression, as ) }
export function Sum     ( expression, as? ) { return new Aggregate( agg_sum,     expression, as ) }
export function Average ( expression, as? ) { return new Aggregate( agg_average, expression, as ) }
export function Min     ( expression, as? ) { return new Aggregate( agg_min,     expression, as ) }
export function Max     ( expression, as? ) { return new Aggregate( agg_max,     expression, as ) }

// Domain Aggregates
export const DList =     (domain, as?) => { return new DomainAggregate( { domain, fn:agg_list,    as } )}
export const DListAll =  (domain, as?) => { return new DomainAggregate( { domain, fn:agg_listall, as } )}
export const DCount =    (domain, as?) => { return new DomainAggregate( { domain, fn:agg_count,   as } )}
export const DSum =      (domain, as?) => { return new DomainAggregate( { domain, fn:agg_sum,     as } )}
export const DAverage =  (domain, as?) => { return new DomainAggregate( { domain, fn:agg_average, as } )}
export const DMin =      (domain, as?) => { return new DomainAggregate( { domain, fn:agg_min,     as } )}
export const DMax =      (domain, as?) => { return new DomainAggregate( { domain, fn:agg_max,     as } )}
export const DRank =     (domain, as?) => { return new DomainAggregate( { domain, fn:d_Rank,      as } )}
export const DRowNum =   (domain, as?) => { return new DomainAggregate( { domain, fn:d_RowNum,    as } )}




