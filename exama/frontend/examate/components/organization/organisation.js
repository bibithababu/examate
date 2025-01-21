"use client";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./organization.css";
import { React, useState, useEffect } from "react";
import { FaBuilding } from "react-icons/fa";
import { fetchConsumersDetails } from "@/services/ApiServices";

export default function Organization() {
  const [organizationData, setOrganizationData] = useState([]);

  useEffect(() => {
    const fetchOrganisation = async () => {
      try {
        const response = await fetchConsumersDetails(
          "/examate/organization/users"
        );
        setOrganizationData(response.data.results);
        console.log("organisation", response.data.results);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchOrganisation();
  }, []);

  return (
    <div>
      <div className="progress-div" style={{ marginTop: "1%%" }}>
        &nbsp; &nbsp; &nbsp;<h5 style={{color:'#05004E'}}><strong>Organizations</strong> </h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    
          
        <table
          className={styles.progressBarTable}
          style={{ width: "100%", height: "50%" }}
        >
          <thead className="text" style={{ color: "GrayText" }}>
         
          </thead>
          <tbody
            className="text"
            style={{ color: "black", fontSize: "medium", textAlign: "left" }}
          >
            {organizationData.slice(0, 3).map((user, index) => (
              <tr key={user.id}>
                <td>
                  <FaBuilding color="BF83FF" size="1.2em" />
                </td>
                <td style={{ padding: "5%" }}>{user.username}</td>
                <td style={{ padding: "5%" }}>{user.date_joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
