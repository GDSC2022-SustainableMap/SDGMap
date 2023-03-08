import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import './community.css';
import Leaderboard from './leaderboard';
import SearchFriends from './searchfriend';
import React, { useState } from 'react';
import {
    MDBIcon,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';

import {MdLeaderboard} from 'react-icons/md';

export default function Community() {
  const [verticalActive, setVerticalActive] = useState('tab1');

  const handleVerticalClick = (value: string) => {
    if (value === verticalActive) {
      return;
    }

    setVerticalActive(value);
  };

  return (
    <div className='container-community'>
      <MDBRow>
        <MDBCol size='3'>
          <MDBTabs className='flex-column text-center'>
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleVerticalClick('tab1')} active={verticalActive === 'tab1'}>
              <MdLeaderboard size={15}/>Leaderboard
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleVerticalClick('tab2')} active={verticalActive === 'tab2'}>
              <MDBIcon fas icon='search-plus' className='me-2' />Search
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>
        </MDBCol>
        <MDBCol>
          <MDBTabsContent>
            <MDBTabsPane show={verticalActive === 'tab1'}><Leaderboard/></MDBTabsPane>
            <MDBTabsPane show={verticalActive === 'tab2'}><SearchFriends/></MDBTabsPane>
          </MDBTabsContent>
        </MDBCol>
      </MDBRow>
    </div>
  );
}