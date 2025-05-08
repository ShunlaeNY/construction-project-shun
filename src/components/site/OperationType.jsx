import { useEffect, useState } from "react";
import { useFetchData } from "../HOC/UseFetchData";
import { useCRUD } from "../HOC/UseCRUD";
import "./operationType.scss";

import { useNavigate } from "react-router-dom";

export default function OprationType({
  createOperation,
  setCreateOperation,
  operationOptions,
  setOperationOptions,
  onOperationCreated,
  showCreateModelBox,
  showEditModelBox,
  setShowCreateModelBox,
  setShowEditModelBox,
  onSuccess,
  loading,
  error,
}) {
  console.log("Operation Options from Op", operationOptions);
  const { handleCreate, handleEdit, handleDelete } = useCRUD();
  const [hasAddedNewOperation, setHasAddedNewOperation] = useState(false);
  const [changes, setChanges] = useState({
    created: [],
    updated: [],
    deleted: [],
  });
  const [originalOperations, setOriginalOperations] = useState([]);

  const colors = [
    "red",
    "blue",
    "green",
    "orange",
    "lightblue",
    "lightgreen",
    "gray",
    "whitesmoke",
  ];
  const navigate = useNavigate();

  useEffect(() => {
    setOriginalOperations([...operationOptions]);
  }, [operationOptions]);

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleCreateNew = () => {
    if (hasAddedNewOperation) {
      alert(
        "You can only add one new operation at a time. Please save your changes first."
      );
      return;
    }

    const newOperation = {
      id: `temp-${Date.now()}`, // Temporary ID
      name: `New Operation ${operationOptions.length + 1}`,
      color: getRandomColor(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setOperationOptions((prevOperations) => [...prevOperations, newOperation]);
    setChanges((prev) => ({
      ...prev,
      created: [...prev.created, newOperation],
    }));
    setHasAddedNewOperation(true);
  };

  const handleEditOperation = (id, newName) => {
    setOperationOptions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name: newName } : t))
    );
    setChanges((prev) => {
      const isNewOperation = prev.created.some((t) => t.id === id);
      if (isNewOperation) {
        return {
          ...prev,
          created: prev.created.map((t) =>
            t.id === id ? { ...t, name: newName } : t
          ),
        };
      } else {
        return {
          ...prev,
          updated: [
            ...prev.updated.filter((t) => t.id !== id),
            { id, name: newName },
          ],
        };
      }
    });
  };

  const handleDeleteOperation = (id) => {
    setOperationOptions((prev) => prev.filter((t) => t.id !== id));
    setChanges((prev) => {
      const isNewOperation = prev.created.some((t) => t.id === id);
      if (isNewOperation) {
        return {
          ...prev,
          created: prev.created.filter((t) => t.id !== id),
        };
      } else {
        return {
          ...prev,
          deleted: [...prev.deleted, id],
          updated: prev.updated.filter((t) => t.id !== id),
        };
      }
    });
    setHasAddedNewOperation(false);
  };

  const handleCancel = () => {
    const filteredOperations = originalOperations.filter(
      (operation) =>
        typeof operation.id !== "string" ||
        !String(operation.id).startsWith("temp-")
    );
    setChanges({ created: [], updated: [], deleted: [] });
    setHasAddedNewOperation(false);
    setOperationOptions([...filteredOperations]);
    console.log(operationOptions);
    setCreateOperation(false);
    if (showCreateModelBox) {
      setShowCreateModelBox(true);
    }
    if (showEditModelBox) {
      setShowEditModelBox(true);
    }
    // navigate("/staff/entry")
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form Submitted:", teamOptions);
    try {
      // Create new groups
      for (const newOperation of changes.created) {
        await handleCreate(
          `http://localhost:8383/operationtypes/add`,
          newOperation
        );
      }

      // Update existing groups
      for (const updatedOperation of changes.updated) {
        await handleEdit(
          `http://localhost:8383/operationtypes/edit`,
          updatedOperation.id,
          {
            name: updatedOperation.name,
          }
        );
      }

      // Delete groups
      for (const deletedId of changes.deleted) {
        await handleDelete(
          `http://localhost:8383/operationtypes/delete`,
          deletedId
        );
      }

      setOriginalOperations([...operationOptions]);
      setChanges({ created: [], updated: [], deleted: [] });
      alert("All changes have been saved successfully.");

      setCreateOperation(false);
      if (showCreateModelBox) {
        setShowCreateModelBox(true);
      }
      if (showEditModelBox) {
        setShowEditModelBox(true);
      }
      if (onSuccess) {
        onSuccess();
      }
      // navigate("/staff/entry")
      // setShowCreateModelBox(true)
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  return (
    <div>
      <div className="bgBlur"></div>
      <div className="entryContainer  operationTypeContainer">
        <div className="modelTitle">
          <h4>Operation Management</h4>
        </div>
        <div className="modelContent">
          <form>
            <div className="formGroup">
              <button
                type="button"
                onClick={handleCreateNew}
                className="createNewBtn createNewTeam"
              >
                + New Operation
              </button>
              <div className="teamListContainer">
                <div className="teamList">
                  {/* {loading ? (
                    <p>Loading teams...</p>
                  ) : error ? (
                    <p>Error fetching teams.</p>
                  ) : ( */}
                  {operationOptions.map((item) => (
                    <div key={item.id} className="teamItem">
                      <div className="teamInputContainer">
                        <div
                          style={{
                            backgroundColor: item.color,
                            width: "20px",
                            height: "20px",
                            borderRadius: "10%",
                          }}
                        ></div>
                        <input
                          type="text"
                          value={item.name}
                          className="teamInput"
                          onChange={(e) =>
                            handleEditOperation(item.id, e.target.value)
                          }
                        />
                      </div>
                      <div
                        onClick={() => handleDeleteOperation(item.id)}
                        className="deleteBtn"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          viewBox="0 0 30 30"
                          fill="none"
                        >
                          <path
                            d="M4.6875 7.5H8.4375V5.15625C8.4375 4.12207 9.27832 3.28125 10.3125 3.28125H19.6875C20.7217 3.28125 21.5625 4.12207 21.5625 5.15625V7.5H25.3125C25.8311 7.5 26.25 7.91895 26.25 8.4375V9.375C26.25 9.50391 26.1445 9.60938 26.0156 9.60938H24.2461L23.5225 24.9316C23.4756 25.9307 22.6494 26.7188 21.6504 26.7188H8.34961C7.34766 26.7188 6.52441 25.9336 6.47754 24.9316L5.75391 9.60938H3.98438C3.85547 9.60938 3.75 9.50391 3.75 9.375V8.4375C3.75 7.91895 4.16895 7.5 4.6875 7.5ZM10.5469 7.5H19.4531V5.39062H10.5469V7.5Z"
                            fill="#F24822"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="btnContainer">
              <button
                type="button"
                onClick={handleCancel}
                className="cancelBtn"
              >
                Cancel
              </button>
              <button onClick={handleSubmit} className="saveBtn">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
