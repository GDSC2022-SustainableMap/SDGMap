import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { useState } from 'react';

function SearchFriends() {
    const [searchBtn, setSearchBtn] = useState(false);
    const [searchResult, setsearchResult] = useState([]);
    const search = [
        { _id: 1, name: "xxx" },
        { _id: 2, name: "abc" },
        { _id: 3, name: "def" },
        { _id: 4, name: "ghi" },
        { _id: 5, name: "jkl" },
        { _id: 6, name: "mno" },
        { _id: 7, name: "pqr" },
        { _id: 8, name: "stu" },
        { _id: 9, name: "vwx" },
        { _id: 10, name: "yza" },
      ];
    const searchResponse = () => {
        setSearchBtn(true);
        setsearchResult(search);
    };
    const UserRow = ({id, name})=>{
        return (
            <tr>
                <td>{id}</td>
                <td>
                    <div className='d-flex align-items-center'>
                    <img
                        src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                        alt=''
                        style={{ width: '45px', height: '45px' }}
                        className='rounded-circle'
                    />
                    <div className='ms-3'>
                        <p className='fw-bold mb-1'>{name}</p>
                        <p className='text-muted mb-0'>UserMail</p>
                    </div>
                    </div>
                </td>
                <td>
                    <MDBBtn color='secondary' rounded size='sm'>
                    Visit
                    </MDBBtn>
                </td>
            </tr>
        )
    }

    return (
        <div className='container-searchfriends'>
            <MDBInputGroup>
                <MDBInput label='Search User By Mail' />
                <MDBBtn rippleColor='dark' color='info' onClick={searchResponse}>
                    <MDBIcon icon='search'/>
                </MDBBtn>
            </MDBInputGroup>
            <div className='searchfrineds-result'>
            {searchBtn? 
            <MDBTable align='middle' hover bordered small className='caption-top'>
                <caption>Search Result</caption>
                <MDBTableHead>
                    <tr>
                        <th scope='col'>#</th>
                        <th scope='col'>User</th>
                        <th scope='col'>Actions</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {searchResult.map((item, index) => (
                        <UserRow key={index} name={item.name} id={item._id}></UserRow>
                    ))}
                </MDBTableBody>
            </MDBTable>:<></>}
            </div>
        </div>
    );
  }
  
  export default SearchFriends;