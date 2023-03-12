import React from 'react';
import './book.css';
import petfriend from '../../Badge/t_petfriend.png';
import stray from '../../Badge/t_stray.png';
import publicissue from '../../Badge/t_publicissue.png';
import careforweak from '../../Badge/t_careforweak.png';
import foodeduc from '../../Badge/t_foodeduc.png';
import localgred from '../../Badge/t_localgred.png';
import envfriend from '../../Badge/t_envfriend.png';
import ovolacto from '../../Badge/t_ovolacto.png';
import plasticbag from '../../Badge/t_noplastic.png';
import organic from '../../Badge/t_organic.png';
import vegetarianism from '../../Badge/t_vegetarianism.png';
import freetrade from '../../Badge/t_freetrade.png';


function Book() {
    return (
        <div className="book">
            <div id="post-title-area">
                <div className="hline1"></div>
                <h3 className="page-title">永續標章圖鑑</h3>
                <div className="hline2"></div>
            </div>
            <div className='twelve-grid-container'>
                <div className='mark'>
                    <div className='mark-border'>
                        <img className='mark-img' src={petfriend} alt='petfriendly' style={{ width: '150px', height: '150px' }} class="rounded-circle" />
                        <div className='mark-title'>寵物友善</div>
                        <p>除了寵物可以進入外，經過規劃，讓環境對寵物是友善的。同時，也需要與寵物的主人達成共識，讓餐廳也可以照顧到一般民眾的需求。</p>
                    </div>
                </div>
                <div className='mark'>
                    <div className='mark-border'>
                        <img className='mark-img' src={stray} alt='strayanimal' style={{ width: '150px', height: '150px' }} class="rounded-circle" />
                        <div className='mark-title'>流浪動物</div>
                        <p>幫助流浪動物，提供中途的溫暖也為浪浪的生活產生新的希望。</p>
                    </div>
                </div>
                <div className='mark'>
                    <div className='mark-border'>
                        <img className='mark-img' src={publicissue} alt='publicissue' style={{ width: '150px', height: '150px' }} class="rounded-circle" />
                        <div className='mark-title'>公共議題分享</div>
                        <p>餐廳內會舉辦講座(不限主題)，或是會分享公共議題，希望透過店家的力量為社會貢獻心力。</p>
                    </div>
                </div>
                <div className='mark'>
                    <div className='mark-border'>
                        <img className='mark-img' src={careforweak} alt='careforweak' style={{ width: '150px', height: '150px' }} class="rounded-circle" />
                        <div className='mark-title'>關懷弱勢</div>
                        <p>店家透過自身的力量幫助弱勢族群，也提供客人更了解相關的弱勢族群的機會，讓彼此可以有更多溫暖的交流。</p>
                    </div>
                </div>
                <div className='mark'>
                    <div className='mark-border'>
                        <img className='mark-img' src={foodeduc} alt='foodeducation' style={{ width: '150px', height: '150px' }} class="rounded-circle" />
                        <div className='mark-title'>食育教育</div>
                        <p>用料理或是餐飲傳達教育意義或是生活理念。</p>
                    </div>
                </div>
                <div className='mark'>
                    <div className='mark-border'>
                        <img className='mark-img' src={localgred} alt='localgredient' style={{ width: '150px', height: '150px' }} class="rounded-circle" />
                        <div className='mark-title'>在地食材</div>
                        <p>使用本土食材，創造美味的同時也減少碳足跡為地球盡一份心力。</p>
                    </div>
                </div>

                <div className='mark'>
                    <div className='mark-border'>
                        <img className='mark-img' src={envfriend} alt='envirionmentfriendly' style={{ width: '150px', height: '150px' }} class="rounded-circle" />
                        <div className='mark-title'>友善環境</div>
                        <p>提升大眾對環境生態重要性的意識，在耕作過程或是服務過程強調永續環保。</p>
                    </div>
                </div>
                <div className='mark'>
                    <div className='mark-border'>
                        <img className='mark-img' src={ovolacto} alt='ovolacto' style={{ width: '150px', height: '150px' }} class="rounded-circle" />
                        <div className='mark-title'>蛋奶素</div>
                        <p>食用植物性食品之外，還可食用蛋製品及奶製品的食物。</p>
                    </div>
                </div>
                <div className='mark'>
                    <div className='mark-border'>
                        <img className='mark-img' src={plasticbag} alt='plasticbag' style={{ width: '150px', height: '150px' }} class="rounded-circle" />
                        <div className='mark-title'>減塑</div>
                        <p>減少、甚至不用塑膠製品。也向顧客傳達同樣的理念，作為環保愛地球的大使。</p>
                    </div>
                </div>

                <div className='mark'>
                    <div className='mark-border'>
                        <img className='mark-img' src={organic} alt='organic' style={{ width: '150px', height: '150px' }} class="rounded-circle" />
                        <div className='mark-title'>有機小農</div>
                        <p>耕作過程使用有機的方式，提供消費者最安全的食材。</p>
                    </div>
                </div>
                <div className='mark'>
                    <div className='mark-border'>
                        <img className='mark-img' src={vegetarianism} alt='vegetarianism' style={{ width: '150px', height: '150px' }} class="rounded-circle" />
                        <div className='mark-title'>純素</div>
                        <p>可以吃各種類的植物，但除了植物外的食物絕對不碰。</p>
                    </div>
                </div>
                <div className='mark'>
                    {/* <div className='dot' /> */}
                    <div className='mark-border'>
                        <img className='mark-img' src={freetrade} alt='freetrade' style={{ width: '150px', height: '150px' }} class="rounded-circle" />
                        <div className='mark-title'>公平交易</div>
                        <p>公平貿易的產品保障對生產者收購的公平價格，同時也遵從國際勞工組織的規範，禁止童工或奴工、保障安全的工作場所及組成工會的權利。公平貿易不是施捨，而是提供生產者一種永續的方法來改善生計，讓他們真正有機會脫離貧窮，不再需要依靠捐款者的援助。</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Book;