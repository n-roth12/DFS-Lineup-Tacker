import { useState, useEffect } from 'react'
import './CreateLineupPage.scss'
import { useParams } from 'react-router-dom'
import LineupPlayerNew from '../LineupPlayerNew/LineupPlayerNew'
import PlayerNew from '../PlayerNew/PlayerNew'
import { FaPlus } from 'react-icons/fa'
import PlayerLink from './../PlayerLink/PlayerLink'
import Lineup from '../SingleLineupPage/Lineup/Lineup'

const CreateLineupPage = () => {

  const { draftGroupId } = useParams()
  const [draftables, setDraftables] = useState([])
  const [activeOption, setActiveOption] = useState("custom")
  const [editingPos, setEditingPos] = useState()
  const [lineup, setLineup] = useState({
    "qb": null,
    "wr1": null,
    "wr2": null,
    "wr3": null,
    "rb1": null,
    "rb2": null,
    "te": null,
    "flex": null,
    "dst": null
  })
  
  const lineupSlots = ["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"]

  useEffect(() => {
    getDraftables()
  }, [])

  const getDraftables = async () => {
    const res = await fetch(`/upcoming/players?draftGroup=${draftGroupId}`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
    })
    const data = await res.json()
    var mySet = new Set()
    var draftables = []
    data.forEach((player) => {
      if (!mySet.has(player["playerId"])) {
        draftables.push(player)
        mySet.add(player["playerId"])
      }
    })
    setDraftables(draftables)
  }

  const deleteFromLineup = () => {
    return
  }

  const editLineup = () => {
    return
  }

  const cancelEdit = () => {
    return 
  }

  const openDialog = () => {
    return
  }

  return (
    <div className="createLineupPage page">
      <div className="header">
        <div className="header-inner">
          <div className="header-label">
            <p className="site">Fanduel Lineup</p>
            <p className="date">9/10 - 5pm ET</p>
          </div>
          <div className="header-options">
            <button 
              className={`${activeOption === "custom" ? "active" : ""}`}
              onClick={() => setActiveOption("custom")}
              >Custom
            </button>
            <button 
              className={`${activeOption === "generate" ? "active" : ""}`}
              onClick={() => setActiveOption("generate")}
              >Generate
            </button>
            <button 
              className={`${activeOption === "import" ? "active" : ""}`}
              onClick={() => setActiveOption("import")}
            >Import</button>
          </div>
        </div>
      </div>
      <div className='createLineupPage-inner'>
        <Lineup lineup={lineup} 
          onDelete={deleteFromLineup} 
          onAdd={editLineup}
          editingPos={editingPos}
          cancelEdit={cancelEdit} 
          onOpenDialog={openDialog} />
        {draftables.length > 0 &&
          <div>
            <table className='lineups-table'>
              <thead>
                <th>Name</th>
                <th>Position</th>
                <th>Team</th>
                <th>Salary</th>
                <th>Status</th>
                <th></th>
              </thead>
              <tbody>
                {draftables.map((player, index) => 
                  <tr>
                    <td><strong><PlayerLink playerName={player.displayName} /></strong></td>
                    <td>{player.position}</td>
                    <td>{player.teamAbbreviation}</td>
                    <td>{player.salary}</td>
                    <td>{player.status}</td>
                    <td><FaPlus className='addIcon' /></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        }
        {draftables.length > 0 ?
          <div className='lineup-players'>
            {draftables.map((player, index) =>
              <LineupPlayerNew player={player} key={index} />
            )}
          </div>
          :
          <h2>Loading...</h2>
        }
      </div>
    </div>
  )
}

export default CreateLineupPage