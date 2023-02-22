import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { useState } from 'react';

function SearchFriends() {
    const [searchBtn, setSearchBtn] = useState(false);

    return (
        <div className='container-searchfriends'>
            <MDBInputGroup>
                <MDBInput label='Search User By Name' />
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