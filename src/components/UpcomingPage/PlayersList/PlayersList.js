import { useState } from 'react'
import './PlayersList.scss'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

const PlayersList = ({ players }) => {

  const [playersCurr, setPlayersCurr] = useState(players['All'])
  const [playersPrev, setPlayersPrev] = useState(players['All'])
  const [showSaveBtn, setShowSaveBtn] = useState(false)

  const handleUp = (index) => {
    if (index < 1) return
    const players_copy = [...playersCurr]
    players_copy[index] = playersCurr[index - 1]
    players_copy[index - 1] = playersCurr[index]
    setPlayersCurr(players_copy)
    setShowSaveBtn(true)
  }

  const handleDown = (index) => {
    if (index >= playersCurr.length - 1) return
    const players_copy = [...playersCurr]
    players_copy[index] = playersCurr[index + 1]
    players_copy[index + 1] = playersCurr[index]
    setPlayersCurr(players_copy)
    setShowSaveBtn(true)
  }

  const resetPlayers = () => {
    setPlayersCurr([...playersPrev])
    setShowSaveBtn(false)
  }

  const savePlayers = () => {
    setPlayersPrev([...playersCurr])
    setShowSaveBtn(false)
  }

  return (
    <div className="players-list">
    	<h2>Players</h2>
      {showSaveBtn &&
        <div className="save-btn-wrapper">
          <button className="save-btn" onClick={savePlayers}>Save</button>
          <button className="cancel-btn" onClick={resetPlayers}>Cancel</button>
        </div>
      }
    	<ul className="player-items">
        {playersCurr.map((player, index) => {
          return (
            <li className="player-item">
              <div className="player-item-inner">
                <p><strong>{index + 1}. {player.name}</strong></p>
                <p>{player.position} {player.stats.team}</p>
              </div>
              <div className="btn-wrapper">
                <button className="up-btn"onClick={() => handleUp(index)}><FaArrowUp/></button>
                <button className="down-btn" onClick={() => handleDown(index)}><FaArrowDown/></button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default PlayersList