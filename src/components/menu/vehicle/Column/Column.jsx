import React, { useState } from "react";
import { Task } from "../Task/Task";
import Entry from "../Entry"; // Import modal component
import "./column.scss";
import { useNavigate } from "react-router-dom";

export default function Column({ tasks, refetchVehicles }) {
  const [showEditModelBox, setShowEditModelBox] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const navigate = useNavigate();

  const handleEditModelBox = async(id) => {
    
    setShowEditModelBox(true); 
    console.log("Editing task:", id);
    setSelectedTaskId(id); 
    // navigate(`/vehicle/edit/${id}`)
  };

  const closeModal = () => {
    setSelectedTaskId(null); // Reset when closing modal
    // Refresh the data when modal is closed
    if (refetchVehicles) {
      refetchVehicles()
    }
  };

  return (
    <div className="scrollable">
      <div className="vehicleListData">
        {tasks.map((task) => (
          <Task
            key={task.id}
            id={task.id}
            image={task.image}
            name={task.name}
            groupId={task.groupId}
            inspectionExpiry={task.inspectionExpiry}
            insuranceExpiry={task.insuranceExpiry}
            status={task.status}
            onSuccess = {refetchVehicles}
            onClick={() => handleEditModelBox(task.id)} // Pass function correctly
          />
        ))}
      </div>

      {/* Show Modal Only When a Task is Selected */}
      {showEditModelBox && (
        <Entry showEditModelBox={showEditModelBox} setShowEditModelBox={setShowEditModelBox} id={selectedTaskId} onSuccess={refetchVehicles}/>
      )}
    </div>
  );
}