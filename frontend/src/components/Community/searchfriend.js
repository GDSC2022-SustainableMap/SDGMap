import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { useState } from 'react';

function SearchFriends() {
    const [searchBtn, setSearchBtn] = useState(false);
    const VisitedStoreList = [
        { _id: 1, name: "xxx" },
        { _id: 1, name: "abc" },
        { _id: 2, name: "def" },
        { _id: 3, name: "ghi" },
        { _id: 4, name: "jkl" },
        { _id: 5, name: "mno" },
        { _id: 6, name: "pqr" },
        { _id: 7, name: "stu" },
        { _id: 8, name: "vwx" },
        { _id: 9, name: "yza" }
      ];
    const UserRow = ()=>{
        return (
            <tr>
                <td>1</td>
                <td>
                    <div className='d-flex align-items-center'>
                    <img
                        src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                        alt=''
                        style={{ width: '45px', height: '45px' }}
                        className='rounded-circle'
                    />
                    <div className='ms-3'>
                        <p className='fw-bold mb-1'>User Name</p>
                        <p className='text-muted mb-0'>UserID</p>
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
                <MDBBtn rippleColor='dark' color='info' onClick={() => setSearchBtn(true)}>
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
                    <UserRow/>
                    <tr>
                    <td>2</td>
                    <td>
                        <div className='d-flex align-items-center'>
                        <img
                            src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                            alt=''
                            style={{ width: '45px', height: '45px' }}
                            className='rounded-circle'
                        />
                        <div className='ms-3'>
                            <p className='fw-bold mb-1'>User Name</p>
                            <p className='text-muted mb-0'>UserID</p>
                        </div>
                        </div>
                    </td>
                    <td>
                        <MDBBtn color='secondary' rounded size='sm'>
                        Visit
                        </MDBBtn>
                    </td>
                    </tr>
                </MDBTableBody>
            </MDBTable>:<></>}
            </div>
        </div>
    );
  }
  
  export default SearchFriends;