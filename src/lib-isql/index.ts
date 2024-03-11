
import { 
  handle_From, 
  handle_Select, 
  handle_Where,
  handle_Distinct,
  handle_GroupBy,
  handle_Having,
  handle_OrderBy,
  handle_Limit,
  handle_SysCleanup, 
} from "./handlers"
import { validateQuery } from "./interpreter/validation"


export const runQuery = (selectQuery) => {

  validateQuery(selectQuery)

  let { select } = selectQuery

  const {
    from,
    where,
    groupBy,
    having,
    distinct,
    orderBy,
    limit
  } = selectQuery

  // Override Select with Distinct as they are mutually exclusive and express same thing
  // Distinct Just adds an additional behavior
  select = select || distinct

  // Exit early if the user specifies an invalid Limit
  if( limit && (limit === Number.NEGATIVE_INFINITY || typeof limit !== "number" || limit <= 0)) {
    return []
  }

  let data
  
    data = handle_From     ( from                     )
    data = handle_Select   ( data,          select,   )
    data = handle_Where    ( data, where,   select,   )
    data = handle_Distinct ( data,          distinct, )
    data = handle_GroupBy  ( data, groupBy,           )
    data = handle_Having   ( data, having,  select,   )
    data = handle_OrderBy  ( data, orderBy,           )
    data = handle_Limit    ( data, limit,             )

    handle_SysCleanup(data)

  return data
  
}

