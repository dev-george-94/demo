import { runQuery } from "./index"
import { Condition, ConditionSet } from "./syntax/classes"
import { isQueryLike, isTableLike, isValidQueryExpression } from "./interpreter/definitions"
import { autoNameProp, zeroFill } from "./utility/functions"
import { 
  evaluate, 
  evaluateCondtion, evaluateBooleanExpression,  
  groupData, evaluateGroup, uid, dataKey,
} from "./utility/utility"


// For Single Arrays, Tables, Queries only. This code will be updated later with JOINS
export const handle_From = (from) => {

  let data=undefined

  from.forEach((token)=>{

    if( !data && token instanceof Array ) { data = token;           }
    if( !data && isTableLike(token) )     { data = token[dataKey];  } 
    if( !data && isQueryLike(token) )     { data = runQuery(token); }

  })

  // Add sysUniqueIDValue. We must assume that the data has duplicates or no id to begin with  
  // We need to be able to uniquely identify it in query operations
  data = data.map((row)=>{
    return { sysUniqueIDValue:uid(), ...row }  
  })

  return data
} 


export const handle_Select = (queryData,select) => {


  return queryData.map((row)=>{
    const evaluatedRow = {}

      select.forEach((expression)=>{ 

        // Field AutoName
        const { field, as } = expression
        let fieldname = as || field

        if(fieldname in evaluatedRow){ 
          fieldname = autoNameProp({ 
            obj: evaluatedRow, 
            propName: fieldname
          }) 
        } 
        
        // Evaluate All QueryExpressions for each row
        if( isValidQueryExpression(expression) ){
          evaluatedRow[fieldname] = evaluate({ expression, row, select, queryData })
        }  else {
          evaluatedRow[fieldname] = expression
        }

      })

    return(evaluatedRow)
  })
}


export const handle_Distinct = (data,distinct) => {
  if( !(distinct && distinct.length > 0) ){
    return data
  }
  return groupData(data,distinct)
}


export const handle_Where = (data,where,select?)=>{

  if(!(where && where.length > 0)){
    return data 
  }

  return data.filter((row)=>{

    // Evaluate Where 
    const evaluatedCondtions = where.map((token)=>{
      if( token instanceof Condition || token instanceof ConditionSet ){
        // Evaluate Each Condition / ConditionSet To 1's and 0's
        return evaluateCondtion(token,row,select)
      } else {
        // Expected Tokens: AND ; OR
        return token
      } 
    })

    // Evaluate Boolean
    return evaluateBooleanExpression(evaluatedCondtions)

  })

}


export const handle_GroupBy = (data,groupBy) => {

  if(!(groupBy && groupBy.length > 0)){
    return data 
  }

  let result = []

    const groups = groupData(data,groupBy)

    groups.forEach((group)=>{

      // Retreive data for group
      let grouped = [...data]
      Object.keys(group).forEach((key)=>{
        grouped = grouped.filter((subgroup)=>
          subgroup[key] === group[key]
        )
      })

      // Compute aggregates and expressions for group
      let evaluatedGroup = {}
      Object.keys(grouped[0]).forEach((column)=>{
        evaluatedGroup = {
          ...evaluatedGroup,
          [column]: evaluateGroup( grouped.map((member) => member[column]) )
        }
      })

      result.push(evaluatedGroup)

    })

  return result

}


export const handle_Having = (queryData,having,select) => {
  return handle_Where(queryData,having,select)
}


export const handle_OrderBy=(data,orderBy)=>{

  if( !(orderBy && orderBy.length > 0) ){
    return data
  }

  const sortValues = [] 

  // Determine Unique Values to be sorted
  orderBy.forEach((sort)=>{

    // Get Values
    const uniqueSortLevelValues=[]

    const { expression, sortDirection, nullSort } = sort

    data.forEach((row)=>{
      const as = expression.ref || expression.as || expression.field 
      const value = row[as]

      if(!uniqueSortLevelValues.includes(value) && typeof value !== "undefined"){
        uniqueSortLevelValues.push(value)
      }
    })

    // Sort Values
    if(sortDirection === "asc"){
      uniqueSortLevelValues.sort((a,b) => { 
        return (
          a < b ? -1 : 
            a > b ?  1 : 0 
        )
      })

    } else if( sortDirection === "desc") {
      uniqueSortLevelValues.sort((a,b) => { 
        return (
          b < a ? -1 : 
            b > a ?  1 : 0 
        )
      })
    }
   
    // Add Null Sort
    if(nullSort === "nullFirst"){
      uniqueSortLevelValues.unshift(undefined)
    } else if (nullSort === "nullLast") {
      uniqueSortLevelValues.push(undefined)
    }

    sortValues.push(uniqueSortLevelValues)
  })

  // Assign a sort value to each row, based on the Unique Values
  data = data.map((row)=>{
    let sortValue=""
      orderBy.forEach((sort,i)=>{

        const as = 
          sort.expression.ref || 
          sort.expression.as || 
          sort.expression.field 

        const value = row[as]

        const idx = sortValues[i].indexOf(value)
        const maxIdx = sortValues[i].length -1

        sortValue += zeroFill( 
          idx,
          maxIdx
        )
      })

    return { ...row, sysSortValue:Number.parseInt(sortValue) }
  })


  // Sort All Based on sysSortValue
  data.sort((a,b)=>{
    return (
      a.sysSortValue < b.sysSortValue ? -1 : 
        a.sysSortValue > b.sysSortValue ?  1 : 0 
    )
  })

  return data

}


export const handle_Limit = (data,limit) => {

  if(typeof limit === "number" && data.length>0){

    if(limit === Number.POSITIVE_INFINITY) {
      return data
    }

    if(limit === Number.NEGATIVE_INFINITY || limit <= 0) {
      return []
    }

    if(limit > 0){
      const result = []
      for(let i = 0; i < limit; i++){
        result.push(data[i])
      }
      return result
    }
    
  }

  return data

}


export const handle_SysCleanup = (data) => {
  data.forEach((row)=>{
    delete row.sysSortValue      //Used by handle_OrderBy
    delete row.sysUniqueIDValue  //Used by handle_From 
  })
}
  