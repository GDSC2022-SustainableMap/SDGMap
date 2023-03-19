import {
  MDBInputGroup,
  MDBInput,
  MDBIcon,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { useState } from "react";
import useToken from "../../hooks/token";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function SearchFriends() {
  const { getToken, removeToken } = useToken();
  const [searchData, setSearchData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let rawResponse;
  const searchUser = async () => {
    console.log(searchText);
    try {
      let t = getToken();
      setLoading(true);
      rawResponse = (
        await axios.post(
          "http://127.0.0.1:5000/user/search",
          {
            search_email: searchText,
          },
          {
            headers: {
              Authorization: "Bearer " + t,
            },
          }
        )
      ).data;
      //   console.log(rawResponse);
    } catch (error) {
      if (error.response.status === 502) {
        alert(error.response.data.msg);
      }
      if (error.response.status === 401) {
        removeToken();
        alert("Token expired! Please login again!");
        navigate("/");

        return error;
      }
      setLoading(false);
    }
    if (rawResponse) {
      setSearchData(rawResponse.result);
      setLoading(false);
    }

    return rawResponse;
  };
    const UserRow = ({id,data})=>{
        return (
            <tr>
            <td>1</td>
            <td>
              <div className="d-flex align-items-center">
                <img
                  src={
                    data.user_pic
                      ? data.user_pic
                      : require("./user-icon.png")
                  }
                  alt=""
                  style={{ width: "45px", height: "45px" }}
                  className="rounded-circle"
                />
                <div className="ms-3">
                  <p className="fw-bold mb-1">
                    {data.user_data.name}
                  </p>
                  <p className="text-muted mb-0">
                    {data.user_data.email}
                  </p>
                </div>
              </div>
            </td>
            <td>
              <MDBBtn color="secondary" rounded size="sm">
                Visit
              </MDBBtn>
            </td>
          </tr>
        )
    }
  return (
    <div className="container-searchfriends">
      <MDBInputGroup>
        <MDBInput
          label="Search User By E-Mail"
          onChange={(e) => setSearchText(e.target.value)}
        />
        <MDBBtn rippleColor="dark" color="info" onClick={searchUser}>
          <MDBIcon icon="search" />
        </MDBBtn>
      </MDBInputGroup>
      <div className="searchfrineds-result">
        <MDBTable align="middle" hover bordered small className="caption-top">
          <caption>Search Result</caption>
          <MDBTableHead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">User</th>
              <th scope="col">Actions</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {!loading && searchData ? (
                <UserRow data={searchData}/>
            ) : (
              <></>
            )}
          </MDBTableBody>
        </MDBTable>
      </div>
    </div>
  );
}

export default SearchFriends;
