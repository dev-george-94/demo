import { Aggregate, Condition, ConditionSet, DomainAggregate, Expression, Field, Refference, Sort } from "../syntax/classes"
import { isQueryLike, isTableLike, isValidQueryExpression } from "./definitions"
import { typeOf } from "../utility/functions"
import { logicalOperators, nullSortOptions, sortDirectionOptions } from "../syntax/syntax"
import { operators } from "../utility/utility"

export const errMsg = {

  // Query     
  Runtime_Error_Query__                                                                                            :()                         => `Invalid Query!\n\nA query must be an object that include at least the following keys:\n\n-> select or a distinct \n-> from\n`,

  // Statement
  Runtime_Error_Query_Statement_NotArray__                                                                         :(statement)                => `Invalid '${statement}' statement!\n\nThe '${statement}' statement must be of array type\n`,
  Runtime_Error_Query_Statement_emptyArray__                                                                       :(statement)                => `Invalid '${statement}' statement!\n\nThe '${statement}' statement array cannot be empty\n`,
  
  // Select
  Runtime_Error_Query_Statement_Select_Token__                                                                     :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is not a valid: \n\n-> Field - field()\n-> Expression - exp()\n-> Aggregate -> Count()  \n-> DomainAggregate - DCount()\n-> Refference - ref()\n`,
  Runtime_Error_Query_Statement_Select_Token_NotField_Arg_As_Missing__                                             :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\n\nThe 'as' argument is required by top-level expressions:\n\n-> Expressions - exp()\n-> Aggregates - Count()\n-> DomainAggregates - DCount()\n`,
  Runtime_Error_Query_Statement_Select_Token_Arg_As_NotString__                                                    :(statement,idx,name)       => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\n\n${errorFn.argNotString(name)}\n`,
  
  // Field
  Runtime_Error_Query_Statement_Select_Token_Field_Arg_Fieldname__                                                 :(statement,idx,name)       => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\n\n${errorFn.argNotString(name)} or another valid Field expression\n`,
  
  // Aggregate
  Runtime_Error_Query_Statement_Select_Token_Aggregate_Arg_Expression_Missing__                                    :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\n\nThe Aggregate requires an 'expression' argument\n`,
  Runtime_Error_Query_Statement_Select_Token_Aggregate_Arg_Expression_Invalid__                                    :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\n\nThe following expressions cannot be used as an Aggregate 'expression' argument:\n\n-> Arrays\n-> Objects\n-> Aggregates\n-> Expressions with Aggregates as arguments\n-> Refferences to Aggregates\n-> References to Expressions with Aggregates as arguments\n`,

  // DomainAggregate
  Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain__                                          :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\n\nThe 'domain' argument must be an object and may only contain the following keys:\n\n-> expression  - a value or a expression\n-> partitionBy - create groups from 'expression' argument\n-> orderBy     - order the 'expression' argument\n`,
  Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_Expression_isRequired__                :(statement,idx,fn)         => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\n\nThe DomainAggregate '${fn}' requires an 'expression' argument\n`,
  Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_isAggregate__                          :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\n\nAggregates cannot be used as arguments for DomainAggregates\n`,
  Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_PartitionBy_Token__                    :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\n\nThe 'partionBy' argument must be an array containing only expressions\n`,
  Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_OrderBy_isRequired__                   :(statement,idx,fn)         => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\n\nThe DomainAggregate '${fn}' requires an 'orderBy' argument\n`,
  Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_OrderBy_Invalid__                      :(statement,idx,fn)         => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\n\nThe DomainAggregate '${fn}' does not have an 'orderBy' argument\n`,
  Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_OrderBy_Tokens_Invalid_                :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\n\nThe 'orderBy' argument must be an array of 'sort()' expressions`,
  Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_OrderBy_Token_Sort_Arg_Expression__    :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\n\nThe sort() 'expression' argument \nmust be a expression available in the 'select' statement\n`,
  Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_OrderBy_Token_Sort_Arg_SortDirection__ :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\n\nThe sort() 'sortDirection' argument can only be assigned to:\n\n-> 'asc'  - to sort the values in ascending order\n-> 'desc' - to sort the values in descending order\n`,
  Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_OrderBy_Token_Sort_Arg_NullSort__      :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\n\nThe sort() 'nullSort' argument can only be assigned to:\n\n-> 'nullFirst' - to place undefined values as first\n-> 'nullLast'  - to place undefined values as last\n `,
  
  // From
  Runtime_Error_Query_Statement_From_Token__                                                                       :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is not valid Object Array, a Table or a Query\n`,

  // GroupBy
  Runtime_Error_Query_Statement_GroupBy_Token_isAggregate__                                                        :(statement,idx,name)       => errorFn.aggregateNotAllowed(statement,idx,name),
  Runtime_Error_Query_Statement_GroupBy_Token_NotInStatement_Select__                                              :(statement,name)           => errorFn.matchInGroupByAndSelect(statement,name),
  Runtime_Error_Query_Statement_Select_Token_NotInStatement_GroupBy__                                              :(statement,name)           => errorFn.matchInGroupByAndSelect(statement,name),
   
  // Where / Having
  Runtime_Error_Query_Statement_Where_and_Having__                                                                 :(statement)                => `Invalid '${statement}' statement!\n\nThe statement requires at least 1 condition() or set()\n`,
  Runtime_Error_Query_Statement_Where_and_Having_Token__                                                           :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\nThe '${statement}' statement can only have:\n\n-> condition() - used create data filters ; \n-> logical operators: AND , OR ; \n-> set() - used to create groups of conditions ;\n`,
  Runtime_Error_Query_Statement_Where_and_Having_Token_Condition__                                                 :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\nA 'condition()' must have the following arguments:\n\n-> term1    - a value or a QueryExpression\n-> operator - string used to compare term1 and term2;\n-> term2    - a value or a QueryExpression\n-> expect   - (optional); expected outcome of the comparasion. \n              By default true \n`,
  Runtime_Error_Query_Statement_Where_and_Having_Token_Condition_Arg_Term_NotInStatement_Select__                  :(statement,idx,expression) => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\nThe term '${expression}' must be available in the 'select' statement\n`,
  Runtime_Error_Query_Statement_Where_and_Having_Token_Condition_Arg_Operator__                                    :(statement,idx,operator)   => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\nThe 'operator' argument '${operator}' is not supported\nSupported operators are:\n\n'==', '===', '!=', '!=='\n'<', '<=', '>', '>='\n'in', 'not-in'\n`,
  Runtime_Error_Query_Statement_Where_and_Having_Token_Condition_and_ConditionSet_Arg_Expect__                     :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\nThe 'expect' argument must be of boolean type\n`,
  Runtime_Error_Query_Statement_Where_and_Having_Token_ConditonSet_Arg_Conditions_NotArray__                       :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\nThe 'tokens' argument must be an array of conditions connected using logical operators\n`,
  Runtime_Error_Query_Statement_Where_and_Having_Token_Condition_and_ConditionSet_LogicalOperator_Missing__        :(statement,prev,crnt)      => `Invalid '${statement}' statement!\n\nMissing 'logical operator' argument between tokens indexes ${prev} and ${crnt}\nAll conditions must be connected using \na logical operator\nAND / OR\n`,
  Runtime_Error_Query_Statement_Where_and_Having_Token_Condition_and_ConditionSet_LogicalOperator_Duplicate__      :(statement,prev,crnt)      => `Invalid '${statement}' statement!\n\nDuplicate 'logical operator' argument at token indexes ${prev} and ${crnt} \nAll conditions must have only one logical operator\nAND / OR\n`,
  Runtime_Error_Query_Statement_Where_Token_Condition_Arg_Term_isAggregate__                                       :(statement,idx,name)       => errorFn.aggregateNotAllowed(statement,idx,name),
  Runtime_Error_Query_Statement_Having_NoStatement_GroupBy__                                                       :(statement)                => `Invalid '${statement}' statement!\n\nThe '${statement}' statement requires a 'groupBy' statement\n`,
  Runtime_Error_Query_Statement_Having_Token_Condition_Arg_Term_NotAggregate__                                     :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\nThe 'condition()' requires at least one of the 'term' arguments to be an Reference to an Aggregate\n`,

  // OrderBy
  Runtime_Error_Query_Statement_Token__                                                                            :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\nThe '${statement}' statement can only contain sort() expressions\n`,
  Runtime_Error_Query_Statement_OrderBy_Token_Sort_Arg_Expression__                                                :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\nThe sort has the following arguments:\n\n-> expression    - mandatory ; an expression available in the 'select' statement\n-> sortDirection - sort the values in a given order\n                   'asc'  - ascending; default\n                   'desc' - descending\n-> nullSort      - determines the order of nullable values\n                   'nullFirst' - undefined values will be first\n                   'nullLast'  - undefined values will be last; default\n`,
  Runtime_Error_Query_Statement_OrderBy_Token_Sort_Arg_Expression_NotInStatement_Select__                          :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\nThe sort() 'expression' argument \nmust be a expression available in the 'select' statement\n`,
  Runtime_Error_Query_Statement_OrderBy_Token_Sort_Arg_SortDirection__                                             :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\nThe sort() 'sortDirection' argument can only be assigned to:\n\n-> 'asc'  - to sort the values in ascending order\n-> 'desc' - to sort the values in descending order\n`,
  Runtime_Error_Query_Statement_OrderBy_Token_Sort_Arg_NullSort__                                                  :(statement,idx)            => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\nThe sort() 'nullSort' argument can only be assigned to:\n\n-> 'nullFirst' - to place undefined values as first\n-> 'nullLast'  - to place undefined values as last\n `,

  // Limit
  Runtime_Error_Query_Statement_Limit_NotANumber__                                                                 :(statement)                => `Invalid '${statement}' statement!\n\nThe 'limit' statement may only contain a single value of number type!\n`,

 
}

const errorFn = {
  matchInGroupByAndSelect:(statement,name)     => `Invalid '${statement}' statement!\n\nMissing expression '${name} in '${statement}'\nAll non-Aggregate expressions \nmust be be present in both the 'select' and 'groupBy' statements\n`,
  aggregateNotAllowed    :(statement,idx,name) => `Invalid '${statement}' statement!\n\nToken at index ${idx} is invalid!\nAggregate '${name}' is not allowed in the '${statement}' statement\n`,
  argNotString           :(arg)                => `The '${arg}' argument must be of type string`,
  argNotArray            :(arg)                => `The '${arg}' argument must be of type array`,
}




export const validateQuery = (arg) => {

  if( !isQueryLike(arg) ){ throw new Error(errMsg.Runtime_Error_Query__()) }

  let { select } = arg
  const { from, where, groupBy, having, distinct, orderBy, limit } = arg

  select = distinct || select

    validate_From(from)
    validate_Select(select)

    let selectWithTypes
    if(typeOf(select) === "array"){
      selectWithTypes = select.map((expression)=>{
        return { 
          expression,
          type:QueryExpressionSuperType(expression,select)  
        }
      })
    } else {
      selectWithTypes = select
    }

    validate_Where(where,selectWithTypes) 

    let groupByWithTypes
    if(typeOf(groupBy)==="array"){
      groupByWithTypes = groupBy.map((expression)=>{

        if(expression instanceof Refference){
          expression = select.filter((item)=>item.as === expression.ref)[0]
        }

        return {
          expression,
          type:QueryExpressionSuperType(expression,select)  
        }
      })
    } else {
      groupByWithTypes = groupBy
    }

    validate_GroupBy(groupBy,groupByWithTypes,selectWithTypes) 
    validate_Having(having,selectWithTypes,groupBy)
    validate_OrderBy(orderBy,select)
    validate_Limit(limit)
    
}


export const validate_From = (from) => {

  const statement = "from"

  if(typeOf(from)!=="array"){  throw new Error(errMsg.Runtime_Error_Query_Statement_NotArray__(statement)) }
  if(typeOf(from)==="array" && from.length === 0){ throw new Error(errMsg.Runtime_Error_Query_Statement_emptyArray__(statement)) }

  from.forEach((token,i)=>{ 
    if(
         ! ( typeOf(token) === "array" && token.filter((row)=>typeOf(row) !== "object" ).length === 0 ) //object Array
      && ! isTableLike(token) 
      && ! isQueryLike(token)
    ){
      
      throw new Error(errMsg.Runtime_Error_Query_Statement_From_Token__(statement,i))
    }
  })

}


export const validate_Select = (select) =>{

  const statement = "select"

  if(typeOf(select)!=="array"){ throw new Error(errMsg.Runtime_Error_Query_Statement_NotArray__(statement)) }
  if(typeOf(select)==="array" && select.length === 0){ throw new Error(errMsg.Runtime_Error_Query_Statement_emptyArray__(statement)) }

  for(let i=0;i<select.length;i++){
    const selectExpression = select[i]

     // Only Valid Query Expressions in select
    if(!isValidQueryExpression(selectExpression)){ throw new Error(errMsg.Runtime_Error_Query_Statement_Select_Token__(statement,i)) }

    if(selectExpression instanceof Field){

      const {field} = selectExpression
      if( !( typeOf(field)==="string" || field instanceof Field) ) {  throw new Error(errMsg.Runtime_Error_Query_Statement_Select_Token_Field_Arg_Fieldname__(statement,i,"fieldname")) }
    }


    if(selectExpression instanceof Aggregate){
      if(
        !Object.keys(selectExpression).includes("args")
      ){
        throw new Error(errMsg.Runtime_Error_Query_Statement_Select_Token_Aggregate_Arg_Expression_Missing__(statement,i))
      }

      const {args} = selectExpression
  
      if(QueryExpressionSuperType(args,select)==="Aggregate"){
        throw new Error(errMsg.Runtime_Error_Query_Statement_Select_Token_Aggregate_Arg_Expression_Invalid__(statement,i))
      }
    }

    if(selectExpression instanceof DomainAggregate){

      const domainKeys = ["expression","partitionBy","orderBy"]

      const {fn,domain} = selectExpression
      
      const fnName = fn.name
      // Domain
      
      if( typeOf(domain)!=="object" ){
        throw new Error(
          errMsg.Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain__(statement,i)
        ) 
      }

      if(JSON.stringify(domain) === "{}" && fnName ==="d_RowNum"){ continue; }

      if(
           Object.keys(domain).length === 0 
        || Object.keys(domain).filter((key)=>!domainKeys.includes(key)).length > 0
      ){
        throw new Error(
          errMsg.Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain__(statement,i)
        )
      }

      // Check Individual Args
      const domainArgs = Object.keys(domain)
      const {expression,partitionBy,orderBy} = domain

      // expression
      if(
        ["agg_list","agg_listall","d_Rank","agg_count","agg_sum","agg_average","agg_min","agg_max"].includes(fnName)
        && !domainArgs.includes("expression")
      ){
        throw new Error(
          errMsg.Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_Expression_isRequired__(statement,i,fnName)
        )
      }

      if(isValidQueryExpression(expression) && QueryExpressionSuperType(expression,select)==="Aggregate"){
        throw new Error(errMsg.Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_isAggregate__(statement,i))
      }
      

      // partitionBy
      if(domainArgs.includes("partitionBy")){
    
        if(typeOf(partitionBy)!=="array") { 
          throw new Error(
            errMsg.Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_PartitionBy_Token__  (statement,i)
          ) 
        }

        partitionBy.forEach((item,j)=>{
          if(!isValidQueryExpression(item)){ 
            throw new Error(
              errMsg.Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_PartitionBy_Token__  (statement,i)
            ) 
          }
          if(QueryExpressionSuperType(item,select)==="Aggregate"){ 
            throw new Error(
              errMsg.Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_isAggregate__(statement,i)
            ) 
          }
        })

      }

      // orderBy
      if(
        ["d_Rank"].includes(fnName)
        && !domainArgs.includes("orderBy")
      ){
        throw new Error(
          errMsg.Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_OrderBy_isRequired__(statement,i,fnName)
        )
      }


      if(["agg_count","agg_sum","agg_average","agg_min","agg_max"].includes(fnName) && domainArgs.includes("orderBy")){
        throw new Error(errMsg.Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_OrderBy_Invalid__(statement,i,fnName))
      }

      if(domainArgs.includes("orderBy")){

        if(typeOf(orderBy)==="undefined"){continue;}
        if(typeOf(orderBy) !== "array") { throw new Error (errMsg.Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_OrderBy_Tokens_Invalid_(statement,i))}
        if(orderBy.length === 0){ continue; }
      
        orderBy.forEach((sort,j)=>{
      
          if(!(sort instanceof Sort)){ throw new Error(errMsg.Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_OrderBy_Tokens_Invalid_(statement,i)) }
      
          const {expression,sortDirection,nullSort} = sort

          if(typeOf(expression)==="undefined"){ 
            throw new Error(
              errMsg.Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_OrderBy_Token_Sort_Arg_Expression__(statement,i)
            ) 
          }
      
          if(QueryExpressionSuperType(expression,select)==="Aggregate"){ 
            throw new Error(errMsg.Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_isAggregate__(statement,i)) 
          }
          
         
          if(!sortDirectionOptions.includes(sortDirection)){
            throw new Error(
              errMsg.Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_OrderBy_Token_Sort_Arg_SortDirection__(statement,i)
            )
          }
          
          
          if(!nullSortOptions.includes(nullSort)){
            throw new Error(
              errMsg.Runtime_Error_Query_Statement_Select_Token_DomainAggregate_Arg_Domain_Arg_OrderBy_Token_Sort_Arg_NullSort__(statement,i)
            )
          }
      
        })
      
      }

    }

    const name = selectExpression.as || selectExpression.field

    if(!name){ 
      throw new Error(
        errMsg.Runtime_Error_Query_Statement_Select_Token_NotField_Arg_As_Missing__(statement,i)
      ) 
    }
    if(typeOf(name)!=="string"){ 
      throw new Error(
        errMsg.Runtime_Error_Query_Statement_Select_Token_Arg_As_NotString__(statement,i,"as")
        ) 
    }

  }

}


export const validate_Where = (where,selectWithTypes) => {

  const statement = "where"

  if(typeOf(where)==="undefined"){return;}
  if(typeOf(where) !== "array") { throw new Error (errMsg.Runtime_Error_Query_Statement_NotArray__(statement))}
  if(where.length === 0){ return; }

  validate_Filter_Tokens(statement,where,selectWithTypes)

}

const validate_Having = (having,selectWithTypes,groupBy) => {

  const statement = "having"

  if(typeOf(having)==="undefined"){return;}
  if(typeOf(having) !== "array") { throw new Error (errMsg.Runtime_Error_Query_Statement_NotArray__(statement))}
  if(having.length === 0){ return; }

  // Having Makes GroupBy Mandatory
  if(typeOf(groupBy)==="undefined" && typeOf(having)!=="undefined"){
    throw new Error(errMsg.Runtime_Error_Query_Statement_Having_NoStatement_GroupBy__(statement))
  }

  validate_Filter_Tokens(statement,having,selectWithTypes)

}


const validate_Filter_Tokens = (statement,tokens,selectWithTypes) => {

  // If there is only 1 token, it must be intended as Condtion / ConditionSet
  if (tokens.length === 1 && !( tokens[0] instanceof Condition || tokens[0] instanceof ConditionSet) ){
    throw new Error(
      errMsg.Runtime_Error_Query_Statement_Where_and_Having__(statement)
    )  
  }

  let prevToken
  let crntToken

  tokens.forEach((token,i)=>{

    // Keep Track of Prev and Crnt Token
    if( i > 0 ){ prevToken = crntToken }
    crntToken=token

    // Check if the Token usage is valid: 
    // Condition / ConditionSet / LogicalOperators
    if( 
      !(        
        logicalOperators.includes(crntToken)  
      || crntToken instanceof Condition
      || crntToken instanceof ConditionSet
      )  
    )  { 
      throw new Error(errMsg.Runtime_Error_Query_Statement_Where_and_Having_Token__(statement,i))  
    }

    // Check The Token patterns. 
    // 1. Conditon / ConditionSet followed by LogicalOperator | Common
    // 2. LogicalOperator followed by Conditon / ConditionSet | Dev QoL - when commenting first Condition / ConditionSet

    if(typeOf(prevToken)!=="undefined"){

      const operators  = [prevToken,crntToken].filter((token)=> logicalOperators.includes(token)).length
      const conditions = [prevToken,crntToken].filter((token)=> token instanceof Condition || token instanceof ConditionSet ).length
      
      // Improve
      if( conditions === 2 ){ 
        throw new Error(
          errMsg.Runtime_Error_Query_Statement_Where_and_Having_Token_Condition_and_ConditionSet_LogicalOperator_Missing__(statement,i-1,i)
        ) 
       }
      if( operators  === 2 ){ 
        throw new Error(
          errMsg.Runtime_Error_Query_Statement_Where_and_Having_Token_Condition_and_ConditionSet_LogicalOperator_Duplicate__(statement,i-1,i)
        ) 
      }

    }

    // Check The Condition itself
    if(crntToken instanceof Condition){

      // Validate Token Args
      const {term1,operator,term2} = crntToken // Mandatory Args
      const {expect}               = crntToken // Optional Args

      // Improve
      if(typeOf(term1) === "undefined"){ throw new Error(errMsg.Runtime_Error_Query_Statement_Where_and_Having_Token_Condition__(statement,i)) }
      if(!operators.includes(operator)){ throw new Error(errMsg.Runtime_Error_Query_Statement_Where_and_Having_Token_Condition_Arg_Operator__(statement,i,operator) )}
      if(typeOf(term2) === "undefined"){ throw new Error(errMsg.Runtime_Error_Query_Statement_Where_and_Having_Token_Condition__(statement,i)) }
      if(typeOf(expect)!=="boolean")   { throw new Error(errMsg.Runtime_Error_Query_Statement_Where_and_Having_Token_Condition_and_ConditionSet_Arg_Expect__(statement,i) )}

      // Process Token Terms
      const terms = [term1,term2]

      const termsWithTypes = []

      terms.forEach((term)=>{
        if( isValidQueryExpression(term) ){

          // Check If the QueryExpression is in the 'select'
          const itemTag = term.ref || term.as || term.field
          const items = selectWithTypes.filter((item)=>  item.expression.as === itemTag || item.expression.field === itemTag  )

          if(items.length === 0) { 
            throw new Error(errMsg.Runtime_Error_Query_Statement_Where_and_Having_Token_Condition_Arg_Term_NotInStatement_Select__(statement,i,itemTag)) 
          } 
  
          termsWithTypes.push({
            name:itemTag,
            type:items[0].type
          })
      
        }
      })


      if(typeOf(termsWithTypes)==="array" && termsWithTypes.length>0){

        // No Aggregates in Where
        if(statement ==="where" ){
          termsWithTypes.forEach((term)=>{
            if(term.type === "Aggregate"){
              throw new Error(
                errMsg.Runtime_Error_Query_Statement_Where_Token_Condition_Arg_Term_isAggregate__(statement,i,term.name)
              ) 
            }
          })
        }

        if(statement ==="having"){

          if(termsWithTypes.length === 1 ){
            if(termsWithTypes[0].type !=="Aggregate"){ 
              throw new Error(errMsg.Runtime_Error_Query_Statement_Having_Token_Condition_Arg_Term_NotAggregate__(statement,i)) 
            }
          }

          if(termsWithTypes.length === 2 ){
            if(
                 termsWithTypes[0].type !=="Aggregate" 
              && termsWithTypes[1].type !=="Aggregate"
            ){ 
              throw new Error(errMsg.Runtime_Error_Query_Statement_Having_Token_Condition_Arg_Term_NotAggregate__(statement,i)) 
            }
          }

        }

      }

    }

    // If there are nested conditions, they need to be checked separately
    if(crntToken instanceof ConditionSet) {

      // Validate Token
      if(typeOf(crntToken.expect)!=="boolean"){ 
        throw new Error(
          errMsg.Runtime_Error_Query_Statement_Where_and_Having_Token_Condition_and_ConditionSet_Arg_Expect__(statement,i)
        ) 
      }

      if(typeOf(crntToken.conditions)!=="array"){ 
        console.log("tokens",tokens)
        throw new Error(
          errMsg.Runtime_Error_Query_Statement_Where_and_Having_Token_ConditonSet_Arg_Conditions_NotArray__(statement,i)
        ) 
      }

      // Process Token
      validate_Filter_Tokens(statement,crntToken.conditions,selectWithTypes)
      
    }
  })
}



const validate_GroupBy = (groupBy,groupByWithTypes,selectWithTypes) => {

  const statement = "groupBy"
  
  // Check 'groupBy' Statement Declaration
  if(typeOf(groupBy)==="undefined"){return;}
  if(typeOf(groupBy)!=="array"){ throw new Error(errMsg.Runtime_Error_Query_Statement_NotArray__(statement)) }
  if(groupBy.length === 0){ return; }

  //Check Select against GroupBy
  selectWithTypes.forEach((selectItem,i)=>{
    const hasMatchInSelectAndGroupBy = groupByWithTypes.filter(
      (groupByItem)=>{
        return JSON.stringify(selectItem) === JSON.stringify(groupByItem)
      } 
    ).length > 0
    
    if( selectItem.type!=="Aggregate" && !hasMatchInSelectAndGroupBy ){ 
      const selectItemName = selectItem.expression.as || selectItem.expression.field 
      throw new Error(errMsg.Runtime_Error_Query_Statement_Select_Token_NotInStatement_GroupBy__(statement,selectItemName)) 
    }
  })



  //Check GroupBy against Select
  groupByWithTypes.forEach((groupByItem,i)=>{

    const {expression} = groupByItem
    const groupByItemName = expression.ref || expression.as || expression.field

    if(groupByItem.type === "Aggregate"){ 
      throw new Error(errMsg.Runtime_Error_Query_Statement_GroupBy_Token_isAggregate__(statement,i,groupByItemName)) 
    }

    const hasMatchInSelectAndGroupBy = selectWithTypes.filter(
      (selectItem)=>JSON.stringify(selectItem) === JSON.stringify(groupByItem)
    ).length > 0

    if( !hasMatchInSelectAndGroupBy ){ throw new Error(errMsg.Runtime_Error_Query_Statement_GroupBy_Token_NotInStatement_Select__("select",groupByItemName)) }

  })

}





const validate_OrderBy = (orderBy,select) => {

  const statement="orderBy"

  if(typeOf(orderBy)==="undefined"){return;}
  if(typeOf(orderBy) !== "array") { throw new Error (errMsg.Runtime_Error_Query_Statement_NotArray__(statement))}
  if(orderBy.length === 0){ return; }

  

  orderBy.forEach((sort,i)=>{

    if(!(sort instanceof Sort)){ throw new Error(errMsg.Runtime_Error_Query_Statement_Token__(statement,i)) }

    const {expression,sortDirection,nullSort} = sort

    if(typeOf(expression)==="undefined"){ throw new Error(errMsg.Runtime_Error_Query_Statement_OrderBy_Token_Sort_Arg_Expression__(statement,i)) }

    const sortTag = expression.ref || expression.as || expression.field

    if( select.filter((item)=>item.as === sortTag || item.field === sortTag).length === 0 ){
      throw new Error(errMsg. Runtime_Error_Query_Statement_OrderBy_Token_Sort_Arg_Expression_NotInStatement_Select__(statement,i))
    }
    
    if(!sortDirectionOptions.includes(sortDirection)){
      throw new Error(errMsg.Runtime_Error_Query_Statement_OrderBy_Token_Sort_Arg_SortDirection__(statement,i))
    }

    if(!nullSortOptions.includes(nullSort)){
      throw new Error(errMsg.Runtime_Error_Query_Statement_OrderBy_Token_Sort_Arg_NullSort__(statement,i))
    }



  })

}

const validate_Limit = (limit) =>{
  const statement = "limit"
  if(typeOf(limit)==="undefined"){return;}
  if(typeOf(limit)!=="number" || isNaN(limit)){ throw new Error(errMsg.Runtime_Error_Query_Statement_Limit_NotANumber__(statement)) }
}

// Checks a query and its arguments
export const QueryExpressionSuperType = (queryExpression,select) => {

  if( queryExpression instanceof Field           ){ return "Field"           }
  if( queryExpression instanceof Aggregate       ){ return "Aggregate"       }
  if( queryExpression instanceof DomainAggregate ){ return "DomainAggregate" }

  if( queryExpression instanceof Expression      ){

    // Look into all arguments. If one is Aggregate, return that instead
    // Expression with aggregates are treated as Aggregates
    const {args} = queryExpression

    let expression

    if(typeOf(args) === "array"){

      for(let i=0;i<args.length;i++){
        expression=args[i]
        if(QueryExpressionSuperType(expression,select)==="Aggregate" ){ return "Aggregate" }
      }
      return "Expression"

    } else if(typeOf(args) === "object" && !isValidQueryExpression(args)){
      
      for(let i=0;i<Object.keys(args).length;i++){
        expression = args[Object.keys(args)[i]]
        if(QueryExpressionSuperType(expression,select)==="Aggregate" ){ return "Aggregate" }
      }
      return "Expression"

    } else {

      expression = args

      if(isValidQueryExpression(args)){
        if(QueryExpressionSuperType(expression,select)==="Aggregate" ){ return "Aggregate" }
      }
      return "Expression"

    }

  }

  if( queryExpression instanceof Refference){
    const refferedTo = select.filter((expression)=>expression.as === queryExpression.ref)[0]
    return QueryExpressionSuperType(refferedTo,select)
  }


}