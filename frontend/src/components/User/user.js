import React, { useState } from 'react'
import { FiEdit } from 'react-icons/fi';
import { IoMdAddCircle } from 'react-icons/io'
import Modal from 'react-bootstrap/Modal';
import './user.css'

function User() {
    let [selectImage, setSelectImage] = useState(null)
    let [username, setUsername] = useState(null)
    let [numoffriend, setNumoffriend] = useState(null)
    let [numofcoin, setNumofcoin] = useState(null)
    let [biograph, setBiograph] = useState(null)
    // let [, set] = useState(null)
    const changeSelectImage = () => {

    }
    //Modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //Badge Collection

    return (
        <div className='user-container'>
            <div className='user-lb'>
                <h1>3Dcharacter</h1>
            </div>
            <div className='user-rb'>
                <div className='user-rtb'>
                    <div className='user-info'>
                        <div className='line'>
                            <div className='pack'>
                                <label className='user-label'>Name</label>
                                <p className='txt' placeholder='username'>username</p>
                            </div>
                        </div>
                        <div className='line'>
                            <div className='pack'>
                                <label className='user-label'>Friends</label>
                                <p className='num' >0</p>
                            </div>
                            <div className='pack'>
                                <label className='user-label'>Coins</label>
                                <p className='num'>0</p>
                            </div>

                        </div>
                        <textarea className='intro' resize='none' placeholder='Biograph'>
                        </textarea>
                    </div>

                    <div className='user-photo'>
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
                                        {/* <label id='photo_vle_btn'>user photo */}
                                            <input className='value' type='file'></input>
                                        {/* </label> */}
                                    </div>
                                    <div className='user-form-group'>
                                        <label className='user-form-label'>Email Address</label>
                                        <input className='value' type='email' placeholder='email address'></input>
                                    </div>
                                    <div className='user-form-group'>
                                        <label className='user-form-label'>Password</label>
                                        <input className='value' type='text' placeholder='password'></input>
                                    </div>
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
                        {selectImage && (
                            <div>
                                <img width={'150px'} src={URL.createObjectURL(selectImage)} />
                                {/* <button onClick={() => setSelectImage(null)}>Remove</button> */}
                            </div>
                        )}
                        <label id='imagebtn'><IoMdAddCircle size='30' />
                            {/* <img src='user-icon.png' border-radius='50%' width='150px'></img> */}
                            <input type='file' display='none' id='imgouterbtn'
                                onChange={(event) => {
                                    // console.log(event.target.files[0]);
                                    setSelectImage(event.target.files[0]);
                                }}
                            />
                        </label>

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
                                    <img className='badge1' src={require('../../Badge/n_careweak.png')} title='關懷弱勢' alt="關懷弱勢" />
                                    <img className='badge1' src={require('../../Badge/n_envfriend.png')} title='友善環境' alt="友善環境" />
                                    <img className='badge1' src={require('../../Badge/n_foodeduc.png')} title='食育教育' alt="食育教育" />
                                    <img className='badge1' src={require('../../Badge/n_freetrade.png')} title='公平交易' alt="公平交易" />
                                    <img className='badge1' src={require('../../Badge/n_localgred.png')} title='在地食材' alt="在地食材" />
                                    <img className='badge1' src={require('../../Badge/n_organic.png')} title='有機小農' alt="有機小農" />
                                    <img className='badge2' src={require('../../Badge/n_ovolacto.png')} title='蛋奶素' alt="蛋奶素" />
                                    <img className='badge2' src={require('../../Badge/n_petfriend.png')} title='寵物友善' alt="寵物友善" />
                                    <img className='badge2' src={require('../../Badge/n_noplastic.png')} title='減塑' alt="減塑" />
                                    <img className='badge2' src={require('../../Badge/n_publicissue.png')} title='公共議題分享' alt="公共議題分享" />
                                    <img className='badge2' src={require('../../Badge/n_stray.png')} title='流浪動物' alt="流浪動物" />
                                    <img className='badge2' src={require('../../Badge/n_vegetarianism.png')} title='純素' alt="純素" />
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingTwo">
                                <button className="accordion-button collapsed" id='btn2' type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                    Store
                                </button>
                            </h2>
                            <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body"></div>
                            </div>
                        </div>
                        {/* <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingThree">
                                <button className="accordion-button collapsed" id='btn3' type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                    Comments
                                </button>
                            </h2>
                            <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body"></div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default User;