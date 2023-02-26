import React, { useState } from 'react'
import { FiEdit } from 'react-icons/fi';
import { IoMdAddCircle } from 'react-icons/io'
import { Modal, Carousel, Card, Stack } from 'react-bootstrap';
import { BsFillPinMapFill } from 'react-icons/bs';
import './user.css'

function User() {
    let [selectImage, setSelectImage] = useState(null)
    let [username, setUsername] = useState(null)
    let [numoffriend, setNumoffriend] = useState(null)
    let [numofcoin, setNumofcoin] = useState(null)
    let [biograph, setBiograph] = useState(null)

    //Modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Badge Collection
    const [badge1, setBadge1] = useState(0);
    const [badge2, setBadge2] = useState(0);
    const [badge3, setBadge3] = useState(0);
    const [badge4, setBadge4] = useState(0);
    const [badge5, setBadge5] = useState(0);
    const [badge6, setBadge6] = useState(0);
    const [badge7, setBadge7] = useState(0);
    const [badge8, setBadge8] = useState(0);
    const [badge9, setBadge9] = useState(0);
    const [badge10, setBadge10] = useState(0);
    const [badge11, setBadge11] = useState(0);
    const [badge12, setBadge12] = useState(0);

    // equipment collection
    const [equip1, setEquip1] = useState(0);
    const [equip2, setEquip2] = useState(0);
    const [equip3, setEquip3] = useState(0);
    const [equip4, setEquip4] = useState(0);
    const [equip5, setEquip5] = useState(0);
    const [equip6, setEquip6] = useState(0);
    const [equip7, setEquip7] = useState(0);
    const [equip8, setEquip8] = useState(0);
    const [equip9, setEquip9] = useState(0);

    //Carousel
    function CarouselOfVisitedStore() {
        const [index, setIndex] = useState(0);
        const handleSelect = (selectedIndex, e) => {
            setIndex(selectedIndex);
        };
        const reviews = [
            { _id: 1, text: "abc" },
            { _id: 2, text: "def" },
            { _id: 3, text: "ghi" },
            { _id: 4, text: "jkl" },
            { _id: 5, text: "mno" },
            { _id: 6, text: "pqr" },
            { _id: 7, text: "stu" },
            { _id: 8, text: "vwx" },
            { _id: 9, text: "yza" }
        ];

        return (
            <Carousel activeIndex={index} onSelect={handleSelect} variant="dark" indicators="false">
                {reviews.map((store) => (
                    <Carousel.Item >
                        <Stack direction="horizontal" className="h-100 justify-content-center align-items-center" gap={3}>
                            {/* <div className='card'>
                                <div className='card-body'>
                                    <h5 className='card-title'>{store._id}</h5>
                                    <hr className='carousel-hline'/>
                                    <div className='card-text'>
                                        {store.text}!
                                    </div>
                                    <button variant="primary">Go somewhere</button>
                                </div>
                            </div>
                            <div className='card'>
                                <div className='card-body'>
                                    <h5 className='card-title'>{store._id}</h5>
                                    <hr className='carousel-hline'/>
                                    <div className='card-text'>
                                        {store.text}!
                                    </div>
                                    <button variant="primary">Go somewhere</button>
                                </div>
                            </div> */}

                            <InfoCard 
                                name={store.name} 
                                addr={store.formatted_address}
                                price={store.price_level}
                                rate={store.rating} />
                        </Stack>
                    </Carousel.Item>
                ))}
            </Carousel>
        );
    }
    const InfoCard = ({ name, addr, price, rate }) => {
        let p = "";
        for (let i = 0; i < price; i++) {
            p = p + "$";
        }
        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        return (
            <div className="BoxText1">
                <b>{name}</b>
                <hr />
                地址: {addr}<br />
                評分: {rate}&emsp;
                <div>
                    電話: 沒有這個資訊<br />
                    價格: {p}<br />
                    {/* 待完成：將此button靠右對齊 */}
                    <button variant="primary" onClick={handleShow}>More info</button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            地址: {addr}<br />
                            評分: {rate}&emsp;
                            電話: 沒有這個資訊:(<br />
                            價格: {p}
                        </Modal.Body>
                        <Modal.Footer>
                            <button variant="secondary">Check In</button>
                            <button variant="secondary" onClick={handleClose}>OK</button>
                        </Modal.Footer>
                    </Modal>

                </div>
            </div>
        );
    }
    return (
        <div className='user-container'>
            <div className='user-lb'>
                <h1>3Dcharacter</h1>
            </div>
            <div className='user-rb'>
                <div className='user-rtb'>
                    <div className='user-rtlb'>
                        <div className='line'>
                            <div className='pack'>
                                <label className='user-label'>Name</label>
                                <p>username</p>
                            </div>
                        </div>
                        <div className='line'>
                            <div className='pack'>
                                <label className='user-label'>Friends</label>
                                <p >0</p>
                            </div>
                            {/* <div className='pack'>
                                <label className='user-label'>Coins</label>
                                <p className='num'>0</p>
                            </div> */}
                        </div>
                        <p className='biograph' resize='none'>Here are the biograph.</p>

                    </div>

                    <div className='user-rtrb'>
                        <button id="editbtn" variant="primary" onClick={handleShow} >
                            <FiEdit size={20} />
                        </button>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Your Profile</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {/* <form className='user-form'> */}
                                <div className='user-form-group'>
                                    <label className='user-form-label'>Name</label>
                                    <input className='value' type='text' placeholder='username'></input>
                                </div>
                                <div className='user-form-group'>
                                    <label className='user-form-label'>Photo</label>
                                    <input className='value' type='file'></input>
                                </div>
                                {/* <div className='user-form-group'>
                                        <label className='user-form-label'>Email Address</label>
                                        <input className='value' type='email' placeholder='email address'></input>
                                    </div> */}
                                {/* <div className='user-form-group'>
                                        <label className='user-form-label'>Password</label>
                                        <input className='value' type='text' placeholder='password'></input>
                                    </div> */}
                                <div className='user-form-group'>
                                    <label className='user-form-label'>Birth</label>
                                    <input className='value' type='text' placeholder='YYYY/MM/DD'></input>
                                </div>
                                {/* </form> */}
                            </Modal.Body>
                            <Modal.Footer>
                                <button id='closebtn' variant="secondary" onClick={handleClose}>Finish Edition</button>
                            </Modal.Footer>
                        </Modal>
                        {/* {selectImage && (
                            <div>
                                <img width={'150px'} src={URL.createObjectURL(selectImage)} />
                                <button onClick={() => setSelectImage(null)}>Remove</button>
                            </div>
                        )} */}
                        <img id='user-photo' src={require('./user-icon.png')} />
                        {/* <label id='imagebtn'><IoMdAddCircle size='30' />
                            <input type='file' display='none' id='imgouterbtn'
                                onChange={(event) => {
                                    // console.log(event.target.files[0]);
                                    setSelectImage(event.target.files[0]);
                                }}
                            />
                        </label> */}

                    </div>
                </div>
                <div className='user-rbb'>
                    <div className="accordion accordion-flush">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingOne">
                                <button className="accordion-button collapsed" id='btn1' type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                    SDG Badge Collection
                                </button>
                            </h2>
                            <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">
                                    <div className='com'>
                                        <img className="badge_left" title='關懷弱勢' alt="關懷弱勢" onClick={() => setBadge1(prevValue => prevValue + 1)}
                                            src={badge1 > 0 ? require('../../Badge/t_careweak.png') : require('../../Badge/n_careweak.png')} />
                                        <span className='amount1'>{badge1}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="badge_left" title='友善環境' alt="友善環境" onClick={() => setBadge2(prevValue => prevValue + 1)}
                                            src={badge2 > 0 ? require('../../Badge/t_envfriend.png') : require('../../Badge/n_envfriend.png')} />
                                        <span className='amount1'>{badge2}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="badge_left" title='食育教育' alt="食育教育" onClick={() => setBadge3(prevValue => prevValue + 1)}
                                            src={badge3 > 0 ? require('../../Badge/t_foodeduc.png') : require('../../Badge/n_foodeduc.png')} />
                                        <span className='amount1'>{badge3}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="badge_left" title='公平交易' alt="公平交易" onClick={() => setBadge4(prevValue => prevValue + 1)}
                                            src={badge4 > 0 ? require('../../Badge/t_freetrade.png') : require('../../Badge/n_freetrade.png')} />
                                        <span className='amount1'>{badge4}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="badge_left" title='在地食材' alt="在地食材" onClick={() => setBadge5(prevValue => prevValue + 1)}
                                            src={badge5 > 0 ? require('../../Badge/t_localgred.png') : require('../../Badge/n_localgred.png')} />
                                        <span className='amount1'>{badge5}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="badge_left" title='有機小農' alt="有機小農" onClick={() => setBadge6(prevValue => prevValue + 1)}
                                            src={badge6 > 0 ? require('../../Badge/t_organic.png') : require('../../Badge/n_organic.png')} />
                                        <span className='amount1'>{badge6}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="badge_right" title='蛋奶素' alt="蛋奶素" onClick={() => setBadge7(prevValue => prevValue + 1)}
                                            src={badge7 > 0 ? require('../../Badge/t_ovolacto.png') : require('../../Badge/n_ovolacto.png')} />
                                        <span className='amount2'>{badge7}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="badge_right" title='寵物友善' alt="寵物友善" onClick={() => setBadge8(prevValue => prevValue + 1)}
                                            src={badge8 > 0 ? require('../../Badge/t_petfriend.png') : require('../../Badge/n_petfriend.png')} />
                                        <span className='amount2'>{badge8}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="badge_right" title='減塑' alt="減塑" onClick={() => setBadge9(prevValue => prevValue + 1)}
                                            src={badge9 > 0 ? require('../../Badge/t_noplastic.png') : require('../../Badge/n_noplastic.png')} />
                                        <span className='amount2'>{badge9}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="badge_right" title='公共議題分享' alt="公共議題分享" onClick={() => setBadge10(prevValue => prevValue + 1)}
                                            src={badge10 > 0 ? require('../../Badge/t_publicissue.png') : require('../../Badge/n_publicissue.png')} />
                                        <span className='amount2'>{badge10}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="badge_right" title='流浪動物' alt="流浪動物" onClick={() => setBadge11(prevValue => prevValue + 1)}
                                            src={badge11 > 0 ? require('../../Badge/t_stray.png') : require('../../Badge/n_stray.png')} />
                                        <span className='amount2'>{badge11}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="badge_right" title='純素' alt="純素" onClick={() => setBadge12(prevValue => prevValue + 1)}
                                            src={badge12 > 0 ? require('../../Badge/t_vegetarianism.png') : require('../../Badge/n_vegetarianism.png')} />
                                        <span className='amount2'>{badge12}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingTwo">
                                <button className="accordion-button collapsed" id='btn2' type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                    Backpack
                                </button>
                            </h2>
                            <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">
                                    <div className='com'>
                                        <img className="equip" onClick={() => setEquip1(prevValue => prevValue + 1)}
                                            src={equip1 > 0 ? require('../../Equipment/banana.png') : require('../../Equipment/n_banana.png')} />
                                        <span className='amount1'>{equip1}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="equip" onClick={() => setEquip2(prevValue => prevValue + 1)}
                                            src={equip2 > 0 ? require('../../Equipment/caterpillar.png') : require('../../Equipment/n_caterpillar.png')} />
                                        <span className='amount1'>{equip2}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="equip" onClick={() => setEquip3(prevValue => prevValue + 1)}
                                            src={equip3 > 0 ? require('../../Equipment/the_egg.png') : require('../../Equipment/n_the_egg.png')} />
                                        <span className='amount1'>{equip3}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="equip" onClick={() => setEquip4(prevValue => prevValue + 1)}
                                            src={equip4 > 0 ? require('../../Equipment/earthworm.png') : require('../../Equipment/n_earthworm.png')} />
                                        <span className='amount1'>{equip4}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="equip" onClick={() => setEquip5(prevValue => prevValue + 1)}
                                            src={equip5 > 0 ? require('../../Equipment/honey.png') : require('../../Equipment/n_honey.png')} />
                                        <span className='amount1'>{equip5}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="equip" onClick={() => setEquip6(prevValue => prevValue + 1)}
                                            src={equip6 > 0 ? require('../../Equipment/grape.png') : require('../../Equipment/n_grape.png')} />
                                        <span className='amount1'>{equip6}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="equip" onClick={() => setEquip7(prevValue => prevValue + 1)}
                                            src={equip7 > 0 ? require('../../Equipment/nuts.png') : require('../../Equipment/n_nuts.png')} />
                                        <span className='amount1'>{equip7}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="equip" onClick={() => setEquip8(prevValue => prevValue + 1)}
                                            src={equip8 > 0 ? require('../../Equipment/ant.png') : require('../../Equipment/n_ant.png')} />
                                        <span className='amount1'>{equip8}</span>
                                    </div>
                                    <div className='com'>
                                        <img className="equip" onClick={() => setEquip9(prevValue => prevValue + 1)}
                                            src={equip9 > 0 ? require('../../Equipment/red_fruit.png') : require('../../Equipment/n_red_fruit.png')} />
                                        <span className='amount1'>{equip9}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingThree">
                                <button className="accordion-button collapsed" id='btn3' type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                    Visited Store Collection
                                </button>
                            </h2>
                            <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body" id="accordion-body3">
                                    <CarouselOfVisitedStore />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default User;