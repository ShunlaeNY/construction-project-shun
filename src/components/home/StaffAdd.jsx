import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchData } from "../HOC/UseFetchData";
import { useCRUD } from "../HOC/UseCRUD";
import Search from "../HOC/searchAndFilter/Search";
import axios from "axios";
import "./StaffAdd.scss";

export default function StaffAdd({ id, setClickStatus,refetchdata }) {
  const navigate = useNavigate();
  const handleCancel = () => {
    setClickStatus(false);
  };

  const { deleteStatus } = useCRUD();
  const { data: Staffs } = useFetchData(
    "http://localhost:8383/staff/list",
    deleteStatus
  );
  const { data: Teams } = useFetchData(
    "http://localhost:8383/team/list",
    deleteStatus
  );
  const { data: selectedStaffs } = useFetchData(
    `http://localhost:8383/all/getbysiteoperationid/${id}`,
    deleteStatus
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState([]);

  useEffect(() => {
    if (selectedStaffs) {
      setSelectedStaff(selectedStaffs);
    }
  }, [selectedStaffs]);

  const addToPreview = (staff) => {
    setSelectedStaff((prev) => {
      const exists = prev.some((s) => s.Staff?.id === staff.id);
      if (exists) {
        console.log("Staff already exists! Not adding.");
        return prev;
      }
      return [...prev, { Staff: staff }];
    });
  };

  // Remove staff from preview
  const removeFromPreview = (id) => {
    setSelectedStaff((prev) => prev.filter((staff) => staff.Staff?.id !== id));
  };

  const filteredStaffs = Staffs.filter((staff) => {
    const query = searchQuery.toLowerCase();
    return (
      staff.name.toLowerCase().includes(query) ||
      staff.position.toLowerCase().includes(query)
    );
  });


  const handleSave = async () => {
    try {
      const originalStaffIds = selectedStaffs
        .filter(staff => staff.Staff?.id)
        .map(staff => staff.id);
      
      const currentStaffIds = selectedStaff
        .filter(staff => staff.Staff?.id)
        .map(staff => staff.id);

      const staffIdsToDelete = originalStaffIds.filter(id => !currentStaffIds.includes(id));

      const deleteRequests = staffIdsToDelete.map(id => {
        return axios.delete(
          `http://localhost:8383/all/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
          }
        ).catch(error => {
          console.error(`Failed to delete staff assignment with ID ${id}:`, error);
          return { status: 500, error }; 
        });
      });
      
      const addRequests = selectedStaff
        .filter((staff) => staff.Staff?.id)
        .map((staff) => {
          const payload = {
            siteoperationtypesId: id,
            staffId: staff.Staff.id,
            vehicleId: staff.Vehicle ? staff.Vehicle.id : null,
          };
  
          console.log("Payload to send:", payload);
  
          return axios.post(
            "http://localhost:8383/all/add",
            payload,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
              },
            }
          ).then(response => {
            return { success: true, data: response.data };
          }).catch(error => {
            if (error.response && 
                error.response.status === 400 && 
                error.response.data.error.includes("already exists")) {
              console.log("Skipping duplicate:", payload);
              return { success: true, skipped: true }; 
            }

            return { success: false, error: error };
          });
        });
      const allResults = await Promise.all([...deleteRequests, ...addRequests]);
      
      const errors = allResults.filter(result => 
        result.status === 500 || (result.success === false)
      );
      
      if (errors.length === 0) {
        setClickStatus(false); 
        refetchdata();
        
        console.log(`Staff updated successfully: ${staffIdsToDelete.length} deleted, ${addRequests.length} added/updated.`);
      } else {
        throw new Error(`${errors.length} requests failed.`);
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      alert(`Failed to update staff. Error: ${error.message}`);
    }
  };
  
  return (
    <>
      <div className="bgBlur"></div>
      <div className="entryContainer homeAddContainer">
        <div className="modelTitle">
          <h4>
            {selectedStaff[0]?.SiteOperationtype?.Site?.name ? selectedStaff[0]?.SiteOperationtype?.Site?.name : ""}
            {console.log(selectedStaff)}
          </h4>
        </div>

        <div className="modelContent">
          <div className="current">
            {/* <div className="searchBox"></div> */}
            <div className="singleAddContainer">
              {selectedStaff.filter((staff) => staff.Staff)
              .map((staff) => {
                // console.log(staff);
                const team =
                  Teams?.find((team) => team.id === staff.Staff?.teamId) || {};
                return (
                  <div
                    key={staff.Staff?.id}
                    className="singleAddData"
                    style={{ borderLeft: `5px solid ${team.color || "gray"}` }}
                  >
                    <div className="flexRow">
                    <img
                      src={staff.Staff?.image || "/default-avatar.png"}
                      alt={staff.Staff?.name}
                      width="30px"
                      height="30px"
                      style={{ borderRadius: "50%" }}
                    />
                    <div className="data">
                      <p className="staffName">{staff.Staff?.name} </p>
                      <small className="staffPosition">{staff.Staff?.position}</small>
                    </div>
                    </div>
                    <div className="close">
                      <svg
                        onClick={() => removeFromPreview(staff.Staff?.id)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        viewBox="0 0 17 17"
                        fill="none"
                      >
                        <path
                          d="M16 1L1 16M1 1L16 16"
                          stroke="#FF7B04"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="new">
            <Search
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
            />

            <div className="singleAddContainer">
              {filteredStaffs
              .filter((staff) => staff && staff.name)
              .map((staff) => {
                const team =
                  Teams?.find((team) => team.id === staff.teamId) || {};
                const isSelected = selectedStaff.some(
                  (s) => s.Staff?.id === staff.id
                ); 

                return (
                  <div
                    key={staff.id}
                    className={`singleAddData ${isSelected ? "disabled" : ""}`}
                    style={{
                      borderLeft: `5px solid ${team.color || "gray"}`,
                      cursor: isSelected ? "not-allowed" : "pointer",
                      opacity: isSelected ? 0.5 : 1,
                    }}
                    onClick={() => !isSelected && addToPreview(staff)}
                  >
                    <div className="flexRow">
                    <img
                      src={staff.image || "/default-avatar.png"}
                      alt={staff.name || ""}
                      width="30px"
                      height="30px"
                      style={{ borderRadius: "50%" }}
                    />
                    <div className="data">
                      { staff.name && <p className="staffName">{staff.name}</p>}
                      {staff.position && <small className="staffPosition">{staff.position}</small>}
                    </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="btnGp">
          <button type="button" onClick={handleCancel} className="cancelBtn">
            Cancel
          </button>
          <button className="saveBtn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </>
  );
}
