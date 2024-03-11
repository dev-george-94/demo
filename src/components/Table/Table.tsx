import { useEffect, useState } from 'react'
import { runQuery } from '../../lib-isql/index'

const Table = ({qry,name}) => {

    const [data, setData] = useState<any[]>([])
    useEffect(() => {
        const newData = runQuery(qry)
        setData(
            newData
        )
        console.log("data: ",newData)
    }, [qry])

    let headers:string[]=[]
    if(data.length){
      headers=Object.keys(data[0]).map((key)=>key)
    }


    

    return (   
        <>
            <h2>{name} ({data.length} rows)</h2>
            <br/>
            <table style={{border:"1px solid black", borderCollapse:"collapse"}}>
                <thead>
                    <tr>
                    {headers.map((head)=> 
                        <th key={head} style={{padding:"0.5rem 1rem",textAlign:"left"}}>
                            <pre style={{fontFamily:"inherit"}}>{head}</pre>
                        </th>
                    )}
                    </tr>
                </thead>
                <tbody>
                    {
                    data.map((row,i)=>{ 
                        return ( 
                        <tr key={i}>
                        {headers.map((header)=> 
                            <td style={{borderTop:"1px solid black",textAlign:"left",padding:"0.5rem 1rem",whiteSpace:"pre"}} key={`${header}${i}`}>
                            {
                                Array.isArray(row[header]) ? 
                                    row[header].map((item)=> typeof item === "undefined" ? "undefined": item).join(", ") :
                                    typeof row[header] === "undefined" ?
                                        "undefined":
                                        row[header].toString()
                            }
                            </td>
                        )}
                        </tr>
                        )}
                    )
                    }
                </tbody>
            </table>
        </>
    )
}

export default Table