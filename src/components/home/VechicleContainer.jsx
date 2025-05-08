import React, { useEffect, useState } from 'react'
import { useFetchData } from '../HOC/UseFetchData';
import User from "../../assets/images/userImg.png";
import VehicleAdd from './VehicleAdd';
export default function VehicleContainer({id}) {
  const {data:data,refetch:refetchdata} = useFetchData(`http://localhost:8383/all/getbysiteoperationid/${id}`);
  const [detailData,setDetailData] = useState([]);
  const [clickStatus,setClickStatus] = useState(false);
  useEffect(() => {
    if(data){
      setDetailData(data)
    }
  },[data])
  // console.log(detailData);

  const validVehicle = detailData.filter(item => item.Vehicle);

  const handleVehicleAdd = async() => {
    setClickStatus(true);
  }
  return (
    <div className='staffContainer'>
      <div className='staffDetailContainer'>
        {validVehicle.length === 0 ? (
          <p>No Vehicle Assign</p>
        ) : (
          validVehicle.map((item) => (
            <div key={item.id}>
              <div className="staffImgContainer tooltip">
                <img src={item.Vehicle.image || User} alt="" className='staffImg' />
                <div className="teamColor" style={{ backgroundColor: item.Vehicle.Group?.color || '#ccc' }}></div>
                <span className='tooltiptext'>{item.Vehicle.name}</span>
              </div>            
            </div>
          ))
        )}
      </div>
      <div className='addStaffBtn' onClick={() => handleVehicleAdd(id)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="45" viewBox="0 0 50 50" fill="none">
        <rect width="50" height="50" rx="25" fill="#F27D14"/>
        <path d="M31 19H26V28H14V32H16C16 32.83 16.3 33.53 16.89 34.13C17.5 34.72 18.19 35 19 35C19.81 35 20.5 34.72 21.11 34.13C21.7 33.53 22 32.83 22 32H27.5C27.5 32.83 27.78 33.53 28.38 34.13C28.97 34.72 29.67 35 30.5 35C31.3 35 32 34.72 32.59 34.13C33.19 33.53 33.5 32.83 33.5 32H36V25L31 19ZM20.08 33.07C19.8 33.37 19.44 33.5 19 33.5C18.56 33.5 18.2 33.37 17.92 33.07C17.64 32.77 17.5 32.42 17.5 32C17.5 31.61 17.64 31.26 17.92 30.96C18.2 30.66 18.56 30.5 19 30.5C19.44 30.5 19.8 30.66 20.08 30.96C20.36 31.26 20.5 31.61 20.5 32C20.5 32.42 20.36 32.77 20.08 33.07ZM31.54 33.07C31.24 33.37 30.89 33.5 30.5 33.5C30.08 33.5 29.73 33.37 29.43 33.07C29.13 32.77 29 32.42 29 32C29 31.61 29.13 31.26 29.43 30.96C29.73 30.66 30.08 30.5 30.5 30.5C30.89 30.5 31.24 30.66 31.54 30.96C31.84 31.26 32 31.61 32 32C32 32.42 31.84 32.77 31.54 33.07ZM28 25V21H30.06L33.39 25H28Z" fill="white"/>
        <path d="M46 21.7143H40.8571V26H39.1429V21.7143H34V20.2857H39.1429V16H40.8571V20.2857H46V21.7143Z" fill="white"/>
        </svg>
      </div>
      {
        clickStatus && <VehicleAdd id={id} setClickStatus={setClickStatus} refetchdata={refetchdata}/>
      }
    </div>
  )
}
