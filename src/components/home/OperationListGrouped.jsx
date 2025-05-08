import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import StaffContainer from "./StaffContainer";
import VehicleContainer from "./VechicleContainer";

export default function OperationListGrouped(props = {}) {
  const { filteredOperations = [], handleEditModelBox = () => {} } = props;
  const [siteOperationIds, setSiteOperationIds] = useState([]);
  const [siteOperations, setSiteOperations] = useState([]);
  const [mapId, setmapId] = useState();

  const operationsGroupedBySite = useMemo(() => {
    const grouped = {};
    const idsSet = new Set();

    filteredOperations.forEach((operation) => {
      const operationDetail = operation?.SiteOperationtype;
      if (!operationDetail) return;

      const siteoperationId = operation?.siteoperationtypesId;
      if (siteoperationId) idsSet.add(siteoperationId);

      const siteId = operationDetail?.siteId;
      if (!grouped[siteId]) grouped[siteId] = [];
      grouped[siteId].push(operation);
    });
    setSiteOperationIds(Array.from(idsSet));

    return grouped;
  }, [filteredOperations]);

  const getUniqueOperations = (operations) => {
    // console.log(operations);
    const seen = new Set();
    return operations.filter((op) => {
      const detail = op?.SiteOperationtype;
      // console.log(detail);
      if (!detail) return false;

      // Create a uniqueness key
      const key = `${detail.startDate}-${detail.endDate}-${detail.workinghourStart}-${detail.workinghourEnd}-${detail.requiredStaff}-${detail.requiredVehicle}-${detail.operationtypesId}`;

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  useEffect(() => {
    const fetchOperations = async () => {
      const fetchedData = {};
      const promises = siteOperationIds.map(async (id) => {
        try {
          const response = await axios.get(
            `http://localhost:8383/all/getbysiteoperationid/${id}`
          );
          fetchedData[id] = response.data;
        } catch (err) {
          console.error(`Error fetching operation for ID ${id}`, err);
        }
      });

      await Promise.all(promises);
      setSiteOperations(fetchedData);
    };

    if (siteOperationIds.length > 0) {
      fetchOperations();
    }
  }, [siteOperationIds]);
  console.log(siteOperationIds.map((item) => item));

  useEffect(() => {
    const fetchSiteOperationData = async () => {
      // console.log(siteOperationIds);
      try {
        const promises = siteOperationIds.map((id) =>
          axios.get(`http://localhost:8383/all/getbysiteoperationid/${id}`, {
            headers: {
              "otmm-api-key": "KoaderMasters",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
          })
        );

        const responses = await Promise.all(promises);
        setSiteOperations(responses);
      } catch (error) {
        console.error("Error fetching SiteOperation data:", error);
      }
    };
    if (siteOperationIds.length > 0) fetchSiteOperationData();
  }, [siteOperationIds]);
  return (
    <>
      {Object.entries(operationsGroupedBySite).map(([siteId, operations]) => {
        const siteName =
          operations[0]?.SiteOperationtype?.Site?.name || "Unknown Site";
        //filter duplicate
        const uniqueOperations = getUniqueOperations(operations);

        return (
          <div key={siteId} className="detailContainer">
            <div className="detailHeader">
              <h3>{siteName}</h3>
              <div className="detailBtn">
                <svg
                  onClick={() => handleEditModelBox(siteId)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  viewBox="0 0 18 4"
                  fill="currentColor"
                >
                  <path
                    d="M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM16 0C14.9 0 14 0.9 14 2C14 3.1 14.9 4 16 4C17.1 4 18 3.1 18 2C18 0.9 17.1 0 16 0ZM9 0C7.9 0 7 0.9 7 2C7 3.1 7.9 4 9 4C10.1 4 11 3.1 11 2C11 0.9 10.1 0 9 0Z"
                    fill="#F27D14"
                  />
                </svg>
              </div>
            </div>

            {uniqueOperations.length > 0 ? (
              uniqueOperations.map((operation) => {
                const detail = operation?.SiteOperationtype;
                // console.log(detail);
                const type = detail?.Operationtype;
                const siteOpId = operation?.siteoperationtypesId;
                console.log(siteOpId);
                return (
                  <div
                    key={operation.siteoperationtypesId}
                    className="detailContent"
                  >
                    <div
                      className="operationDetail"
                      style={{
                        border: `2px solid ${type?.color || "#5577ff"}`,
                      }}
                    >
                      <h4 style={{ color: type?.color || "white" }}>
                        {type?.name || "Unnamed Operation"}
                        {/* <p>{operation?.siteoperationtypesId}</p> */}
                      </h4>
                      <div className="operationDetailsGrid">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M7.74998 2.5C7.74998 2.30109 7.67096 2.11032 7.53031 1.96967C7.38966 1.82902 7.19889 1.75 6.99998 1.75C6.80107 1.75 6.6103 1.82902 6.46965 1.96967C6.329 2.11032 6.24998 2.30109 6.24998 2.5V4.08C4.80998 4.195 3.86598 4.477 3.17198 5.172C2.47698 5.866 2.19498 6.811 2.07898 8.25H21.921C21.805 6.81 21.523 5.866 20.828 5.172C20.134 4.477 19.189 4.195 17.75 4.079V2.5C17.75 2.30109 17.671 2.11032 17.5303 1.96967C17.3897 1.82902 17.1989 1.75 17 1.75C16.8011 1.75 16.6103 1.82902 16.4696 1.96967C16.329 2.11032 16.25 2.30109 16.25 2.5V4.013C15.585 4 14.839 4 14 4H9.99998C9.16098 4 8.41498 4 7.74998 4.013V2.5Z"
                            fill="white"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M2 12C2 11.161 2 10.415 2.013 9.75H21.987C22 10.415 22 11.161 22 12V14C22 17.771 22 19.657 20.828 20.828C19.656 21.999 17.771 22 14 22H10C6.229 22 4.343 22 3.172 20.828C2.001 19.656 2 17.771 2 14V12ZM17 14C17.2652 14 17.5196 13.8946 17.7071 13.7071C17.8946 13.5196 18 13.2652 18 13C18 12.7348 17.8946 12.4804 17.7071 12.2929C17.5196 12.1054 17.2652 12 17 12C16.7348 12 16.4804 12.1054 16.2929 12.2929C16.1054 12.4804 16 12.7348 16 13C16 13.2652 16.1054 13.5196 16.2929 13.7071C16.4804 13.8946 16.7348 14 17 14ZM17 18C17.2652 18 17.5196 17.8946 17.7071 17.7071C17.8946 17.5196 18 17.2652 18 17C18 16.7348 17.8946 16.4804 17.7071 16.2929C17.5196 16.1054 17.2652 16 17 16C16.7348 16 16.4804 16.1054 16.2929 16.2929C16.1054 16.4804 16 16.7348 16 17C16 17.2652 16.1054 17.5196 16.2929 17.7071C16.4804 17.8946 16.7348 18 17 18ZM13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13ZM13 17C13 17.2652 12.8946 17.5196 12.7071 17.7071C12.5196 17.8946 12.2652 18 12 18C11.7348 18 11.4804 17.8946 11.2929 17.7071C11.1054 17.5196 11 17.2652 11 17C11 16.7348 11.1054 16.4804 11.2929 16.2929C11.4804 16.1054 11.7348 16 12 16C12.2652 16 12.5196 16.1054 12.7071 16.2929C12.8946 16.4804 13 16.7348 13 17ZM7 14C7.26522 14 7.51957 13.8946 7.70711 13.7071C7.89464 13.5196 8 13.2652 8 13C8 12.7348 7.89464 12.4804 7.70711 12.2929C7.51957 12.1054 7.26522 12 7 12C6.73478 12 6.48043 12.1054 6.29289 12.2929C6.10536 12.4804 6 12.7348 6 13C6 13.2652 6.10536 13.5196 6.29289 13.7071C6.48043 13.8946 6.73478 14 7 14ZM7 18C7.26522 18 7.51957 17.8946 7.70711 17.7071C7.89464 17.5196 8 17.2652 8 17C8 16.7348 7.89464 16.4804 7.70711 16.2929C7.51957 16.1054 7.26522 16 7 16C6.73478 16 6.48043 16.1054 6.29289 16.2929C6.10536 16.4804 6 16.7348 6 17C6 17.2652 6.10536 17.5196 6.29289 17.7071C6.48043 17.8946 6.73478 18 7 18Z"
                            fill="white"
                          />
                        </svg>
                        <p>
                          {dayjs(detail?.startDate).format("D-M-YYYY")} ~{" "}
                          {dayjs(detail?.endDate).format("D-M-YYYY")}
                        </p>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M10.59 18.9611L10.5796 18.9629L10.5123 18.9936L10.4933 18.9971L10.48 18.9936L10.4127 18.9629C10.4026 18.96 10.395 18.9614 10.3899 18.9673L10.3861 18.9761L10.37 19.3516L10.3748 19.3691L10.3842 19.3805L10.4829 19.4455L10.4971 19.449L10.5085 19.4455L10.6071 19.3805L10.6185 19.3665L10.6223 19.3516L10.6062 18.9769C10.6036 18.9676 10.5983 18.9623 10.59 18.9611ZM10.8413 18.862L10.829 18.8637L10.6536 18.9453L10.6441 18.9541L10.6412 18.9638L10.6583 19.3411L10.6631 19.3516L10.6706 19.3577L10.8613 19.4393C10.8733 19.4423 10.8824 19.4399 10.8888 19.4323L10.8926 19.42L10.8603 18.8813C10.8572 18.8708 10.8508 18.8643 10.8413 18.862ZM10.1633 18.8637C10.1591 18.8614 10.1541 18.8606 10.1493 18.8616C10.1446 18.8626 10.1404 18.8653 10.1377 18.869L10.132 18.8813L10.0997 19.42C10.1004 19.4306 10.1057 19.4376 10.1159 19.4411L10.1301 19.4393L10.3207 19.3577L10.3302 19.3507L10.334 19.3411L10.3501 18.9638L10.3473 18.9532L10.3378 18.9445L10.1633 18.8637Z"
                            fill="white"
                          />
                          <path
                            d="M10.0278 0.309082C15.2694 0.309082 19.5183 4.23727 19.5183 9.08323C19.5183 13.9292 15.2694 17.8574 10.0278 17.8574C4.78613 17.8574 0.537201 13.9292 0.537201 9.08323C0.537201 4.23727 4.78613 0.309082 10.0278 0.309082ZM10.0278 2.06391C8.01413 2.06391 6.08295 2.80344 4.65909 4.11982C3.23523 5.4362 2.43531 7.22159 2.43531 9.08323C2.43531 10.9449 3.23523 12.7303 4.65909 14.0466C6.08295 15.363 8.01413 16.1025 10.0278 16.1025C12.0414 16.1025 13.9726 15.363 15.3964 14.0466C16.8203 12.7303 17.6202 10.9449 17.6202 9.08323C17.6202 7.22159 16.8203 5.4362 15.3964 4.11982C13.9726 2.80344 12.0414 2.06391 10.0278 2.06391ZM10.0278 3.81874C10.2602 3.81877 10.4846 3.89767 10.6583 4.04048C10.832 4.18328 10.943 4.38007 10.9702 4.5935L10.9768 4.69616V8.71998L13.5459 11.0951C13.7161 11.253 13.815 11.4649 13.8223 11.6877C13.8297 11.9106 13.745 12.1276 13.5855 12.2948C13.4261 12.462 13.2037 12.5668 12.9637 12.588C12.7237 12.6091 12.4839 12.545 12.2932 12.4086L12.204 12.3358L9.35679 9.70356C9.20928 9.56707 9.11455 9.38945 9.08725 9.19817L9.07871 9.08323V4.69616C9.07871 4.46345 9.1787 4.24028 9.35669 4.07573C9.53467 3.91118 9.77606 3.81874 10.0278 3.81874Z"
                            fill="white"
                          />
                        </svg>
                        <p>
                          {detail?.workinghourStart}AM ~{" "}
                          {detail?.workinghourEnd}PM
                        </p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          viewBox="0 0 25 25"
                          fill="currentColor"
                        >
                          <path
                            d="M12.5002 15.625C17.1043 15.625 20.8335 17.4896 20.8335 19.7917V21.875H4.16683V19.7917C4.16683 17.4896 7.896 15.625 12.5002 15.625ZM16.6668 9.37504C16.6668 10.4801 16.2278 11.5399 15.4464 12.3213C14.665 13.1027 13.6052 13.5417 12.5002 13.5417C11.3951 13.5417 10.3353 13.1027 9.55388 12.3213C8.77248 11.5399 8.3335 10.4801 8.3335 9.37504M13.021 2.08337C13.3335 2.08337 13.5418 2.30212 13.5418 2.60421V5.72921H14.5835V3.12504C14.5835 3.12504 16.9272 4.02087 16.9272 7.03129C16.9272 7.03129 17.7085 7.17712 17.7085 8.33337H7.29183C7.34391 7.17712 8.07308 7.03129 8.07308 7.03129C8.07308 4.02087 10.4168 3.12504 10.4168 3.12504V5.72921H11.4585V2.60421C11.4585 2.30212 11.6564 2.08337 11.9793 2.08337H13.021Z"
                            fill="currentColor"
                          />
                        </svg>
                        <p>{detail?.requiredStaff}</p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          viewBox="0 0 20 15"
                          fill="none"
                        >
                          <path
                            d="M15.2746 0.224243H10.8396V8.12098H0.195557V11.6306H1.96956C1.96956 12.3589 2.23566 12.9731 2.75899 13.4995C3.30006 14.0172 3.91209 14.2629 4.63056 14.2629C5.34903 14.2629 5.96106 14.0172 6.50213 13.4995C7.02546 12.9731 7.29156 12.3589 7.29156 11.6306H12.1701C12.1701 12.3589 12.4184 12.9731 12.9506 13.4995C13.474 14.0172 14.0949 14.2629 14.8311 14.2629C15.5407 14.2629 16.1616 14.0172 16.6849 13.4995C17.2171 12.9731 17.4921 12.3589 17.4921 11.6306H19.7096V5.48873L15.2746 0.224243ZM5.58852 12.5695C5.34016 12.8327 5.02084 12.9468 4.63056 12.9468C4.24028 12.9468 3.92096 12.8327 3.6726 12.5695C3.42424 12.3062 3.30006 11.9991 3.30006 11.6306C3.30006 11.2884 3.42424 10.9813 3.6726 10.7181C3.92096 10.4549 4.24028 10.3145 4.63056 10.3145C5.02084 10.3145 5.34016 10.4549 5.58852 10.7181C5.83688 10.9813 5.96106 11.2884 5.96106 11.6306C5.96106 11.9991 5.83688 12.3062 5.58852 12.5695ZM15.7536 12.5695C15.4875 12.8327 15.177 12.9468 14.8311 12.9468C14.4585 12.9468 14.1481 12.8327 13.882 12.5695C13.6159 12.3062 13.5006 11.9991 13.5006 11.6306C13.5006 11.2884 13.6159 10.9813 13.882 10.7181C14.1481 10.4549 14.4585 10.3145 14.8311 10.3145C15.177 10.3145 15.4875 10.4549 15.7536 10.7181C16.0197 10.9813 16.1616 11.2884 16.1616 11.6306C16.1616 11.9991 16.0197 12.3062 15.7536 12.5695ZM12.6136 5.48873V1.97907H14.4408L17.3945 5.48873H12.6136Z"
                            fill="white"
                          />
                        </svg>
                        <p>{detail?.requiredVehicle}</p>
                      </div>
                    </div>
                    <div className="staffVehicleDetail">
                        <StaffContainer id={operation?.siteoperationtypesId} />
                        <VehicleContainer id= {operation?.siteoperationtypesId}/>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No Operation found!</p>
            )}
          </div>
        );
      })}
    </>
  );
}
