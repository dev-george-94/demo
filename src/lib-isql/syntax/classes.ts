
export class Field {
    constructor(field,as) {
        let field1
        
        if (field instanceof Field){
            field1=field.field  // Required When Aliasing an existng field
        } else {
            field1=field
        }

        this.field=field1

        if(as){ this.as = as } 
    }
}

export class Expression {
    constructor(fn,args,as?){ 
        this.fn=fn
        this.args=args

        if(as){
            this.as=as
        }
        
    }
}

export class Sort {
    constructor(expression,sortDirection,nullSort){
        this.expression=expression,
        this.sortDirection=sortDirection,
        this.nullSort=nullSort
    }
}


    
  
export class Refference {
    constructor(ref){
        this.ref = ref
    }
}
  

export class Condition {
    constructor( term1,operator,term2,expect? ){
        this.term1=term1
        this.operator=operator
        this.term2=term2
        this.expect=expect
    }
}


export class ConditionSet {
    constructor(conditions,expect){
        this.conditions = conditions
        this.expect = expect
    }
}

export class Aggregate {
  
    constructor(fn_aggregate,args,as?){
        if(as){ this.as=as }
        if(args){this.args=args }
        this.fn_aggregate=fn_aggregate
    }
  }
  
export class DomainAggregate {

    constructor(obj){
        const { domain, fn, as } = obj
        this.domain=domain
        this.fn=fn
        this.as=as
    }
}







  
  