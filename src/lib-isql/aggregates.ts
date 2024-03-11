import { typeOf, uniqueArray, valuesOnly } from "./utility/functions"


export const agg_list = (args) => {

  const values = args.filter((item)=>typeOf(item)!=="undefined")
  
  if(values.length > 0){
    return values
  } else {
    return undefined
  }
  
}

export const agg_listall = (args) => {

  const values = args 
  
  if(values.length > 0){
    return values
  } else {
    return undefined
  }
  
}
  
export const agg_count = (args) => {

  const values = valuesOnly(args)

  if(values.length > 0){
    return values.length
  } else {
    return undefined
  }

}
  
export const agg_sum = (args) => {

  const values = valuesOnly(args)

  if(values.length > 0){
    return values.reduce((sum,num)=>sum += num )
  } else {
    return undefined
  }
}

export const agg_average = (args) => {
  
  const sum = agg_sum(args)
  const count = agg_count(args)

  if(typeof Number.isInteger(sum) && Number.isInteger(count)){
    return ( sum / count )
  } else {
    return undefined
  }
  
}

export const agg_min = (args) => {

  const values = valuesOnly(args)
  
  if(values.length > 0){
    return values.reduce((min,num)=>min = num > min ? min : num)
  } else {
    return undefined
  }
    
}

export const agg_max = (args) => {

  const values = valuesOnly(args)

  if(values.length > 0){
    return values.reduce((max,num)=>max = num < max ? max : num)
  } else {
    return undefined
  }
              
}

export const aggregateWithTotals = [
  agg_list.name,
  agg_listall.name,
  agg_count.name,
  agg_sum.name,
  agg_average.name,
  agg_min.name,
  agg_max.name,
]


export const d_RowNum = ({uid,domain}) => {

  // Add Row Number
  const newdomain=domain.map((row,i)=>{
    return ({
      ...row,
      row_num:i+1
    })
  })

  const subdomain = newdomain.filter((entry)=>entry.sysUniqueIDValue === uid)[0]

  return subdomain["row_num"]
}

export const d_Rank = ({uid,domain,exp}) => {

  // Determine Rankings
  const ranks = uniqueArray(
    domain.map((row)=> row[exp.field])
  ) 

  const newdomain = domain.map(
    (row)=> ({
      ...row,
      rank: ranks.indexOf(row[exp.field]) + 1 
    })
  )

  const subdomain = newdomain.filter((entry)=>entry.sysUniqueIDValue === uid)[0]
 
  return subdomain["rank"]
}