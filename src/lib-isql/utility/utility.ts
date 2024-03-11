
import { AND, condition } from "../syntax/syntax"
import { Condition, ConditionSet, Expression, Field, Refference, Aggregate, DomainAggregate } from "../syntax/classes"
import { aggregateWithTotals } from "../aggregates"
import { typeOf } from "./functions"
import { handle_OrderBy, handle_Where } from "../handlers"
import { isValidQueryExpression } from "../interpreter/definitions"

export const dataKey = "sysRowData"
export const errValue = "#Error"


export const evaluate = ({expression,row,select,queryData})=>{
  
  // Field
  if(expression instanceof Field){

    const {field} = expression
    const result = row[field]

    return result
  }
  
  // Expression
  if(expression instanceof Expression){

    const {fn,args} = expression
    
    let evaluatedArgs
    let aggregatesCount = 0
      
    if(typeOf(args) === "array") {

      // Handle Array Param
      evaluatedArgs = []

      // Evaluate All Arguments
      evaluatedArgs = args.map((arg) => { 
      if( isValidQueryExpression(arg) ) {
          return evaluate({expression:arg,row,select,queryData})
        } else {
          return arg
        }
      })
      
      // Count Arguments That Could not Be Evaluated
      aggregatesCount = evaluatedArgs.filter((arg)=> {
        return (
             arg instanceof Aggregate 
          || arg instanceof Expression
        )
      }).length

    } else if(typeOf(args) === "object" && !isValidQueryExpression(args)){

      // Handle Object Param
      evaluatedArgs = {}

      // Evaluate All Arguments
      Object.keys(args).forEach((arg)=>{
        let result
        if( isValidQueryExpression(args[arg]) ) {
          result = evaluate({expression:args[arg],row,select,queryData})
        } else {
          result = args[arg]
        }

        evaluatedArgs = {
          ...evaluatedArgs,
          [arg]:result
        }
      })

      // Count Arguments That Could not Be Evaluated
      aggregatesCount = Object.keys(evaluatedArgs).filter((arg) => { 
        const argument=evaluatedArgs[arg]
        return (
             argument instanceof Aggregate 
          || argument instanceof Expression
        )}
      ).length

    } else {

      // Handle Single Arguments
      if(isValidQueryExpression(args)){
        evaluatedArgs = evaluate({expression:args,row,select,queryData})
      } else {
        evaluatedArgs = args
      }

      if(evaluatedArgs instanceof Aggregate){
        aggregatesCount=1
      }

    }

    if(aggregatesCount > 0){
      // If there are arguments that could not be evaluated
      // Return a new expression with what was evaluated soo far
      return new Expression( fn, evaluatedArgs )
    } else {
      // Return Computed Result
      try{
        return fn(evaluatedArgs)
      } catch(err){
        console.error(err)
        return errValue //If a function used in query and it would error, return the #Error value instead
                        //The user must be able to troubleshoot it 
      } 
        
      
    }

  }
    
  // References
  if(expression instanceof Refference){

    const {ref} = expression

    if( Object.keys(row).includes(ref) === true ) {
      // If we are past the evaluation phase, the value is stored in the evaluated row
      return row[ref]
    } else {
      // If we are in the evaluation phase, copy the expression it points to and evaluate that
      const refferedTo = select.filter((expression)=>expression.as === ref)[0]
      return evaluate({expression:refferedTo, row, select, queryData})
    }

  }

  // Aggregates 
  if(expression instanceof Aggregate){

    const {fn_aggregate,args} = expression
    
    // Evaluate Aggregate Arguments then yield the updated function to computed in the Groupping Phase
    return new Aggregate(
      fn_aggregate,
      evaluate({expression:args, row, select, queryData}),
    )

  }

  // DomainAggregate
  if (expression instanceof DomainAggregate){

    const {domain,fn} = expression
    const {partitionBy,orderBy} = domain
    const exp = domain.expression


    let newdomain 
    newdomain = getDomain(queryData,domain,select)
    newdomain = sortDomain(newdomain,orderBy)
    newdomain = filterDomain(newdomain,partitionBy,row)

    // Evaluate Domain
    if(aggregateWithTotals.includes(fn.name)){
  
      const name = exp.ref || exp.as || exp.field

      // For Operations: DCount DSum DAverage DMin DMax DList DListAll
      return fn(newdomain.map((item)=>item[name]))

    } else if(!aggregateWithTotals.includes(fn.name)) {
      // For Operations: DRowNum DRank 
      return fn({
        uid: row.sysUniqueIDValue,
        domain: newdomain,
        exp
      })
    }

  }
    
  // Whatever that is, will not be handled
  return expression 
}


// Extract All Necesary Data for Domain Evaluation
const getDomain = (queryData,domain,select) => {

  if (JSON.stringify(domain) === JSON.stringify({})){
    return queryData
  }

  const {partitionBy,orderBy} = domain
  const exp2 = domain.expression

  return queryData.map((row) => {

    const result = {}
    result["sysUniqueIDValue"] = row["sysUniqueIDValue"]
    
    // Partion By
    if(partitionBy && partitionBy.length > 0){
      partitionBy.forEach((expression) => {
        const fieldName = expression.ref || expression.as || expression.field
        result[fieldName] = evaluate({expression, row, select, queryData})
      })
    }

    // Order By
    if(orderBy && orderBy.length > 0){
      orderBy.forEach(({expression})=>{
        const fieldName = expression.ref || expression.as || expression.field
        result[fieldName] = evaluate({expression, row, select, queryData})
      })
    }
    
    // Domain Expression
    if(exp2){
      const fieldName = exp2.ref || exp2.as || exp2.field
      result[fieldName] = evaluate({expression: exp2,row,select,queryData})
    }

    return result
      
  })

}

const sortDomain = (domain,orderBy) => {

  let newdomain = domain
  
  if(orderBy && orderBy.length > 0){
    newdomain = handle_OrderBy(domain,orderBy)

    // Since its sorted, we dont need this value in output
    newdomain.forEach((row) => delete row.sysSortValue )
  }

  return newdomain
}
 
 
const filterDomain = (domain,partitionBy,row) => {
  
  const filtered = []
  if(partitionBy && partitionBy.length > 0){

    // Generate A Conditon
    partitionBy.forEach((expression)=>{
      filtered.push(
        AND, condition(expression,"==",evaluate({expression,row})) 
      )
    })

    // Evaluate All Conditions
    return handle_Where(domain,filtered)

  }

  return domain
  
}
  
  


export const evaluateGroup = (group) => {

  // We only need to look at first member to tell what we need to do
  const groupMember =   group[0]

  if(groupMember instanceof Expression){

    const {args,fn} = groupMember

    let evaluatedGroupedArgs

    if(typeOf(args) === "array"){

      // Compute using the values from all members
      evaluatedGroupedArgs = []

      for(let i = 0; i < args.length; i++){
        evaluatedGroupedArgs.push( 
          evaluateGroup(
            group.map((member) => member.args[i])
          )
        )
      }
      return fn(evaluatedGroupedArgs)

    } else if(typeOf(args) === "object" && !isValidQueryExpression(args)){

      // Compute using the values from all members
      evaluatedGroupedArgs = {}
      Object.keys(args).forEach((key)=>{
        evaluatedGroupedArgs = {
          ...evaluatedGroupedArgs,
          [key]: evaluateGroup(
            group.map((member)=>member.args[key])
          )
        }
      })

      return fn(evaluatedGroupedArgs)

    } else {
      return fn(evaluateGroup(group.map((member)=>member.args)))
    }

  } else if (groupMember instanceof Aggregate) {

    // Compute using the values from all members
    const {fn_aggregate} = groupMember
    const computed_args = group.map((member)=>member.args)

    return fn_aggregate(computed_args)

  } else {

    return groupMember
  }

}



export const groupData = (data, groupBy) => {

  if(!groupBy || groupBy.length === 0) { return data }
  
  const uniqueGroups = []

  data.forEach((row)=>{

    let newgroup={}
    groupBy.forEach((group) => {
      const column = group.ref || group.as || group.field
      newgroup = {
        ...newgroup,
        [column]:row[column]
      }
    })

    if(!uniqueGroups.filter((group_item) => JSON.stringify(group_item) === JSON.stringify(newgroup)).length){
      uniqueGroups.push(newgroup)
    }

  })

  return uniqueGroups

}



export const operators = ["!=","!==","==","===","<",">","<=",">=","in","not-in"]

export const compare = (value1,operator,value2)=>{

  const arrayError ="Invalid Array!\n\nThe 'in' operator requires 'term2 to be of array type\n"

  switch(operator){
    case "!=":      return  value1 !=  value2;
    case "!==":     return  value1 !== value2;
    case "==":      return  value1 ==  value2;
    case "===":     return  value1 === value2;
    case "<":       return  value1 <   value2;
    case ">":       return  value1 >   value2;
    case "<=":      return  value1 <=  value2;
    case ">=":      return  value1 >=  value2;
    case "in":      if( typeOf(value2) === "array" ) { return  value2.includes(value1) } else { throw new Error(arrayError) }
    case "not-in":  if( typeOf(value2) === "array" ) { return !value2.includes(value1) } else { throw new Error(arrayError) } 
    
    default: 
      return false
  }

}

export const evaluateCondtion = (tokens,row,select) => {


    if(tokens instanceof ConditionSet){

      const {conditions,expect} = tokens

      if(conditions.length === 0) { return 1 } // Empty sets must not filter

      const newTokens = conditions.map((token)=>{
        if(token instanceof Condition || token instanceof ConditionSet){
          return evaluateCondtion(token,row,select)
        } else {
          return token
        }
      })

      // Parenthesis Rule Applied Here
      return evaluateBooleanExpression(newTokens) === expect ? 1 : 0 //NOT Rule on this line
      
    } else if(tokens instanceof Condition){
      const {term1,operator,term2,expect} = tokens

      return (
        
        compare( 
          evaluate({expression:term1, row, select}), 
          operator,
          evaluate({expression:term2, row, select})
        ) === expect ? 1 : 0   //NOT Rule on this line
      )
    } 

}

export const evaluateBooleanExpression = (tokens) => {
  
  // Cleanup Redundant leading/trailing TOKENS to avoid infinite loops from appying rules
  const newTokens=tokens
  if(["AND","OR"].includes(newTokens[0])){
    newTokens.splice(0,1)
  }

  const idx=newTokens.length-1
  if(["AND","OR"].includes(newTokens[idx])){
    newTokens.splice(idx,1)
  }

  let boolRule = newTokens.join(" ")

  // Apply AND rule Recursively
  while( boolRule.indexOf("AND") !== -1 ){
    boolRule=boolRule.replace("0 AND 1","0")
    boolRule=boolRule.replace("1 AND 0","0")
    boolRule=boolRule.replace("0 AND 0","0")
    boolRule=boolRule.replace("1 AND 1","1")
  }

  // Apply OR rule Recursively
  while( boolRule.indexOf("OR") !== -1 ){
    boolRule=boolRule.replace("0 OR 0","0")
    boolRule=boolRule.replace("0 OR 1","1")
    boolRule=boolRule.replace("1 OR 0","1")
    boolRule=boolRule.replace("1 OR 1","1")
  }

  return boolRule === "1" ? true : false

}

export const getSchema = (arr) => {

  const schema = []

  arr.forEach((row) => {
    Object.keys(row).forEach((field) => {
      if(!schema.includes(field)){
        schema.push(field)
      }
    })
  })

  return schema

}

export const uid = () => {
  return crypto.randomUUID()
}

