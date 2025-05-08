import { useEffect, useState } from "react"
import { useFetchData } from "../../HOC/UseFetchData"
import { useCRUD } from "../../HOC/UseCRUD"
import "./group.scss"

export default function Group({ createGroup, setCreateGroup ,groupOptions,setGroupOptions,loading,error, showCreateModelBox,showEditModelBox,setShowEditModelBox, setShowCreateModelBox,onSuccess}) {
  const { handleCreate, handleEdit, handleDelete} = useCRUD()
  const [hasAddedNewGroup, setHasAddedNewGroup] = useState(false)
  const [changes, setChanges] = useState({ created: [], updated: [], deleted: [] })
  const [originalGroups,setOriginalGroups] = useState([])

  const colors = ["red", "blue", "green", "orange", "lightblue", "lightgreen", "gray", "whitesmoke"]



  useEffect(() => {
    setOriginalGroups([...groupOptions])
  }, [groupOptions])

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleCreateNew = () => {
    if (hasAddedNewGroup) {
      alert("You can only add one new group at a time. Please save your changes first.")
      return
    }

    const newGroup = {
      id: `temp-${Date.now()}`, // Temporary ID
      name: `New Group ${groupOptions.length + 1}`,
      color: getRandomColor(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setGroupOptions((prevGroups) => [...prevGroups, newGroup])
    setChanges((prev) => ({ ...prev, created: [...prev.created, newGroup] }))
    setHasAddedNewGroup(true)
  }

  const handleEditGroup = (id, newName) => {
    setGroupOptions((prev) => prev.map((g) => (g.id === id ? { ...g, name: newName } : g)))
    setChanges((prev) => {
      const isNewGroup = prev.created.some((g) => g.id === id)
      if (isNewGroup) {
        return {
          ...prev,
          created: prev.created.map((g) => (g.id === id ? { ...g, name: newName } : g)),
        }
      } else {
        return {
          ...prev,
          updated: [...prev.updated.filter((g) => g.id !== id), { id, name: newName }],
        }
      }
    })
  }

  const handleDeleteGroup = (id) => {
    setGroupOptions((prev) => prev.filter((g) => g.id !== id))
    setChanges((prev) => {
      const isNewGroup = prev.created.some((g) => g.id === id)
      if (isNewGroup) {
        return {
          ...prev,
          created: prev.created.filter((g) => g.id !== id),
        }
      } else {
        return {
          ...prev,
          deleted: [...prev.deleted, id],
          updated: prev.updated.filter((g) => g.id !== id),
        }
      }
    })
    setHasAddedNewGroup(false)
    
  }

  const handleCancel = () => {
    const filteredGroups = originalGroups.filter(
      (group) => typeof group.id !== "string" || !String(group.id).startsWith("temp-")
    );
    setChanges({ created: [], updated: [], deleted: [] })
    setHasAddedNewGroup(false)
    setGroupOptions([...filteredGroups])
    console.log(groupOptions)
    setCreateGroup(false)
    // if (showCreateModelBox) {
    //   setShowCreateModelBox(true)
    // }
    // if(showEditModelBox) {
    //   setShowEditModelBox(false)
    // }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create new groups
      for (const newGroup of changes.created) {
        await handleCreate(`http://localhost:8383/group/add`, newGroup)
        
      }

      // Update existing groups
      for (const updatedGroup of changes.updated) {
        await handleEdit(`http://localhost:8383/group/edit`, updatedGroup.id, { name: updatedGroup.name })
      }

      // Delete groups
      for (const deletedId of changes.deleted) {
        await handleDelete(`http://localhost:8383/group/delete`, deletedId)
      }

      setOriginalGroups([...groupOptions])
      setChanges({ created: [], updated: [], deleted: [] })
      alert("All changes have been saved successfully.")
      setCreateGroup(false)
      if (showCreateModelBox) {
        setShowCreateModelBox(true)
      }
      if(showEditModelBox){
        setShowEditModelBox(true)
      }
      if(onSuccess) {
        onSuccess()
      }
      // setShowCreateModelBox(true)
    } catch (error) {
      console.error("Error saving changes:", error)
      alert("Failed to save changes. Please try again.")
    }
  }

 

  return (
    <div>
      <div className="bgBlur"></div>
      <div className="entryContainer groupContainer">
        <div className="modelTitle">
          <h4>Group Management</h4>
        </div>
        <div className="modelContent">
          <form >
            <div className="formGroup">
              <button type="button" onClick={handleCreateNew} className="createNewBtn createNewGroup">
                + New Group
              </button>
              <div className="groupListContainer">
                <div className="groupList">
                  {loading ? (
                    <p>Loading groups...</p>
                  ) : error ? (
                    <p>Error fetching groups.</p>
                  ) : (
                    groupOptions.map((item) => (
                      <div key={item.id} className="groupItem">
                        <div className="groupInputContainer">
                          <div
                            style={{ backgroundColor: item.color, width: "20px", height: "20px", borderRadius: "10%" }}
                          ></div>
                          <input
                            type="text"
                            value={item.name}
                            className="groupInput"
                            onChange={(e) => handleEditGroup(item.id, e.target.value)}
                          />
                        </div>
                        <div onClick={() => handleDeleteGroup(item.id)} className="deleteBtn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="30" viewBox="0 0 30 30" fill="none">
                            <path
                              d="M4.6875 7.5H8.4375V5.15625C8.4375 4.12207 9.27832 3.28125 10.3125 3.28125H19.6875C20.7217 3.28125 21.5625 4.12207 21.5625 5.15625V7.5H25.3125C25.8311 7.5 26.25 7.91895 26.25 8.4375V9.375C26.25 9.50391 26.1445 9.60938 26.0156 9.60938H24.2461L23.5225 24.9316C23.4756 25.9307 22.6494 26.7188 21.6504 26.7188H8.34961C7.34766 26.7188 6.52441 25.9336 6.47754 24.9316L5.75391 9.60938H3.98438C3.85547 9.60938 3.75 9.50391 3.75 9.375V8.4375C3.75 7.91895 4.16895 7.5 4.6875 7.5ZM10.5469 7.5H19.4531V5.39062H10.5469V7.5Z"
                              fill="#F24822"
                            />
                          </svg>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="btnContainer">
              <button type="button" onClick={handleCancel} className="cancelBtn">
                Cancel
              </button>
              <button onClick={handleSubmit}  className="saveBtn">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

