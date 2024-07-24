import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Block from '../../components/Block'

const Blocks = () => {
    const [blocks, setBlocks] = useState([])
    const [paginatedId, setPaginatedId] = useState(1)
    const [blocksLength, setBlocksLength] = useState(0)

    useEffect(() => {
        // console.log(document.location.origin)
        fetch(`http://127.0.0.1:3001/api/blocks/length`)
        .then(response => response.json())
        .then(data => setBlocksLength(data.blockchain))

        fetchPaginatedBlocks(paginatedId)
    }, [])

    const fetchPaginatedBlocks = (paginatedId) => fetch(`http://127.0.0.1:3001/api/blocks/${paginatedId}`)
    .then(response => response.json())
    .then(data => setBlocks(data.blockchain))

    console.log({paginatedId})
    console.log({blocks})
    console.log({blocksLength})

  return (
    <div>
      <div><Link to='/'>Home</Link></div>

      <h3>Blocks</h3>
      <div>
        {
          blocksLength >= 5 ? (
            <>
              {
                [...Array(Math.ceil(blocksLength/5)).keys()].map(key => {
                  const paginatedId = key+1;
  
                  return (
                      <span key={key} onClick={() => fetchPaginatedBlocks(paginatedId)}>
                          <Button size="small" variant="danger">
                              {paginatedId}
                          </Button>{" "}
                      </span>
                  )
                })
              }
            </>
          ) : (
            <>
              {
                [...Array(blocksLength).keys()].map(key => {
                  const paginatedId = key+1;
  
                  return (
                      <span key={key} onClick={() => fetchPaginatedBlocks(paginatedId)}>
                          <Button size="small" variant="danger">
                              {paginatedId}
                          </Button>{" "}
                      </span>
                  )
                })
              }
            </>
          )
        }
      </div>
      {
        blocks.map(block => {
            return (
                <Block key={block.hash} block={block} />
            )
        })
      }
    </div>
  )
}

export default Blocks
