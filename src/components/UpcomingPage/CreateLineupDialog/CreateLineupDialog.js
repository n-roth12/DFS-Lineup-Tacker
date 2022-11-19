import { useState, useEffect } from 'react'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import './CreateLineupDialog.scss'
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { BiExport, BiTrash, BiDownload } from 'react-icons/bi'

const CreateLineupDialog = ({ showCreateLineupDialog, onClose, slate }) => {
  const [lineups, setLineups] = useState([])
  const navigate = useNavigate()
  const [selectedLineups, setSelectedLineups] = useState([])
  const [file, setFile] = useState()
  const [download, setDownload] = useState()

  useEffect(() => {
    if (slate && Object.keys(slate).length > 0) {
      getLineups()
    }
  }, [slate])

  const getLineups = async () => {
    const res = await fetch(`/lineups_new?draftGroup=${slate["draftGroupId"]}`, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      }
    })
    const data = await res.json()
    setLineups(data)
  }

  const exportLineups = async () => {
    const lineupsToExport = lineups.filter((lineup) => selectedLineups.includes(lineup["lineup-id"]))
    const res = await fetch(`/lineups/export`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify(lineupsToExport)
    })
    const data = await res.blob()
    downloadFile(data)
  }

  const downloadFile = (blob) => {
    const url = window.URL.createObjectURL(blob)
    setFile(url)
    setDownload("test.csv")
    setSelectedLineups([])
  }

  const deleteLineups = () => {
    console.log(selectedLineups)
  }

  const toggleSelectAllLineups = () => {
    setFile(null)
    setDownload(null)
    if (selectedLineups.length > 0) {
      setSelectedLineups([])
    } else {
      setSelectedLineups(lineups.map((lineup) => {
        return lineup["lineup-id"]  
      }))
    }
  }

  const toggleSelectedLineup = (lineupId) => {
    setFile(null)
    setDownload(null)
    if (!selectedLineups.includes(lineupId)) {
      setSelectedLineups(selectedLineups.concat(lineupId))
    } else {
      setSelectedLineups(selectedLineups.filter((lineup_id) => lineup_id !== lineupId))
    }
  }

  const createLineup = async (draftGroupId) => {
    const res = await fetch(`/lineups/createEmptyLineup`, {
      method: 'POST',
      headers: {
        'x-access-token': sessionStorage.dfsTrackerToken
      },
      body: JSON.stringify({
        "draft-group": draftGroupId
      })
    })
    const data = await res.json()
    return data["lineupId"]
  }

  const createLineupWrapper = async (draftGroupId) => {
    const lineupId = await createLineup(draftGroupId)
    onClose()
    navigate(`/createLineup/${draftGroupId}/${lineupId}`)
  }

  const closeDialog = () => {
    setDownload(null)
    setFile(null)
    onClose()
  }

  return (
    <Dialog open={showCreateLineupDialog} className="create-lineup-dialog" fullWidth maxWidth="md">
      {slate && slate["games"] &&
      <>
        <DialogTitle className="title">
          <div className='title-inner'>
            <p><span className='title-upper'>{slate["minStartTime"].split("T")[0]} ({slate["draftGroupState"]})</span>
            <span className='title-lower'>  Start Time: {slate["minStartTime"].split("T")[1]}</span></p>
            <FaTimes className='close-btn' onClick={closeDialog}/>
          </div>
        </DialogTitle>
        <DialogContent className="content">
          <div className='content-inner'>
            <div className="games">
              <h3>{slate["games"].length} Games</h3>
              {slate["games"].length > 0 &&
                slate["games"].map((game) => 
                <div className="game">
                  <p>{game["description"]}</p>
                  <p>{game["startDate"].split("T")[0]}</p>
                </div>
                )
              }
            </div>
            <div className="user-lineups">
              <h3>Your Lineups ({lineups.length})</h3>
              <table className='lineups-table'>
                <thead>
                  <tr>
                    <th><button className='toggle-select-btn' onClick={toggleSelectAllLineups}>All</button></th>
                    <th></th>
                    <th>Title</th>
                    <th>Salary</th>
                    <th>Proj. Pts</th>
                  </tr>
                </thead>
                <tbody>
                {lineups.length > 0 ?
                  lineups.map((lineup) => 
                    <tr className='user-lineup'>
                      <input type="checkbox" checked={selectedLineups.includes(lineup["lineup-id"])} onClick={() => toggleSelectedLineup(lineup["lineup-id"])}></input>
                      <td><Link className='lineup-link' to={`/createLineup/${lineup["draft-group"]}/${lineup["lineup-id"]}`}>Edit</Link></td>
                      <td>Untitled</td>
                      <td>$59000</td>
                      <td>159.09</td>
                    </tr>
                  )
                :
                  <p>No Lineups Created</p>
                }
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
        <DialogActions className='actions'>
          {file !== null &&
            <a className='download-btn' href={file} download={download}>{download} <BiDownload className='download-icon'/></a>
          }
          {selectedLineups.length > 0 &&
            <>
              <button className='delete-btn' onClick={deleteLineups}>Delete <BiTrash className='trash-icon' /></button>
              <button className='export-btn' onClick={exportLineups}>Export CSV <BiExport className='export-icon'/></button>
            </>
          }
          <button className="create-btn" onClick={() => createLineupWrapper(slate["draftGroupId"])}>New Lineup</button>
        </DialogActions>
      </>
      }
    </Dialog>
  )
}

export default CreateLineupDialog