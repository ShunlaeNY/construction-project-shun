import React, { useState } from "react";
import { Task } from "../Task/Task";
import Entry from "../Entry"; // Import modal component
import "./column.scss";
import { useNavigate } from "react-router-dom";

export default function Column({ tasks,refetchBusinessPartners }) {
  const [showEditModelBox, setShowEditModelBox] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const navigate = useNavigate();

  const handleEditModelBox = (id) => {
    console.log("Editing task:", id);
    setShowEditModelBox(true); // Show modal when editing task
    setSelectedTaskId(id); // Store selected task details
    // navigate(`/business-partner/edit/${id}`) // Navigate to edit page with selected task id
  };

  const closeModal = () => {
    setSelectedTaskId(null); // Reset when closing modal
    if(refetchBusinessPartners){
      refetchBusinessPartners();
    }
  };

  return (
    <div className="scrollable">
      <div className="businessPartnerListData">
        {tasks.map((task) => (
          <Task
            key={task.id}
            id={task.id}
            name={task.name}
            image= {task.image}
            email={task.email}
            phonenumber={task.phonenumber}
            staffId={task.staffId}
            onSuccess={refetchBusinessPartners}
            onClick={() => handleEditModelBox(task.id)} // Pass function correctly
          />
        ))}
      </div>

      {/* Show Modal Only When a Task is Selected */}
      {showEditModelBox && (
        <Entry showEditModelBox={showEditModelBox} setShowEditModelBox={setShowEditModelBox} id={selectedTaskId} onSuccess={refetchBusinessPartners}/>
      )}
    </div>
  );
}


