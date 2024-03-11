import { errValue } from "./utility"

// Arrays
export const uniqueArray = (arr) => {
  const result = []
    arr.map((item)=>{
      if(!result.includes(item)){
        result.push(item)
      }
    })
  return result
}

export const valuesOnly = (arr) =>{ 
  
  if( arr.filter((item) => typeOf(item) ==="object" || typeOf(item) ==="array").length > 0 ){
    return [errValue]
  }
  
  return arr.filter((value)=> typeof value !=="undefined" && !Number.isNaN(value))

}
 

// Objects
export const autoNameProp = ({obj,propName}) => {
  let newPropName = propName

    let i = 1
    while(Object.keys(obj).includes(newPropName)){
        i++
        newPropName = propName + i
    }

  return newPropName 
}

// Other
export const typeOf = (arg) => Array.isArray(arg) ? "array" : typeof arg

export const invoke = (fn,args?) => fn(args)

export const zeroFill= (value,maxValue) => {

  const strVal=value.toString()
  const strMaxVal=maxValue.toString()

  let fill=""
  while ( fill.length + strVal.length < strMaxVal.length ) {
    fill+="0"
  }

  return fill + strVal

}