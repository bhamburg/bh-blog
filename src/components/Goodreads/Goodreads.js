import React, { useState, useEffect } from "react"
import Moment from 'moment'
import axios from "axios"
import convert from "xml-js"

const PROXY = "https://cors-anywhere.herokuapp.com/"
const APIKEY = "WtRxj0qGSLZH6RXaR3BRg"

export default function ReadingList() {

  const [error, setError] = useState(false)
  const [curReading, setCurReading] = useState([])
  const [read, setRead] = useState([])
  const [curReadLoading, setCurReadLoading] = useState(false)
  const [readLoading, setReadLoading] = useState(false)

  // create data for table
  function createData(cover, title, author, dateRead, link) {
    return { cover, title, author, dateRead, link }
  }

  const readColumns = [
    { id: 'title', label: 'Book', minWidth: 400 },
    { id: 'author', label: 'Author', minWidth: 200 },
    { id: 'dateRead', label: 'Date Finished', minWidth: 100 },
  ]
  const readRows = []
  Moment.locale('en')  // format date string
  read.map((book, i) => {
    return readRows[i] = createData(
      book.elements[1].elements[7].elements[0].text, // cover image
      book.elements[1].elements[5].elements[0].text, // title
      book.elements[1].elements[21].elements[0].elements[1].elements[0].text, // author
      book.elements[10].elements ? Moment(book.elements[10].elements[0].text).format('MMM d, YYYY') : 'unknown', // date read
      book.elements[1].elements[10].elements[0].text, // link
    )
  })

  // Read Table Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  useEffect(() => {
    setCurReadLoading(true)
    axios
      .get(`${PROXY}https://www.goodreads.com/review/list/4284038.xml?key=${APIKEY}&v=2&shelf=currently-reading&per_page=200`)
      .then((res) => {
        let xml = res.data
        let parsedJSON = JSON.parse(convert.xml2json(xml))
        let books = parsedJSON.elements[0].elements[2].elements
        console.dir(books)
        setCurReadLoading(false)
        setCurReading(books)
      })
      .catch(error => {
        setCurReadLoading(false)
        setError(error)
        console.log(error)
      })
  
    setReadLoading(true)
    axios
      .get(`${PROXY}https://www.goodreads.com/review/list/4284038.xml?key=${APIKEY}&v=2&shelf=read&per_page=200&sort=date_read`)
      .then((res) => {
        let xml = res.data
        let parsedJSON = JSON.parse(convert.xml2json(xml))
        let books = parsedJSON.elements[0].elements[2].elements
        console.dir(books)
        setReadLoading(false)
        setRead(books)
      })
      .catch(error => {
        setReadLoading(false)
        setError(error)
        console.log(error)
      })
  },[])

  return (
    <div>
      {!error ? <>
        <h3>Currently Reading</h3>
        {curReadLoading && 
          <div>Loading...</div>
        }
        {!curReadLoading && (
        <div>
          {curReading.map((book, i) => {
            let title = book.elements[1].elements[5].elements[0]['text']
            let url = book.elements[1].elements[10].elements[0]['text']
            let imageUrl = book.elements[1].elements[7].elements[0]['text']
            let author = book.elements[1].elements[21].elements[0].elements[1].elements[0].text
            return (
              <div onClick={() => window.open(url)} key={i}>
                {imageUrl}
                {title}
                {author}
              </div>
            )
          })}
        </div>)}
        <h3>Most Recently Read</h3> 
        {readLoading && 
        <div>Loading...</div>}
        {!readLoading && (
        <div>
          <table>
            <th>
              <tr>
                {readColumns.map(column => (
                  <td
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </td>
                ))}
              </tr>
            </th>
            <tbody>
              {readRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
                return (
                  <tr hover tabIndex={-1} key={i}>
                    {readColumns.map(column => {
                      const value = row[column.id];
                      const cover = row.cover;
                      return (
                        <td 
                          key={column.id} 
                          align={column.align} 
                          style={column.id === 'title' ? { 
                            paddingLeft: 68,
                            backgroundSize: '54px auto',
                            backgroundPosition: 'left top',
                            backgroundRepeat: 'no-repeat',
                            backgroundImage: `url(${cover})`,
                          } : {}}
                          width='20'
                        >
                          {column.id !== 'cover' && value}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>)}
      <br /><a href="https://www.goodreads.com/review/list/4284038-brian-hamburg">View on Goodreads</a>
      </>
      : <div>Error loading lists!</div>
      }
    </div>
  )
}