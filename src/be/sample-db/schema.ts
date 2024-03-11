


import { field } from "../../lib-isql/syntax/syntax"
import { students } from "./data_medium"

export const tblStudents_WithSchema = {

    // Required to provide intelisense
    id:         field("id"),
    last_name:  field("last_name"),
    first_name: field("first_name"),
    gender:     field("gender"),
    country:    field("country"),
    registered: field("registered"),

    sysRowData:students
}

export const tblStudents_WithoutSchema={

    invalid:field("invalid"),

    sysRowData:students
}