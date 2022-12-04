import LineupPlayerMini from '../LineupPlayerMini/LineupPlayerMini'
import EmptyPlayerMini from '../EmptyPlayerMini/EmptyPlayerMini'
import './LineupMini.scss'
import { useState, useEffect } from 'react'
import { FaAngleRight } from 'react-icons/fa'

const LineupMini = ({ lineup, onDelete, onAdd, editingPos, cancelEdit, lineupYear, lineupWeek, lineupScore, onOpenDialog, toggleEditingPos }) => {

  const [lineupSalary, setLineupSalary] = useState()

  const checkBeingEdited = (pos) => {
    return pos === editingPos
  }

  useEffect(() => {
    getSalary()
  }, [])

  const getSalary = () => {
    var salary = 0
    for (const [k,  lineupSlot] of Object.entries(lineup)) {
      if (lineupSlot !== null) {
        salary += lineupSlot["salary"]
      }
    }
    setLineupSalary(salary)
  }

  return (
    <div className="lineup-mini">
        <div className='lineup-mini-header'>
            <div>
                <p>Salary: ${lineupSalary}</p>
            </div>
            <div>
              <button className='edit-btn'>Edit <FaAngleRight /></button>
            </div>
        </div>
        {lineup["qb"] !== null ? 
          <LineupPlayerMini
            player={lineup.qb} 
            position={'qb'} 
            beingEdited={checkBeingEdited('qb')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        : <EmptyPlayerMini
            key={'qb'} 
            position={'qb'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('qb')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        }
        {lineup["rb1"] !== null ? 
          <LineupPlayerMini
            player={lineup.rb1} 
            position={'rb1'} 
            beingEdited={checkBeingEdited('rb1')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        : <EmptyPlayerMini
            key={'rb1'} 
            position={'rb1'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('rb1')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        }
        {lineup["rb2"] !== null ? 
          <LineupPlayerMini
            player={lineup.rb2} 
            position={'rb2'} 
            beingEdited={checkBeingEdited('rb2')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        : <EmptyPlayerMini
            key={'rb2'} 
            position={'rb2'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('rb2')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        }
        {lineup["wr1"] !== null ? 
          <LineupPlayerMini
            player={lineup.wr1} 
            position={'wr1'} 
            beingEdited={checkBeingEdited('wr1')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        : <EmptyPlayerMini
            key={'wr1'} 
            position={'wr1'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('wr1')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        }
        {lineup["wr2"] !== null ? 
          <LineupPlayerMini
            player={lineup.wr2} 
            position={'wr2'} 
            beingEdited={checkBeingEdited('wr2')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        : <EmptyPlayerMini
            key={'wr2'} 
            position={'wr2'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('wr2')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        }
        {lineup["wr3"] !== null ? 
          <LineupPlayerMini
            player={lineup.wr3} 
            position={'wr3'} 
            beingEdited={checkBeingEdited('wr3')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        : <EmptyPlayerMini
            key={'wr3'} 
            position={'wr3'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('wr3')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        }
        {lineup["te"] !== null ? 
          <LineupPlayerMini
            player={lineup.te} 
            position={'te'} 
            beingEdited={checkBeingEdited('te')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        : <EmptyPlayerMini
            key={'te'} 
            position={'te'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('te')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        }
        {lineup["flex"] !== null ? 
          <LineupPlayerMini
            player={lineup.flex} 
            position={'flex'} 
            beingEdited={checkBeingEdited('flex')} 
            onDelete={onDelete} 
            onAdd={onAdd} 
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        : <EmptyPlayerMini
            key={'flex'} 
            position={'flex'} 
            onAdd={onAdd} 
            beingEdited={checkBeingEdited('flex')} 
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        }
        {lineup["dst"] !== null ?
          <LineupPlayerMini
            player={lineup.dst}
            position={'dst'}
            beingEdited={checkBeingEdited('dst')}
            onDelete={onDelete}
            onAdd={onAdd}
            onOpenDialog={onOpenDialog}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} />
        : <EmptyPlayerMini
            key={'dst'}
            position={'dst'}
            onAdd={onAdd}
            beingEdited={checkBeingEdited('dst')}
            cancelEdit={cancelEdit}
            toggleEditingPos={toggleEditingPos}
            editingPos={editingPos} /> 
        }
    </div>
  )
}

export default LineupMini