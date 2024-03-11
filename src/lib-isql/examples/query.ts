// Refer to objects as 
import { field, fields,} from "../../lib-isql/syntax/syntax"

// Refer to expression and references to expressions
import { exp, ref } from "../../lib-isql/syntax/syntax"

// Sorting and Filtering
import { sort, condition, set, AND, OR, } from "../../lib-isql/syntax/syntax"

// Aggregating Data
import {   List,  ListAll,  Count,   Sum,  Average,  Max,  Min,                 } from "../../lib-isql/syntax/syntax"
import {  DList, DListAll, DCount,  DSum, DAverage, DMax, DMin, DRowNum, DRank, } from "../../lib-isql/syntax/syntax"

// Schema
import { tblStudents_WithSchema, tblStudents_WithoutSchema } from "../../be/sample-db/schema"

import { invoke } from "../../lib-isql/utility/functions"


// TestId 1 - Select 1 ore more fields from table: present in user schema | present in dataset -> PASS
const qry_Fields = {
    select:[  
        tblStudents_WithSchema.id,
        tblStudents_WithSchema.gender,
        tblStudents_WithSchema.country,
    ],
    from:[ 
        tblStudents_WithSchema
    ]
    
}



// TestId 2 - Select 1 ore more fields from table: not present in user schema | present in dataset -> PASS
const qry_In_Dataset_NotIn_Schema = {
    
    select:[
        field("id"),
        field("birth_date"),
        field("email"),
    ],
    from:[
        tblStudents_WithSchema
    ]
}

// TestId 3 - Select 1 ore more fields: present in user schema | not present in dataset -> PASS
const qry_NotIn_Dataset_In_Schema = {
    select:[
        tblStudents_WithoutSchema.invalid
    ],
    from:[
        tblStudents_WithoutSchema
    ]
}

// TestId 4 - Select 1 ore more fields: not present in user schema | not present in dataset -> PASS
const qry_NotIn_Dataset_NotIn_Schema = {
    select:[
        field("invalid")
    ],
    from:[
        tblStudents_WithoutSchema
    ]
}


// TestId 5 - Select 1 field multiple times -> PASS
const qry_SameField_Multiple = {
    select:[
        tblStudents_WithSchema.id,
        tblStudents_WithSchema.id,
        tblStudents_WithSchema.id,
    ],
    from:[
        tblStudents_WithSchema
    ]
}


// TestId 6 - Select all fields from 1 table with schema -> PASS
const qry_AllFields = {
    select:[
        ...fields(tblStudents_WithSchema)
    ],
    from:[
        tblStudents_WithSchema
    ]
}



// TestId 7 - Select top 5 rows -> PASS
const qry_Top_Rows = {
    limit:5,
    select:[
        ...fields(tblStudents_WithSchema)
    ],
    from:[
        tblStudents_WithSchema
    ]
}




// TestId 8 - Select 1 field 1 with alias -> PASS
const qry_Field_Alias= {
    select:[
        field(tblStudents_WithSchema.country,"Country of Birth")
    ],
    from:[
        tblStudents_WithSchema
    ]
}

// TestId 9 - Select 3 fields with same alias -> PASS
const qry_Multiple_SameAlias = {
    select:[
        field(tblStudents_WithSchema.id,"Country of Birth"),
        field(tblStudents_WithSchema.gender,"Country of Birth"),
        field(tblStudents_WithSchema.country,"Country of Birth"),
    ],
    from:[
        tblStudents_WithSchema
    ]
}


// TestId 10 - Select various data formats -> PASS
const qry_Expressions_with_Single_Argument_Var = {
    limit:1,
    select:[
        exp(1,(arg)=>arg,"Number"),
        exp("Message",(arg)=>arg,"String"),
        exp(true,(arg)=>arg,"Boolean"),
        exp(undefined,(arg)=>arg,"undefined"),

        exp([1,2,3,4,5],(arg)=>arg,"Array"),
        exp({ name:"Thomas Jeff" },(arg)=> arg,"Object"),
    ],
    from:[
        tblStudents_WithSchema
    ]
}

// TestId 11 - Select an alias as an existing field -> PASS
const qry_Override = {
    distinct:[
        exp({},()=> 82,"id"),
        exp({},()=> "Hello","country"),    
    ],
    from:[
        tblStudents_WithSchema
    ]
}


// Test 12 - Functions -> PASS

const addAllNums = (numbers:number[]) => {
    return [...numbers].reduce((sum,num)=>sum+=num)
}

const ten = () => { return 1+2+3+4 }

const compute = ({num1,num2}) => num1 * 3 + num2
const computedNumber = () => -1 * 1 + 1 + 2 * 3 + 4


const qry_Calling_Functions = {
    select:[
        field(tblStudents_WithSchema.id,"id"),
        
        exp(
            [ tblStudents_WithSchema.id, tblStudents_WithSchema.id ],
            addAllNums,
        "id doubled \n\nwith defined function"),

        exp(
            [ tblStudents_WithSchema.id, tblStudents_WithSchema.id ],
            (args)=>{ return [...args].reduce((sum,num)=>sum+=num) },
        "id doubled \n\nwith undefined function"),

        exp(
            [ tblStudents_WithSchema.id, tblStudents_WithSchema.id ],
            (args) => invoke(addAllNums,args),
        "id doubled \nwith invoked \ndefined function"),

        exp(
            [ tblStudents_WithSchema.id, tblStudents_WithSchema.id ],
            (args) => invoke(
                ()=>{ return [...args].reduce((sum,num)=>sum+=num) },
                args
            ),
        "id doubled \nwith invoked \nundefined function"),


    ],
    from:[
        tblStudents_WithSchema
    ]
}




// TestId 13 - Numeric Expressions with Array args-> PASS

const qry_Numeric_Expressions_with_Array_Args = {
    select:[

        exp(
            [1,2,3,4], addAllNums, 
        "defined function \nwith arr args" ),

        exp(
            [],ten, 
        "defined function \nwith no arr args"),
        
        // Output depends on the function implementation and compile lang (Javascript)
        exp(
            [ 1,2,3, undefined ],
            addAllNums,
        "defined function \nwith 1+ undefined args"),

        exp(
            [1,2,3,4],
            (numbers:number[]) => {  return [...numbers].reduce((sum,num)=>sum+=num) }, 
        "undefined function \nwith arr args"),

        exp(
            [], () => {  return 1+2+3+4}, 
        "undefined function \nwith no arr args"),
        
        // Output depends on the function implementation and compile lang (Javascript)
        exp(
            [ 1,2,3, undefined ],
            (numbers:number[]) => { return [...numbers].reduce((sum,num)=>sum+=num) },
        "undefined function \nwith 1+ undefined args"),

    ],
    from:[
        tblStudents_WithSchema
    ]
}


// TestId 14 - Numeric Expressions with Object args -> PASS
const qry_Numeric_Expressions_with_Object_Args = {
    select:[

        exp(
            { num1:3, num2:1 },  compute, 
        "defined function \nwith obj args"),

        exp(
            {}, computedNumber, 
        "defined function \nwith no obj args"),
        
        // Output depends on the function implementation and compile lang (Javascript)
        exp(
            { num1:3, num2:undefined }, compute, 
        "defined function \nwith 1+ undefined obj args"),

        exp(
            { num1:3, num2:1 }, ({num1,num2}) => num1 * 3 + num2, 
        "undefined function \nwith obj args"),

        exp(
            {}, () => -1 * 1 + 1 + 2 * 3 + 4, 
        "undefined function \nwith no obj args"),
        
        // // Output depends on the function implementation and compile lang (Javascript)
        exp(
            {}, () => -1 * undefined + 1 + 2 * 3 + 4, 
        "undefined function \nwith 1+ undefined obj args"),



    ],
    from:[
        tblStudents_WithSchema
    ]
}


// TestId 15 - String Expressions with Array args -> PASS

const concat = (strings:string[]) => strings.reduce((concat,value)=>concat+=value).trim()
const message = () => "Information"

const qry_String_Expressions_with_Array_Args = {
    select:[

        exp(
            ["Hello"," ",tblStudents_WithSchema.last_name], concat, 
        "defined function \nwith arr args" ),

        exp(
            [], message, 
        "defined function \nwith no arr args"),
        
        // Output depends on the function implementation and compile lang (Javascript)
        exp(
            ["This is an ",undefined," value"], concat, 
        "defined function \nwith 1+ undefined args" ),

        exp(
            ["Hello"," ",tblStudents_WithSchema.last_name], (strings:string[]) => strings.join(""),
        "undefined function \nwith arr args"),

        exp(
            [], () => "Information", 
        "undefined function \nwith no arr args"),
        
        // Output depends on the function implementation and compile lang (Javascript)
        exp(
            ["This is an ",undefined," value"], (strings:string[]) => strings.reduce((concat,value)=>concat+=value).trim(), 
        "undefined function \nwith 1+ undefined args" ),

    ],
    from:[
        tblStudents_WithSchema
    ]
}


// TestId 16 - String Expressions with Object args -> PASS
const fullName = ({lastName, firstName}) => lastName + " " + firstName
const greet = () => "Hello"

const qry_String_Expressions_with_Object_Args = {
    select:[
        exp(
            { 
                lastName:tblStudents_WithSchema.last_name, 
                firstName:tblStudents_WithSchema.first_name 
            },
            fullName, 
        "defined function \nwith obj args"),  

        exp(
            {}, greet,
        "defined function \nwith no obj args"),
        
        // Output depends on the function implementation and compile lang (Javascript)
        exp(
            { 
                // lastName:tblStudents_WithSchema.lastName, 
                firstName:undefined
            },
            fullName, 
        "defined function \nwith undefined obj args"),

        exp(
            { 
                lastName:tblStudents_WithSchema.last_name, 
                firstName:tblStudents_WithSchema.first_name 
            },
            ({lastName, firstName}) => lastName + " " + firstName, 
        "undefined function \nwith obj args"),

        exp(
            {}, () => "Hello", 
        "undefined function \nwith no obj args"),

        // Output depends on the function implementation and compile lang (Javascript)
        exp(
            { 
                // lastName:tblStudents_WithSchema.lastName, 
                firstName:undefined
            },
            ({lastName, firstName}) => lastName + " " + firstName, 
        "undefined function \nwith undefined obj args"),

    ],
    from:[
        tblStudents_WithSchema
    ]
}

// TestId 17 - Expression Nesting  -> PASS
const qry_Advanced_Expressions_Nesting = {
    select:[

        exp(
            {
                lastName:tblStudents_WithSchema.last_name, 
                firstName:tblStudents_WithSchema.first_name
            },
            ({lastName, firstName})=> lastName + " " + firstName,
            "fullName"
        ),


        exp(
            exp(
                {
                    lastName:tblStudents_WithSchema.last_name, 
                    firstName:tblStudents_WithSchema.first_name
                },
                ({lastName, firstName})=> lastName + " " + firstName,
            ),
            (fullName:string)=>greet() + " " + fullName,
        "greeting with nested expression" ),

        exp(
            exp(
                exp(
                    exp(
                        exp(
                            exp(
                                exp(
                                    exp(
                                        exp(
                                            exp(0,(num)=>num + 1),
                                            (num)=>num + 1
                                        ),(num)=>num + 1
                                    ),(num)=>num + 1
                                ),(num)=>num + 1
                            ),(num)=>num + 1
                        ),(num)=>num + 1
                    ),(num)=>num + 1
                ),(num)=>num + 1
            ),(num)=>num + 1,
        " 0 incremented ten times"),

    ],
    from:[
        tblStudents_WithSchema
    ]
}

// TestId 18 - References To Expressions -> PASS


export const qry_References_To_Expressions = {
    select:[

        tblStudents_WithSchema.id,

        exp(
            {id:tblStudents_WithSchema.id}, 
            (args) =>  args.id + 1,  
        "var1"), 
 

        exp({},() => 2,"var2"),


        exp(
            {id:ref("var1")}, 
            (args) => args.id + 3,
        "referenced to var1"),

        exp(
            [ref("var1"),ref("var2")],
            (vars)=> { return vars.reduce((sum,num)=>sum+=num)},
        "referenced to var1 and var2 as array"),

        exp(
            {var1:ref("var1"),var2:ref("var2")},
            ({var1,var2})=> var1 + var2 + 4,
        "referenced to var1 and var2 as object"),

    ],
    from:[
        tblStudents_WithSchema
    ]
}


// TestId 19 -> Aggregating Data -> PASS
const qry_Classic_Aggregates = {

    select:[
        tblStudents_WithSchema.country,

        List(tblStudents_WithSchema.id, "IdList"),
        ListAll(tblStudents_WithSchema.id, "IdListAll"),
        Count(tblStudents_WithSchema.id,"IdCount"),
        Sum(tblStudents_WithSchema.id,"IdSum"),
        Average(tblStudents_WithSchema.id,"IdAverage"),
        Min(tblStudents_WithSchema.id,"IdMin"),
        Max(tblStudents_WithSchema.id,"IdMax"),
    ],
    from: [
        tblStudents_WithSchema
    ],
    
    groupBy:[
        tblStudents_WithSchema.country,
    ],

}

// TestId 20 -> Group By Expression with Ref -> PASS
const qry_GroupBy_Expression = {

    select:[
        tblStudents_WithSchema.gender,
        exp({str:tblStudents_WithSchema.country},({str})=>str[0].toLowerCase(),"firstLetter"),
    ],
    from:[ 
        tblStudents_WithSchema,
    ],
    groupBy:[
        tblStudents_WithSchema.gender,
        ref("firstLetter")
    ],
}

// TestId 21 -> Nesting Aggregates -> PASS
const qry_Aggregates_Nesting = {

    select:[

        tblStudents_WithSchema.country,
        ListAll(tblStudents_WithSchema.id,"ListAllIds"),
        Sum(tblStudents_WithSchema.id,"SumIds"),
        Count(tblStudents_WithSchema.id,"CountIds"),

        // Object
        exp({
            arg:    
                ListAll(
                    exp({id:tblStudents_WithSchema.id},({id}) => id + 1 ),
                )
        },({arg})=> arg.reduce((sum,num)=>sum+=num),"ListIdSum + ListIdCount"),

        // Array
        exp([ 
            ListAll(
                exp([tblStudents_WithSchema.id],(arg) => arg[0] + 1 ),
            )
        ],(arg)=> arg[0].reduce((sum,num)=>sum+=num),"ListIdSum + ListIdCount2"),



    ],
    from:[ 
        tblStudents_WithSchema,
    ],
    groupBy:[
        tblStudents_WithSchema.country,
    ],


}

// TestId 22 -> References To Aggregates -> PASS
const qry_References_To_Aggregates = {
    select:[
        tblStudents_WithSchema.country,
        ListAll(tblStudents_WithSchema.id,"ListAllId"),
        Sum(tblStudents_WithSchema.id,"SumId"),
        Count(tblStudents_WithSchema.id,"CountId"),
        Average(tblStudents_WithSchema.id,"AverageId"),

        exp(
            {
                sum:ref("SumId"),
                count:ref("CountId"),
            },({sum,count})=>sum/count,
        "Average with References")

    ],
    from:[
        tblStudents_WithSchema
    ],
    groupBy:[
        tblStudents_WithSchema.country
    ]
}


// TestId 23 -> Sorting Fields Available -> PASS
const qry_Sorted_Fields = {
    select: [
        ...fields(tblStudents_WithSchema)
    ],
    
    from:[
        tblStudents_WithSchema,
    ],
    orderBy:[
        sort(tblStudents_WithSchema.id,"asc","nullFirst"),
    ]

}


// TestId 24 - Sorting Expressions with Refs -> PASS
const qry_Sorted_Expressions = {
    select: [
        tblStudents_WithSchema.country,
        tblStudents_WithSchema.gender,
        exp(
            {gender:tblStudents_WithSchema.gender},
            ({gender})=> {
                const firstLetter = 
                    typeof gender === "string" ? 
                        gender[0].toLowerCase() : 
                        "n/a"
                return (
                    firstLetter === "m" ? 1 : 
                        firstLetter === "f" ? 2 : 3
                )
            }, 
        "gender2")
    ],
    
    from:[
        tblStudents_WithSchema,
    ],
    orderBy:[
        sort(ref("gender2"),"asc","nullFirst"),
    ]
}


// TestId 25 - Sorting Aggregate with Refs -> PASS
const qry_Sorted_Aggregates = {
    select: [
        tblStudents_WithSchema.country,
        ListAll(tblStudents_WithSchema.id,"ListAllIds"),
        
        exp(
            {list:ref("ListAllIds")},
            ({list}) => list.length,
        "ListLength"),

    ],
    
    from:[
        tblStudents_WithSchema,
    ],
    groupBy:[
        tblStudents_WithSchema.country
    ],

    orderBy:[
        sort(ref("ListLength"),"asc","nullFirst")
    ]

}

// TestId 26 - Filtering Data -> PASS
const qry_Fields_Filtered = {
    select: [
        ...fields(tblStudents_WithSchema)
    ],
    
    from:[
        tblStudents_WithSchema,
    ],
    where:[
        condition(tblStudents_WithSchema.country, "==", "Mexico"),
    ]
}

// TestId 27 - Filtering Data by Exclusion -> PASS
const qry_Fields_Filtered_NOT = {
    select: [
        ...fields(tblStudents_WithSchema)
    ],
    
    from:[
        tblStudents_WithSchema,
    ],
    where:[
        condition(tblStudents_WithSchema.country, "==", "Mexico", false),
    ]
}

// TestId 28 - Filtering Data using OR -> PASS
const qry_Fields_Filtered_OR = {
    select: [
        ...fields(tblStudents_WithSchema)
    ],
    
    from:[
        tblStudents_WithSchema
    ],

    where:[
            condition(tblStudents_WithSchema.gender, "==", "Male"),
        OR, condition(tblStudents_WithSchema.registered, "==", false),
    ]
}

// TestId 29 - Filtering Data using AND -> PASS
const qry_Fields_Filtered_AND = {
    select: [
        ...fields(tblStudents_WithSchema)
    ],
    
    from:[
        tblStudents_WithSchema
    ],

    where:[
             condition(tblStudents_WithSchema.gender, "==", "Female"),
        AND, condition(tblStudents_WithSchema.registered, "==", true),
    ]
}

// TestId 30 - Filtering Data using Logical Operator Precedence -> PASS
const qry_Fields_Filtered_OrderOfPrecedence = {
    select: [
        ...fields(tblStudents_WithSchema)
    ],
    
    from:[
        tblStudents_WithSchema
    ],

    where:[
             condition(tblStudents_WithSchema.gender,  "==", "Female" ),
        OR,  condition(tblStudents_WithSchema.gender,  "==", "Male"   ),
        AND, condition(tblStudents_WithSchema.country, "==", "Mexico" ),
    ]
}

// TestId 31 - Filtering Data using Condion Sets -> PASS
const qry_Fields_Filtered_Sets = {
    select: [
        ...fields(tblStudents_WithSchema)
    ],
    from:[
        tblStudents_WithSchema,
    ],
    where:[
        set([
                 condition(tblStudents_WithSchema.gender,  "==", "Female" ),
            OR,  condition(tblStudents_WithSchema.gender,  "==", "Male"   ),
        ]),
        AND, condition(tblStudents_WithSchema.country, "==", "Honduras", false ),
    ]
}

// TestId 32 - Filtering Data Excluding Condion Sets -> PASS
const qry_Fields_Filtered_NOT_Sets = {
    select: [
        ...fields(tblStudents_WithSchema)
    ],
    from:[
        tblStudents_WithSchema
    ],
    where:[
        set([
                 condition(tblStudents_WithSchema.country,  "==", "Canada"         ),
            OR,  condition(tblStudents_WithSchema.country,  "==", "United Kingdom" ),
            OR,  condition(tblStudents_WithSchema.country,  "==", "France"         ),
        ], false),
        AND, condition(tblStudents_WithSchema.gender, "==", "Male"),
    ]
}

// TestId 34 - Filtering Data using nested Sets
const qry_Fields_Filtered_Nested_Sets = {
    select: [
        ...fields(tblStudents_WithSchema)
    ],
    from:[
        tblStudents_WithSchema
    ],
    where:[
        set([
            set([
                    condition(tblStudents_WithSchema.gender,"===","Male"),
                OR, condition(tblStudents_WithSchema.gender,"===","Female"),
            ],true),
            AND, condition(tblStudents_WithSchema.registered,"===",true)
        ]), AND, condition(tblStudents_WithSchema.id,">=",700)
    ]
}


// TestId 35 - Filtering Data with Refs -> PASS 
const qry_Fields_Filtered_with_Refs = {
    select: [
        ...fields(tblStudents_WithSchema),
        exp({gender:tblStudents_WithSchema.gender},({gender})=>{ 
            
            const firstLetter=typeof gender === "string" ? gender[0].toLowerCase() : "n/a"
            return (
                firstLetter === "m" ? 1 : 
                    firstLetter === "f" ? 2 : 3
            )
        
        },"FirstLetter")
    ],
    
    from:[
        tblStudents_WithSchema
    ],

    where:[
            condition(ref("FirstLetter"),"==",1),
        OR, condition(ref("FirstLetter"),"==",2),
    ]

}

// TestId 36 - Filtering Groups with Refs -> PASS
const qry_Groups_Filtered_with_Refs = {
    select: [
        tblStudents_WithSchema.country,
        tblStudents_WithSchema.gender,
        List(tblStudents_WithSchema.id,"ListId"),
        Count(tblStudents_WithSchema.id,"CountId"),
        Sum(tblStudents_WithSchema.id,"SumId"),

    ],
    
    from:[
        tblStudents_WithSchema
    ],

    groupBy:[
        tblStudents_WithSchema.country,
        tblStudents_WithSchema.gender,
    ],

    having:[
        set([
                 condition( ref("CountId"), ">" , 3   ),
            AND, condition( ref("SumId"),   ">=", 600 ),
        ])
    ]

}

// TestId 37 - Domain Aggregates -> PASS
const qry_Domain_Aggregates = {
    select:[
        tblStudents_WithSchema.country,
        tblStudents_WithSchema.gender,
        tblStudents_WithSchema.id,

        DList({
            expression:          tblStudents_WithSchema.id, 
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
            orderBy:     [ sort(tblStudents_WithSchema.id,"asc","nullLast") ]
        },"DList_id"),

        DListAll({
            expression:          tblStudents_WithSchema.id, 
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
            orderBy:     [ sort(tblStudents_WithSchema.id,"desc","nullLast") ]
        },"DListAll_id"),

        DRowNum({
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
            orderBy:     [ sort(tblStudents_WithSchema.id,"asc","nullLast") ]
        },"DRowNum"),
        
        DRank({
            expression:  tblStudents_WithSchema.id,
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
            orderBy:     [ sort(tblStudents_WithSchema.id,"desc","nullFirst") ]  
        },"DRank"),
        

        DCount({
            expression:  tblStudents_WithSchema.id, 
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
        },"DCount_id"),

        DSum({
            expression:  tblStudents_WithSchema.id, 
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
        },"DSum_id"),

        DAverage({
            expression:  tblStudents_WithSchema.id, 
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
        },"DAverage_id"),

        DMin({
            expression:  tblStudents_WithSchema.id, 
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
        },"DMin_id"),

        DMax({
            expression:  tblStudents_WithSchema.id, 
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
        },"DMax_id")

    ],
    from:[
        tblStudents_WithSchema,
    ],
    orderBy:[
        sort(tblStudents_WithSchema.country,"asc","nullLast"),
        sort(tblStudents_WithSchema.gender,"asc","nullLast"), 
        sort(tblStudents_WithSchema.id,"asc","nullLast"), 
    ]

}

// TestId 38 - Domain RowNumber -> PASS
const qry_Domain_RowNum = {
    select:[
        tblStudents_WithSchema.id,
        tblStudents_WithSchema.country,
        tblStudents_WithSchema.gender,

        DRowNum({
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
            orderBy:     [ sort(tblStudents_WithSchema.id,"asc","nullFirst") ]  
        },"DRowNum1_WithinSortedGroup"),

        DRowNum({
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
        },"DRowNum2_WithinGroup"),

        DRowNum({
            orderBy:     [ sort(tblStudents_WithSchema.id,"asc","nullFirst") ]  
        },"DRowNum3_SortedNoGroup"),

        DRowNum({},"DRowNum4_NoGroupNoSort"),

    ],
    from:[
        tblStudents_WithSchema
    ],

    orderBy:[
        sort(tblStudents_WithSchema.country,"asc","nullLast"),
        sort(tblStudents_WithSchema.gender,"asc","nullLast"),
        sort(tblStudents_WithSchema.id,"asc","nullLast"),
    ]

}

// TestId 39 Ref To Domain Aggregate -> PASS
const qry_References_To_DomainAggregate = {
    select:[
        tblStudents_WithSchema.country, 
        tblStudents_WithSchema.gender,
        tblStudents_WithSchema.id,

        DList({
            expression:  tblStudents_WithSchema.id, 
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
            orderBy:     [ sort(tblStudents_WithSchema.id,"asc","nullFirst") ]
        },"DList_id"),

        DMax({
            expression:  tblStudents_WithSchema.id, 
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
        },"DMax_id"),

        exp(
            {arg:ref("DMax_id")},({arg}) => arg+1,
        "Reference to DMax_id" )

    ],
    from:[
        tblStudents_WithSchema,
    ],
    orderBy:[
        sort(tblStudents_WithSchema.country,"asc","nullLast"),
        sort(tblStudents_WithSchema.gender,"asc","nullLast"),
        sort(tblStudents_WithSchema.id,"asc","nullLast"),
    ]
}

// TestId 40 Filter By Domain Aggregate
const qry_Filter_By_DomainAggregate = {
    select:[
        tblStudents_WithSchema.country, 
        tblStudents_WithSchema.gender,
        tblStudents_WithSchema.id,

        DList({
            expression:  tblStudents_WithSchema.id, 
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
            orderBy:     [ sort(tblStudents_WithSchema.id,"asc","nullFirst") ]
        },"DList_id"),

        DCount({
            expression:  tblStudents_WithSchema.id, 
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
        },"DCount_id"),

    ],
    from:[
        tblStudents_WithSchema,
    ],

    where:[
        condition(ref("DCount_id"),"===",3)
    ],

}

// TestId 41 Group  By Domain Aggregate
const qry_GroupBy_DomainAggregate = {
    select:[
        tblStudents_WithSchema.country, 
        tblStudents_WithSchema.gender,

        DMax({
            expression:          tblStudents_WithSchema.id, 
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
        },"DMax_id"),

    ],
    from:[
        tblStudents_WithSchema
    ],

    groupBy:[
        tblStudents_WithSchema.country, 
        tblStudents_WithSchema.gender,
        ref("DMax_id")
    ]

}


// TestId 42 Filter Group  By Domain Aggregate -> PASS
const qry_Filter_Group_By_DomainAggregate = {
    select:[
        tblStudents_WithSchema.country, 
        tblStudents_WithSchema.gender,

        DMax({
            expression:          tblStudents_WithSchema.id, 
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
        },"DMax_id"),

    ],
    from:[
      tblStudents_WithSchema,
    ],
    
    where:[
        condition(ref("DMax_id"),">",600)
    ],

    groupBy:[
        tblStudents_WithSchema.country, 
        tblStudents_WithSchema.gender,
        ref("DMax_id")
    ],


}



// TestId 43 Sort  By Domain Aggregate -> PASS
const qry_OrderBy_DomainAggregate = {
    distinct:[
        // tblStudents_WithSchema.id,
        tblStudents_WithSchema.country, 
        tblStudents_WithSchema.gender,
        
        
        DList({
            expression:  tblStudents_WithSchema.id, 
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
            orderBy:     [ sort(tblStudents_WithSchema.id,"asc","nullFirst") ]
        },"DList_id"),

        DMax({
            expression:  tblStudents_WithSchema.id, 
            partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
        },"DMax_id"),

    ],
    from:[
        tblStudents_WithSchema,
    ],


    orderBy:[
        sort(ref("DMax_id"),"desc","nullFirst")
    ]

}


// TestId 44 Expressions with Single Argumets -> FAIL
const qry_Expressions_with_SingleArgument_QueryExpression = {
    select:[
        tblStudents_WithSchema.country,
        tblStudents_WithSchema.gender,
        
        exp(tblStudents_WithSchema.id,(arg)=>arg,"Field"),

        exp(
            exp(1,(arg)=>arg+1),
            (arg)=>arg,
        "Expression"),
        
        exp(
            Sum(tblStudents_WithSchema.id),(arg) => arg,
        "Aggregate"),

        exp(
            DList({
                expression:  tblStudents_WithSchema.id, 
                partitionBy: [ tblStudents_WithSchema.country, tblStudents_WithSchema.gender ],
                orderBy:     [ sort(tblStudents_WithSchema.id,"asc","nullFirst") ]
            }),(arg) => arg,
        "DomainAggregate"),

        exp(
            ref("Aggregate"),(arg) => arg,
        "Reference")

   
    ],
    from:[
        tblStudents_WithSchema
    ],

    groupBy:[
        tblStudents_WithSchema.country, 
        tblStudents_WithSchema.gender,
        ref("Field"),
        ref("Expression"),
        ref("DomainAggregate"),
    ]
}

// TestId 45 Subquery
const qry_Subquery = {
    select:[
        ...fields(qry_OrderBy_DomainAggregate),
    ],
    from:[
        qry_OrderBy_DomainAggregate
    ]
}





const queries={
   
    qry_Fields,
    qry_In_Dataset_NotIn_Schema,
    qry_NotIn_Dataset_In_Schema,
    qry_NotIn_Dataset_NotIn_Schema,
    qry_SameField_Multiple,
    qry_AllFields,
    qry_Field_Alias,
    qry_Multiple_SameAlias, 
    qry_Top_Rows,
    qry_Override,
    qry_Calling_Functions,
    qry_Expressions_with_Single_Argument_Var, 
    qry_Expressions_with_SingleArgument_QueryExpression,
    qry_Numeric_Expressions_with_Array_Args, 
    qry_Numeric_Expressions_with_Object_Args,
    qry_String_Expressions_with_Array_Args,
    qry_String_Expressions_with_Object_Args,
    qry_Advanced_Expressions_Nesting,
    qry_References_To_Expressions,
    qry_Classic_Aggregates,
    qry_GroupBy_Expression,
    qry_Aggregates_Nesting,
    qry_References_To_Aggregates, 
    qry_Sorted_Fields,
    qry_Sorted_Expressions,
    qry_Sorted_Aggregates,
    qry_Fields_Filtered,
    qry_Fields_Filtered_NOT,
    qry_Fields_Filtered_OR,
    qry_Fields_Filtered_AND,
    qry_Fields_Filtered_OrderOfPrecedence,
    qry_Fields_Filtered_Sets,
    qry_Fields_Filtered_NOT_Sets,
    qry_Fields_Filtered_Nested_Sets,
    qry_Fields_Filtered_with_Refs,
    qry_Groups_Filtered_with_Refs, 
    qry_Domain_Aggregates,
    qry_Domain_RowNum,
    qry_References_To_DomainAggregate,
    qry_Filter_By_DomainAggregate,
    qry_GroupBy_DomainAggregate,
    qry_Filter_Group_By_DomainAggregate,
    qry_OrderBy_DomainAggregate,
    qry_Subquery,

}

export default queries

