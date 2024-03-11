
import { AND, Count, DList, DListAll, DMax, DMin, DRank, DRowNum, DSum, List, Max, OR, Sum, condition, exp, field, fields, ref, set, sort } from "../syntax/syntax"
import { tblStudents_WithSchema } from "../../be/sample-db/schema"

// Query


// const qry_EmptyQuery = {}

// const qry_InvalidFrom = {
//     select:"",
//     from:"",
// }

// const qry_EmptyFrom = {
//     select:"",
//     from:[],
// }

// const qry_InvalidFromElement = {
//     select:"",
//     from:["error"],
// }

// const qry_InvalidSelect= {
//     select:"",
//     from:[
//         tblStudents_WithSchema
//     ]
// }

// const qry_EmptySelect= {
//     select:[],
//     from:[
//         tblStudents_WithSchema
//     ]
// }

// const qry_InvalidSelectElement = {
//     select:[
//         "error"
//     ],
//     from:[
//         tblStudents_WithSchema
//     ]
// }


// Field

// Compile
// const qry_Invalid_Field_Name= {
//     select:[
//         field()
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
// }

// Compile
// const qry_Invalid_Field_Alias= {
//     select:[
//         field("id",["error"])
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],  
// }


// Aggregates

// Compile
// const qry_Empty_Aggregate = {
//     select:[
//         tblStudents_WithSchema.gender,
//         Max()
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
// }


// const qry_TopLevel_Aggregate_No_Alias = {
//     select:[
//         tblStudents_WithSchema.gender,
//         Max(1),
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
// }


// const qry_TopLevel_Aggregate_Invalid_Alias = {
//     select:[
//         tblStudents_WithSchema.gender,
//         Max(1,123),
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
// }

// const qry_Invalid_Aggregate_in_Aggregate = {
//     select:[
//         tblStudents_WithSchema.gender,
//         Max(1,"test1"),    
//         Max(Max(1),"test2"),                      //Agg with Agg 
//         // Max(ref("test1"),"test3"),                //Agg with RefToAgg
//         // Max(exp(Max(1),(arg)=>arg),"test4"),      //Agg with Exp with Agg Arg
//         // Max(exp(ref("test1"),(arg)=>arg),"test5") //Agg with Exp with RefToAgg Arg

//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     groupBy:[
//         tblStudents_WithSchema.gender
//     ]
// }

// const qry_Invalid_GroupBy_Type = {
//     select:[
//         tblStudents_WithSchema.gender,
//         Max(tblStudents_WithSchema.id,"maxId"),

//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     groupBy:"asd"
// }



// const qry_Invalid_GroupBy_Expression = {
//     select:[
//         tblStudents_WithSchema.gender,
//         Max(tblStudents_WithSchema.id,"maxId"),

//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     groupBy:[
//         "asd"
//     ]
// }



// const qry_Missing_GroupBy_In_Select = {
//     select:[
//         Max(tblStudents_WithSchema.id,"maxId"),
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     groupBy:[
//         tblStudents_WithSchema.gender,
//     ]
// }



// const qry_Missing_Select_In_GroupBy = {
//     select:[
//         tblStudents_WithSchema.id,
//         tblStudents_WithSchema.gender,
//         Max(tblStudents_WithSchema.id,"maxId"),
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     groupBy:[
//         tblStudents_WithSchema.gender,
//     ]
// }


// const qry_Invalid_GroupBy_Reference = {
//     select:[
//         tblStudents_WithSchema.id,
//         tblStudents_WithSchema.gender,
//         Max(tblStudents_WithSchema.id,"maxId"),
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     groupBy:[
//         tblStudents_WithSchema.id,
//         tblStudents_WithSchema.gender,
//         ref("maxId"),
//     ]
// }


const qry_Invalid_Where_Type = {
    select:[
        tblStudents_WithSchema.gender,
    ],
    from:[
        tblStudents_WithSchema
    ],
    where:"error"
}

const qry_Where_No_Condition = {
    select:[
        tblStudents_WithSchema.gender,
    ],
    from:[
        tblStudents_WithSchema
    ],
    where:["error"]
}

// const qry_Where_Empty_Condition = {
//     select:[
//         tblStudents_WithSchema.gender,
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     where:[condition()]
// }

// const qry_Where_Condition_Invalid_Operator = {
//     select:[
//         tblStudents_WithSchema.id,
//         tblStudents_WithSchema.gender,
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     where:[
//         condition(tblStudents_WithSchema.gender,"error","Male")
//     ]
// }



// const qry_Where_with_InvalidArray = {
//     select:[
//         tblStudents_WithSchema.id,
//         tblStudents_WithSchema.gender,
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     where:[
//         condition(tblStudents_WithSchema.gender,"not-in",123)
//     ]
// }

// const qry_Where_Invalid_Expect = {
//     select:[
//         tblStudents_WithSchema.id,
//         tblStudents_WithSchema.gender,
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     where:[
//         condition(tblStudents_WithSchema.gender,"==","Male","error")
//     ]
// }

// const qry_Where_QueryExpression_NotIn_Select = {
//     select:[
//         tblStudents_WithSchema.id,
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     where:[
//         condition(tblStudents_WithSchema.gender,"==","Male")
//     ]
// }


// const qry_Invalid_Where_Token = {
//     select:[
//         tblStudents_WithSchema.id,
//         tblStudents_WithSchema.gender,
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     where:[
//         condition(tblStudents_WithSchema.gender,"==","Male"),"error"
//     ]
// }

// const qry_Where_Missing_LogicalOperators = {
//     select:[
//         tblStudents_WithSchema.id,
//         tblStudents_WithSchema.gender,
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     where:[
//         condition(tblStudents_WithSchema.gender,"==","Male"),
//         condition(tblStudents_WithSchema.gender,"==","Male"),
//     ]
// }


// const qry_Where_Double_LogicalOperators = {
//     select:[
//         tblStudents_WithSchema.id,
//         tblStudents_WithSchema.gender,
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     where:[
//                  condition(tblStudents_WithSchema.gender,"==","Male"),
//         AND,AND, condition(tblStudents_WithSchema.gender,"==","Male"),
//     ]
// }


// const qry_Empty_Set_In_Where = {
//     select:[
//         tblStudents_WithSchema.id,
//         tblStudents_WithSchema.gender,
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     where:[ set() ]
// }

// const qry_Invalid_Set_In_Where = {
//     select:[
//         tblStudents_WithSchema.id,
//         tblStudents_WithSchema.gender,
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     where:[ set("error") ]

// } 


// const qry_Invalid_Set_In_Where_With_Invalid_Tokens = {
//     select:[
//         tblStudents_WithSchema.id,
//         tblStudents_WithSchema.gender,
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     where:[ set(["error"]) ]
// }


// const qry_Invalid_Having_Type = {
//     select:[
//         tblStudents_WithSchema.gender,
//         Sum(tblStudents_WithSchema.id,"SumId"),
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     groupBy:[
//         tblStudents_WithSchema.gender
//     ],
//     having:"error"
// }

// const qry_Invalid_Having_No_Condition = {
//     select:[
//         tblStudents_WithSchema.gender,
//         Sum(tblStudents_WithSchema.id,"SumId"),
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     groupBy:[
//         tblStudents_WithSchema.gender
//     ],
//     having:["error"]
// }

// const qry_Invalid_Having_Empty_Condition = {
//     select:[
//         tblStudents_WithSchema.gender,
//         Sum(tblStudents_WithSchema.id,"SumId"),
//     ],
//     from:[
//         tblStudents_WithSchema
//     ],
//     groupBy:[
//         tblStudents_WithSchema.gender
//     ],
//     having:[condition()]
// }


const qry_Test = {
    select:[
        tblStudents_WithSchema.country,
        exp(ref("IdList"),(arg)=>arg.length,"size"),
        List(1,"IdList"),

        // DListAll({
        //     expression:tblStudents_WithSchema.id,
        //     partitionBy:[tblStudents_WithSchema.country],
        //     orderBy:[sort(tblStudents_WithSchema.id,"asc")]
        // },"test"),



    ],
    from:[
        tblStudents_WithSchema
    ],
    groupBy:[
        tblStudents_WithSchema.country
    ],
    orderBy:[
        sort(ref("size"),"desc"),
        sort(tblStudents_WithSchema.country),
    ]
}




const queries={
    // Query
        // qry_EmptyQuery,                                //Runtime V

    // From
        // qry_InvalidFrom,                               //Runtime V
        // qry_EmptyFrom,                                 //Runtime V
        // qry_InvalidFromElement,                        //Runtime V

    // Select
        // qry_InvalidSelect,                             //Runtime V
        // qry_EmptySelect,                               //Runtime V
        // qry_InvalidSelectElement,                      //Runtime V
    
    // Field
        // qry_Invalid_Field_Name,                        //Compile V
        // qry_Invalid_Field_Alias,                       //Compile V

    // Aggregates

        // Select
        // qry_Empty_Aggregate,                           //Compile V
        // qry_Invalid_Aggregate_in_Aggregate,            //Runtime V   
        // qry_TopLevel_Aggregate_No_Alias,               //Runtime V
        // qry_TopLevel_Aggregate_Invalid_Alias,          //Runtime V

        // GroupBy
        // qry_Invalid_GroupBy_Type,                      //Runtime V
        // qry_Invalid_GroupBy_Expression,                //Runtime V
        // qry_Missing_GroupBy_In_Select,                 //Runtime V
        // qry_Missing_Select_In_GroupBy,                 //Runtime V
        // qry_Invalid_GroupBy_Reference,                 //Runtime V

    // DomainAggregates




    // // Where / Having
    //     qry_Invalid_Where_Type,                        //Runtime V
    //     qry_Where_No_Condition,                        //Runtime V
        // qry_Where_Empty_Condition,                     //Compile V
        // qry_Where_Condition_Invalid_Operator,          //Compile V
        // qry_Where_with_InvalidArray,                   //Runtime | Handled Env V
        // qry_Where_Invalid_Expect ,                     //Compile V
        // qry_Where_QueryExpression_NotIn_Select,        //Runtime V
        // qry_Invalid_Where_Token,                       //Runtime V
        // qry_Where_Missing_LogicalOperators,            //Runtime V
        // qry_Where_Double_LogicalOperators,             //Runtime V
        // qry_Empty_Set_In_Where,                        //Compile V
        // qry_Invalid_Set_In_Where,                      //Compile V
        // qry_Invalid_Set_In_Where_With_Invalid_Tokens,  //Compile V

        qry_Test

}

export default queries