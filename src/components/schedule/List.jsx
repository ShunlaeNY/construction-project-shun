import React, { useMemo, useState } from 'react'
import SchedularDate from '../HOC/buttons/SchedularDate'
import "../../assets/styles/scheduleList.scss"
import Site from './Site'
import Staff from './Staff'
import Vehicle from './Vehicle'
import dayjs from 'dayjs'

export default function List() {
  const [siteview,setSiteView] = useState(true)
  const [staffview,setStaffView] = useState(false)
  const [vehicleview,setVehicleView] = useState(false)

  // Add state for date range
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().startOf("month"),
    endDate: dayjs().endOf("month"),
    view: "month",
  })

  const memoizedDateRange = useMemo(() => dateRange, [dateRange]);


  const handleSiteView = () => {
    setSiteView(true)
    setStaffView(false)
    setVehicleView(false)
  }
  const handleStaffView = () => {
    setSiteView(false)
    setStaffView(true)
    setVehicleView(false)
  }
  const handleVehicleView = () => {
    setSiteView(false)
    setStaffView(false)
    setVehicleView(true)
  }

  const handleDataRangeChange = (start, end, view) => {
    // setDateRange({ startDate: start, endDate: end, view: view })
    setDateRange((prev) => {
      if (
        prev.startDate.isSame(start) &&
        prev.endDate.isSame(end) &&
        prev.view === view
      ) {
        return prev; // Prevent unnecessary re-render
      }
      return { startDate: start, endDate: end, view };
    });
  }
  return (
    <div className='scheduleListContainer'>
        <SchedularDate onDateRangeChange={handleDataRangeChange}/>
        <div></div>
        <div className='data'>
          {siteview && <Site dateRange={memoizedDateRange}/>}
          {staffview && <Staff dateRange={memoizedDateRange}/>}
          {vehicleview && <Vehicle dateRange={memoizedDateRange}/>}
        </div>
        <div className='viewByContainer'>
            <div className={`viewBy ${siteview ? "activeView" : ""}`}
 onClick={handleSiteView}>
              {/* site */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                viewBox="0 0 28 28"
                fill="currentColor"
              >
                <path
                  d="M5.94998 24.5L12.3375 18.1125L9.88748 15.6625L3.49998 22.05L5.94998 24.5ZM22.05 24.5L24.5 22.05L16.45 14L18.4333 12.0167L19.25 12.8333L20.7375 11.3458V13.7375L21.5541 14.5542L25.0833 11.025L24.2666 10.2083H21.875L23.3333 8.74999L19.1916 4.60833C18.8028 4.21944 18.3847 3.93749 17.9375 3.76249C17.4903 3.58749 17.0333 3.49999 16.5666 3.49999C16.1 3.49999 15.643 3.58749 15.1958 3.76249C14.7486 3.93749 14.3305 4.21944 13.9416 4.60833L16.625 7.29166L15.1666 8.74999L15.9833 9.56666L14 11.55L11.375 8.92499C11.4528 8.7111 11.5158 8.48749 11.564 8.25416C11.6122 8.02083 11.6367 7.78749 11.6375 7.55416C11.6375 6.40694 11.2435 5.43938 10.4556 4.65149C9.66776 3.8636 8.70059 3.47005 7.55415 3.47083C7.26248 3.47083 6.9852 3.49999 6.72231 3.55833C6.45942 3.61666 6.19226 3.70416 5.92081 3.82083L8.80831 6.70833L6.70831 8.80833L3.82081 5.92083C3.6847 6.19305 3.59215 6.46022 3.54315 6.72233C3.49415 6.98444 3.47003 7.26172 3.47081 7.55416C3.47081 8.70138 3.86437 9.66894 4.65148 10.4568C5.43859 11.2447 6.40615 11.6383 7.55415 11.6375C7.78748 11.6375 8.02081 11.618 8.25415 11.5792C8.48748 11.5403 8.71109 11.4722 8.92498 11.375L22.05 24.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className={`viewBy ${staffview ? "activeView" : ""}`} onClick={handleStaffView}>
              {/* staff */}
              <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 0 25 25"
                      fill="currentColor"
                    >
                      <path
                        d="M12.5002 15.625C17.1043 15.625 20.8335 17.4896 20.8335 19.7917V21.875H4.16683V19.7917C4.16683 17.4896 7.896 15.625 12.5002 15.625ZM16.6668 9.37504C16.6668 10.4801 16.2278 11.5399 15.4464 12.3213C14.665 13.1027 13.6052 13.5417 12.5002 13.5417C11.3951 13.5417 10.3353 13.1027 9.55388 12.3213C8.77248 11.5399 8.3335 10.4801 8.3335 9.37504M13.021 2.08337C13.3335 2.08337 13.5418 2.30212 13.5418 2.60421V5.72921H14.5835V3.12504C14.5835 3.12504 16.9272 4.02087 16.9272 7.03129C16.9272 7.03129 17.7085 7.17712 17.7085 8.33337H7.29183C7.34391 7.17712 8.07308 7.03129 8.07308 7.03129C8.07308 4.02087 10.4168 3.12504 10.4168 3.12504V5.72921H11.4585V2.60421C11.4585 2.30212 11.6564 2.08337 11.9793 2.08337H13.021Z"
                        fill="currentColor"
                      />
              </svg>
            </div>
            <div className={`viewBy ${vehicleview ? "activeView" : ""}`} onClick={handleVehicleView}>
              {/* vehicle */}
              <svg xmlns="http://www.w3.org/2000/svg" height="20" width={18} viewBox="0 0 20 15" fill="currentColor" >
                    <path d="M15.2746 0.224243H10.8396V8.12098H0.195557V11.6306H1.96956C1.96956 12.3589 2.23566 12.9731 2.75899 13.4995C3.30006 14.0172 3.91209 14.2629 4.63056 14.2629C5.34903 14.2629 5.96106 14.0172 6.50213 13.4995C7.02546 12.9731 7.29156 12.3589 7.29156 11.6306H12.1701C12.1701 12.3589 12.4184 12.9731 12.9506 13.4995C13.474 14.0172 14.0949 14.2629 14.8311 14.2629C15.5407 14.2629 16.1616 14.0172 16.6849 13.4995C17.2171 12.9731 17.4921 12.3589 17.4921 11.6306H19.7096V5.48873L15.2746 0.224243ZM5.58852 12.5695C5.34016 12.8327 5.02084 12.9468 4.63056 12.9468C4.24028 12.9468 3.92096 12.8327 3.6726 12.5695C3.42424 12.3062 3.30006 11.9991 3.30006 11.6306C3.30006 11.2884 3.42424 10.9813 3.6726 10.7181C3.92096 10.4549 4.24028 10.3145 4.63056 10.3145C5.02084 10.3145 5.34016 10.4549 5.58852 10.7181C5.83688 10.9813 5.96106 11.2884 5.96106 11.6306C5.96106 11.9991 5.83688 12.3062 5.58852 12.5695ZM15.7536 12.5695C15.4875 12.8327 15.177 12.9468 14.8311 12.9468C14.4585 12.9468 14.1481 12.8327 13.882 12.5695C13.6159 12.3062 13.5006 11.9991 13.5006 11.6306C13.5006 11.2884 13.6159 10.9813 13.882 10.7181C14.1481 10.4549 14.4585 10.3145 14.8311 10.3145C15.177 10.3145 15.4875 10.4549 15.7536 10.7181C16.0197 10.9813 16.1616 11.2884 16.1616 11.6306C16.1616 11.9991 16.0197 12.3062 15.7536 12.5695ZM12.6136 5.48873V1.97907H14.4408L17.3945 5.48873H12.6136Z" fill="currentColor"/>
              </svg>
            </div>
        </div>
    </div>
  )
}

