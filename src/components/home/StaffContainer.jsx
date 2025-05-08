import React, { useEffect, useState } from 'react'
import { useFetchData } from '../HOC/UseFetchData';
import User from "../../assets/images/userImg.png";
import StaffAdd from './StaffAdd';
export default function StaffContainer({id}) {
  const {data:data,refetch:refetchdata} = useFetchData(`http://localhost:8383/all/getbysiteoperationid/${id}`);
  const [detailData,setDetailData] = useState([]);
  const [clickStatus,setClickStatus] = useState(false);
  useEffect(() => {
    if(data){
      setDetailData(data)
    }
  },[data])
  // console.log(detailData);

  const validStaff = detailData.filter(item => item.Staff);

  const handleStaffAdd = async() => {
    setClickStatus(true);
  }
  return (
    <div className='staffContainer'>
      <div className='staffDetailContainer'>
        {validStaff.length === 0 ? (
          <p>No Staff Assign</p>
        ) : (
          validStaff.map((item) => (
            <div key={item.id}>
              <div className="staffImgContainer tooltip">
                <img src={item.Staff.image || User} alt="" className='staffImg' />
                <div className="teamColor" style={{ backgroundColor: item.Staff.Team?.color || '#ccc' }}></div>
                <span className='tooltiptext'>{item.Staff.name}</span>
              </div>            
            </div>
          ))
        )}
      </div>
      <div className='addStaffBtn' onClick={() => handleStaffAdd(id)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="45" viewBox="0 0 50 50" fill="none">
  <rect width="50" height="50" rx="25" fill="#F27D14"/>
  <path d="M15.5625 35.5C15.5625 35.5 14 35.5 14 33.625C14 31.75 15.5625 26.125 23.375 26.125C31.1875 26.125 32.75 31.75 32.75 33.625C32.75 35.5 31.1875 35.5 31.1875 35.5H15.5625ZM23.375 24.25C24.6182 24.25 25.8105 23.6574 26.6896 22.6025C27.5686 21.5476 28.0625 20.1168 28.0625 18.625C28.0625 17.1332 27.5686 15.7024 26.6896 14.6475C25.8105 13.5926 24.6182 13 23.375 13C22.1318 13 20.9395 13.5926 20.0604 14.6475C19.1814 15.7024 18.6875 17.1332 18.6875 18.625C18.6875 20.1168 19.1814 21.5476 20.0604 22.6025C20.9395 23.6574 22.1318 24.25 23.375 24.25Z" fill="white"/>
  <path fillRule="evenodd" clipRule="evenodd" d="M35.0938 18.625C35.301 18.625 35.4997 18.7238 35.6462 18.8996C35.7927 19.0754 35.875 19.3139 35.875 19.5625V22.375H38.2188C38.426 22.375 38.6247 22.4738 38.7712 22.6496C38.9177 22.8254 39 23.0639 39 23.3125C39 23.5611 38.9177 23.7996 38.7712 23.9754C38.6247 24.1512 38.426 24.25 38.2188 24.25H35.875V27.0625C35.875 27.3111 35.7927 27.5496 35.6462 27.7254C35.4997 27.9012 35.301 28 35.0938 28C34.8865 28 34.6878 27.9012 34.5413 27.7254C34.3948 27.5496 34.3125 27.3111 34.3125 27.0625V24.25H31.9688C31.7615 24.25 31.5628 24.1512 31.4163 23.9754C31.2698 23.7996 31.1875 23.5611 31.1875 23.3125C31.1875 23.0639 31.2698 22.8254 31.4163 22.6496C31.5628 22.4738 31.7615 22.375 31.9688 22.375H34.3125V19.5625C34.3125 19.3139 34.3948 19.0754 34.5413 18.8996C34.6878 18.7238 34.8865 18.625 35.0938 18.625Z" fill="white"/>
        </svg>
      </div>
      {
        clickStatus && <StaffAdd id={id} setClickStatus={setClickStatus} refetchdata={refetchdata}/>
      }
    </div>
  )
}
