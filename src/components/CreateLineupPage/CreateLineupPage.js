import { useState, useEffect } from 'react'
import './CreateLineupPage.scss'
import { useParams } from 'react-router-dom'
import LineupPlayerNew from '../LineupPlayerNew/LineupPlayerNew'
import PlayerNew from '../PlayerNew/PlayerNew'

const CreateLineupPage = () => {

  const { draftGroupId } = useParams()
  const [draftables, setDraftables] = useState([])
  const [activeOption, setActiveOption] = useState("custom")

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
      {draftables.length > 0 ?
        <div>
          {draftables.map((player, index) =>
            <LineupPlayerNew player={player} key={index} />
          )}
        </div>
        :
        <h2>Loading...</h2>
      }
    </div>
  )
}

export default CreateLineupPage