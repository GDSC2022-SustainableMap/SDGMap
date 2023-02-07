import React, { useState } from 'react'
import './user.css'

function User() {
    let [selectImage, setSelectImage] = useState(null)
    const changeSelectImage = () => {

    }
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
                                <input type='text' placeholder='username'></input>
                            </div>
                        </div>
                        <div className='line'>
                            <div className='pack'>
                                <label className='user-label'>Friends</label>
                                <input type='text' className='num' placeholder='0'></input>
                            </div>
                            <div className='pack'>
                                <label className='user-label'>Coins</label>
                                <input type='text' className='num' placeholder='0'></input>
                            </div>

                        </div>
                        <textarea className='intro' resize='none' placeholder='Biograph'>
                        </textarea>
                    </div>

                    <div className='user-photo'>
                        {selectImage && (
                            <div>
                                <img width={'150px'} src={URL.createObjectURL(selectImage)} />
                                {/* <button onClick={() => setSelectImage(null)}>Remove</button> */}
                            </div>
                        )}
                        {/* <label> */}
                        <img src='user-icon.png' border-radius='50%' width='150px'></img>
                        <input type='button' value='+' />
                        <input type='file' display='none' className='uploadImage'
                            onChange={(event) => {
                                // console.log(event.target.files[0]);
                                setSelectImage(event.target.files[0]);
                            }}
                        />
                        {/* </label> */}

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
                                <div className="accordion-body"></div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingTwo">
                                <button className="accordion-button collapsed" id='btn2' type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                    Store
                                </button>
                            </h2>
                            <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingThree">
                                <button className="accordion-button collapsed" id='btn3' type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                    Comments
                                </button>
                            </h2>
                            <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default User;