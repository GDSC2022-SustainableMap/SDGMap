import Table from 'react-bootstrap/Table';
import './community.css';
import React from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import Badges from '../Badge/badge';


function Leaderboard() {
  return (
    <div className='container-leaderboard'>
    <MDBTable align='middle' hover>
      <MDBTableHead>
        <tr>
            <th scope='col'>Rank</th>
            <th scope='col'>User</th>
            <th scope='col'>Badge Collection</th>
            <th scope='col'>Badge Count</th>
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
          {/* <Badges/> */}
          </td>
          <td>20</td>
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
          {/* <Badges/> */}
          </td>
          <td>20</td>
          <td>
            <MDBBtn color='secondary' rounded size='sm'>
              Visit
            </MDBBtn>
          </td>
        </tr>
      </MDBTableBody>
    </MDBTable>
    </div>
  );
}

export default Leaderboard;