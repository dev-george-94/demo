import { Field, Refference, Aggregate, DomainAggregate, Expression } from "../syntax/classes"
import { typeOf } from "../utility/functions"
import { dataKey } from "../utility/utility"

export const isTableLike = (obj) => {
    if( ! (typeOf(obj) === "object")                                                                     ) { return false }
    if( ! ( dataKey in obj)                                                                              ) { return false }
    if( ! (typeOf(obj[dataKey])==="array")                                                               ) { return false }
    if( ! (obj[dataKey].map((row)=> typeOf(row)).filter((value)=> value !== "object").length === 0)      ) { return false }
    return true
  }
  
export const isQueryLike = (obj) => {
    const keys = Object.keys(obj).map((key)=>key)

    if(! (keys.includes("select") || keys.includes("distinct")) ){ return false }
    if(! (keys.includes("from"))                                ){ return false }

    return true
}


export const isValidQueryExpression = (arg) => {
    if(
           arg instanceof Field 
        || arg instanceof Refference  
        || arg instanceof Aggregate 
        || arg instanceof DomainAggregate
        || arg instanceof Expression 
    ) {
        return true
    } else {
        return false
    }
}