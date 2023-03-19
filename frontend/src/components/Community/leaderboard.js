import Table from 'react-bootstrap/Table';
import './community.css';
import { React, useState } from 'react';
import { Modal, Carousel, Card, Stack } from 'react-bootstrap';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import Badges from '../Badge/badge';
import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai"
import './leaderboard.css'

function FriendProfile() {
  const [user, setUser] = useState({
    image: "",
    username: "Username",
    birth: "2000/01/01",
    friends: 20,
    biograph: "Here is the Biograph!",
    // Badge Collection
    badge1: 0, badge2: 0, badge3: 0, badge4: 0, badge5: 0, badge6: 0,
    badge7: 0, badge8: 0, badge9: 0, badge10: 0, badge11: 0, badge12: 0,
    // Equipment Collection
    equip1: 0, equip2: 0, equip3: 3, equip4: 0, equip5: 0,
    equip6: 0, equip7: 0, equip8: 0, equip9: 0,
  });

  // Modal of Edition
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => setUser(prevState => ({ ...prevState, [e.target.name]: e.target.value }))

  // Carousel1
  function CarouselOfVisitedStore() {
    const [index, setIndex] = useState(0);
    const [current, setCurrent] = useState(0);
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };
    const VisitedStoreList = [
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

    const InfoCard = ({ name, addr, price, rate }) => {
      let p = "";
      for (let i = 0; i < price; i++) {
        p = p + "$";
      }
      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
      return (
        <div className="card">
          <b>{name}</b>
          <hr />
          地址: {addr}<br />
          評分: {rate}&emsp;
          <div>
            電話: 沒有這個資訊<br />
            價格: {p}<br />
            <button className="card-button-orange" variant="primary" onClick={handleShow}>More info</button>
          </div>
        </div>
      );
    }
    return (
      <Carousel activeIndex={index} onSelect={handleSelect} variant="dark" showIndicators={false}>
        {VisitedStoreList.reduce((accumulator, currentValue, currentIndex, array) => {
          if (currentIndex % 2 === 0) {
            accumulator.push(array.slice(currentIndex, currentIndex + 2));
          } else if (currentIndex % 2 === 1 && currentIndex + 2 > array.length && currentIndex < array.length-1) {
            accumulator.push(array.slice(currentIndex, currentIndex + 1));
          }
          return accumulator;
        }, [])
          .map((store) => (
            store.length === 2 ? (
              <Carousel.Item >
                <Stack direction="horizontal" className=" stack" gap={4} style={{margin:" 0 4%"}}>
                  <InfoCard className="card-orange card"
                    name={store[0].name}
                    addr={store[0].formatted_address}
                    price={store[0].price_level}
                    rate={store[0].rating}
                  />
                  <InfoCard className="card-orange card"
                    name={store[1].name}
                    addr={store[1].formatted_address}
                    price={store[1].price_level}
                    rate={store[1].rating}
                  />

                </Stack>
              </Carousel.Item>
            ) : (
              <Carousel.Item>
                <Stack direction="horizontal" className=" stack" gap={4} style={{margin:" 0 4%"}}>
                  <InfoCard className="card-orange card"
                    name={store[0].name}
                    addr={store[0].formatted_address}
                    price={store[0].price_level}
                    rate={store[0].rating}
                  />
                </Stack>
              </Carousel.Item>
            )))}
      </Carousel>
    );
  }
  // Carousel2
  function CarouselOfStoredStore() {
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };
    const VisitedStoreList = [
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

    const InfoCard = ({ name, addr, price, rate }) => {
      let p = "";
      for (let i = 0; i < price; i++) {
        p = p + "$";
      }
      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
      return (
        <div className="card">
          <b>{name}</b>
          <hr />
          地址: {addr}<br />
          評分: {rate}&emsp;
          <div>
            電話: 沒有這個資訊<br />
            價格: {p}<br />
            <button className="card-button-green" variant="primary" onClick={handleShow}>更多資訊</button>
          </div>
        </div>
      );
    }
    return (
      <Carousel activeIndex={index} onSelect={handleSelect} variant="dark" showIndicators={false}>
        {VisitedStoreList.reduce((accumulator, currentValue, currentIndex, array) => {
          if (currentIndex % 2 === 0) {
            accumulator.push(array.slice(currentIndex, currentIndex + 2));
          } else if (currentIndex % 2 === 1 && currentIndex+2 > array.length && currentIndex < array.length-1) {
            accumulator.push(array.slice(currentIndex, currentIndex + 1));
          }
          return accumulator;
        }, [])
          .map((store) => (
            store.length == 2 ? (
              <Carousel.Item >
                <Stack direction="horizontal" className=" stack" gap={4} style={{margin:" 0 4%"}}>
                  <InfoCard className="card-green card"
                    name={store[0].name}
                    addr={store[0].formatted_address}
                    price={store[0].price_level}
                    rate={store[0].rating}
                  />
                  <InfoCard className="card-green card"
                    name={store[1].name}
                    addr={store[1].formatted_address}
                    price={store[1].price_level}
                    rate={store[1].rating}
                  />
                </Stack>
              </Carousel.Item>
            ) : (
              <Carousel.Item>
                <Stack direction="horizontal" className=" stack" gap={4} style={{margin:" 0 4%"}}>
                  <InfoCard className="card-green card"
                    name={store[0].name}
                    addr={store[0].formatted_address}
                    price={store[0].price_level}
                    rate={store[0].rating}
                  />
                </Stack>
              </Carousel.Item>
            )))}
      </Carousel>
    );
  }
  // Add Friend
  function AddFriend() {
    return user
  }

  //Delete Friend
  function DelFriend() {

  }

  return (
    <div className='board-container'>
      <div style={{ justifyContent: 'right' }}>
        <button id="addfriendbtn" onclick={AddFriend} name="增加好友"><AiOutlineUserAdd size={36} /></button>
        <button id="delfriendbtn" onclick={DelFriend} name="刪除好友"><AiOutlineUserDelete size={36} /></button>
      </div>
      <div className='board-rb'>
        <div className='board-rtb'>
          <div className='board-rtlb'>
            <div className='line'>
              <div className='pack'>
                <label className='board-label'>名稱</label>
                <p>{user.username}</p>
              </div>
            </div>
            <div className='line'>
              <div className='pack'>
                <label className='board-label'>朋友</label>
                <p >{user.friends}</p>
              </div>
            </div>
            <p className='biograph' resize='none'>{user.biograph}</p>

          </div>

          <div className='board-rtrb'>
            <img id='user-photo' src={require('./user-icon.png')} />
          </div>
        </div>
        <div className='board-rbb'>
          <div className="accordion accordion-flush">
            <div className="accordion-item">
              <h2 className="accordion-header" id="flush-headingOne">
                <button className="accordion-button collapsed" id='f-btn1' type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                  永續發展徽章收集
                </button>
              </h2>
              <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                <div className="accordion-body" id="accordion-body1">
                  <div className='com'>
                    <img className="badge_left" title='關懷弱勢' alt="關懷弱勢"
                      src={user.badge1 > 0 ? require('../../Badge/t_careweak.png') : require('../../Badge/n_careweak.png')} />
                    <span className='amount1'>{user.badge1}</span>
                  </div>
                  <div className='com'>
                    <img className="badge_left" title='友善環境' alt="友善環境" /*onClick={() => setBadge2(prevValue => prevValue + 1)}*/
                      src={user.badge2 > 0 ? require('../../Badge/t_envfriend.png') : require('../../Badge/n_envfriend.png')} />
                    <span className='amount1'>{user.badge2}</span>
                  </div>
                  <div className='com'>
                    <img className="badge_left" title='食育教育' alt="食育教育" /*onClick={() => setBadge3(prevValue => prevValue + 1)}*/
                      src={user.badge3 > 0 ? require('../../Badge/t_foodeduc.png') : require('../../Badge/n_foodeduc.png')} />
                    <span className='amount1'>{user.badge3}</span>
                  </div>
                  <div className='com'>
                    <img className="badge_left" title='公平交易' alt="公平交易" /*onClick={() => setBadge4(prevValue => prevValue + 1)}*/
                      src={user.badge4 > 0 ? require('../../Badge/t_freetrade.png') : require('../../Badge/n_freetrade.png')} />
                    <span className='amount1'>{user.badge4}</span>
                  </div>
                  <div className='com'>
                    <img className="badge_left" title='在地食材' alt="在地食材" /*onClick={() => setBadge5(prevValue => prevValue + 1)}*/
                      src={user.badge5 > 0 ? require('../../Badge/t_localgred.png') : require('../../Badge/n_localgred.png')} />
                    <span className='amount1'>{user.badge5}</span>
                  </div>
                  <div className='com'>
                    <img className="badge_left" title='有機小農' alt="有機小農" /*onClick={() => setBadge6(prevValue => prevValue + 1)}*/
                      src={user.badge6 > 0 ? require('../../Badge/t_organic.png') : require('../../Badge/n_organic.png')} />
                    <span className='amount1'>{user.badge6}</span>
                  </div>
                  <div className='com'>
                    <img className="badge_right" title='蛋奶素' alt="蛋奶素" /*onClick={() => setBadge7(prevValue => prevValue + 1)}*/
                      src={user.badge10badge7 > 0 ? require('../../Badge/t_ovolacto.png') : require('../../Badge/n_ovolacto.png')} />
                    <span className='amount2'>{user.badge7}</span>
                  </div>
                  <div className='com'>
                    <img className="badge_right" title='寵物友善' alt="寵物友善" /*onClick={() => setBadge8(prevValue => prevValue + 1)}*/
                      src={user.badge8 > 0 ? require('../../Badge/t_petfriend.png') : require('../../Badge/n_petfriend.png')} />
                    <span className='amount2'>{user.badge8}</span>
                  </div>
                  <div className='com'>
                    <img className="badge_right" title='減塑' alt="減塑" /*onClick={() => setBadge9(prevValue => prevValue + 1)}*/
                      src={user.badge9 > 0 ? require('../../Badge/t_noplastic.png') : require('../../Badge/n_noplastic.png')} />
                    <span className='amount2'>{user.badge9}</span>
                  </div>
                  <div className='com'>
                    <img className="badge_right" title='公共議題分享' alt="公共議題分享" /*onClick={() => setBadge10(prevValue => prevValue + 1)}*/
                      src={user.badge10 > 0 ? require('../../Badge/t_publicissue.png') : require('../../Badge/n_publicissue.png')} />
                    <span className='amount2'>{user.badge10}</span>
                  </div>
                  <div className='com'>
                    <img className="badge_right" title='流浪動物' alt="流浪動物" /*onClick={() => setBadge11(prevValue => prevValue + 1)}*/
                      src={user.badge11 > 0 ? require('../../Badge/t_stray.png') : require('../../Badge/n_stray.png')} />
                    <span className='amount2'>{user.badge11}</span>
                  </div>
                  <div className='com'>
                    <img className="badge_right" title='純素' alt="純素" /*onClick={() => setBadge12(prevValue => prevValue + 1)}*/
                      src={user.badge12 > 0 ? require('../../Badge/t_vegetarianism.png') : require('../../Badge/n_vegetarianism.png')} />
                    <span className='amount2'>{user.badge12}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="flush-headingTwo">
                <button className="accordion-button collapsed" id='f-btn2' type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                  到訪店家
                </button>
              </h2>
              <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                <div className="accordion-body" id="accordion-body2">
                  <CarouselOfVisitedStore />
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="flush-headingThree">
                <button className="accordion-button collapsed " id='f-btn3' type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                  收藏店家
                </button>
              </h2>
              <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                <div className="accordion-body" id="accordion-body3">
                  <CarouselOfStoredStore />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

function Leaderboard() {
  // Modal of VisitFriendProfile
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className='container-leaderboard'>
      <MDBTable align='middle' hover>
        <MDBTableHead>
          <tr>
            <th scope='col'>排名</th>
            <th scope='col'>玩家</th>
            <th scope='col'>徽章</th>
            <th scope='col'>徽章數量</th>
            <th scope='col'>了解更多</th>
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
            <td><Badges /></td>
            <td>20</td>
            <td>
              <MDBBtn className='green-btn' color='secondary' rounded size='sm' onClick={FriendProfile}>
                <button onClick={handleShow}>Visit</button>
                <Modal show={show} onHide={handleClose} size='lg' style={{ padding: '0' }}>
                  <Modal.Header closeButton />
                  <Modal.Body>
                    <FriendProfile />
                  </Modal.Body >
                  <Modal.Footer>
                    {/* <button className='ld-btn' onClick={handleClose}>Leave</button> */}
                  </Modal.Footer>
                </Modal>
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
              <Badges />
            </td>
            <td>20</td>
            <td>
              <MDBBtn color='secondary' rounded size='sm' onClick={FriendProfile}>
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