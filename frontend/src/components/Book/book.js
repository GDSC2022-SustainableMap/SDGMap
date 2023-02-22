import React from 'react';
import './book.css';
import petfriend from '../../Badge/t_petfriend.png';
import stray from '../../Badge/t_stray.png';
import publicissue from '../../Badge/t_publicissue.png';
import careweak from '../../Badge/t_careweak.png';
import foodeduc from '../../Badge/t_foodeduc.png';
import localgred from '../../Badge/t_localgred.png';
import envfriend from '../../Badge/t_envfriend.png';
import ovolacto from '../../Badge/t_ovolacto.png';
import plasticbag from '../../Badge/t_noplastic.png';
import organic from '../../Badge/t_organic.png';
import vegetarianism from '../../Badge/t_vegetarianism.png';
import freetrade from '../../Badge/t_freetrade.png';


function Book(){
    return(
        <div>
            <h1>SDGBook</h1>
            <div className='wrap'>
                    <div className='mark' style={{order:'9'}}>
                        <img src={petfriend} alt='petfriendly' style={{width:'150px', height:'150px'}} class="rounded-circle"/>
                        <h2>寵物友善</h2>
                        <p className='book-p'>除了寵物可以進入外，經過規劃，讓環境對寵物是友善的。同時，也需要與寵物的主人達成共識，讓餐廳也可以照顧到一般民眾的需求。</p>
                    </div>
                    <div className='mark' style={{order:'6'}}>
                        <img src={stray} alt='strayanimal' style={{width:'150px', height:'150px'}} class="rounded-circle"/>
                        <h2>流浪動物</h2>
                        <p className='book-p'>幫助流浪動物，提供中途的溫暖也為浪浪的生活產生新的希望。</p>
                    </div>
                    <div className='mark' style={{order:'8'}}>
                        <img src={publicissue} alt='publicissue' style={{width:'150px', height:'150px'}} class="rounded-circle"/>  
                        <h2>公共議題分享</h2>
                        <p className='book-p'>餐廳內會舉辦講座(不限主題)，或是會分享公共議題，希望透過店家的力量為社會貢獻心力。</p>
                    </div>
                    <div className='mark' style={{order:'10'}}>
                        <img src={careweak} alt='careforweak' style={{width:'150px', height:'150px'}} class="rounded-circle"/>  
                        <h2>關懷弱勢</h2>
                        <p className='book-p'>店家透過自身的力量幫助弱勢族群，也提供客人更了解相關的弱勢族群的機會，讓彼此可以有更多溫暖的交流。</p>
                    </div>
                    <div className='mark' style={{order:'0'}}>
                        <img src={foodeduc} alt='foodeducation' style={{width:'150px', height:'150px'}} class="rounded-circle"/>
                        <h2>食育教育</h2>
                        <p className='book-p'>用料理或是餐飲傳達教育意義或是生活理念。</p>
                    </div>
                    <div className='mark' style={{order:'7'}}>
                        <img src={localgred} alt='localgredient' style={{width:'150px', height:'150px'}} class="rounded-circle"/>
                        <h2>在地食材</h2>
                        <p className='book-p'>使用本土食材，創造美味的同時也減少碳足跡為地球盡一份心力。</p>
                    </div>
                    <div className='mark' style={{order:'3'}}>
                        <img src={envfriend} alt='envirionmentfriendly' style={{width:'150px', height:'150px'}} class="rounded-circle"/>
                        <h2>友善環境</h2>
                        <p className='book-p'>提升大眾對環境生態重要性的意識，在耕作過程或是服務過程強調永續環保。</p>
                    </div>
                    <div className='mark' style={{order:'4'}}>
                        <img src={ovolacto} alt='ovolacto' style={{width:'150px', height:'150px'}} class="rounded-circle"/>
                        <h2>蛋奶素</h2>
                        <p className='book-p'>食用植物性食品之外，還可食用蛋製品及奶製品的食物。</p>
                    </div>
                    <div className='mark' style={{order:'5'}}>
                        <img src={plasticbag} alt='plasticbag' style={{width:'150px', height:'150px'}} class="rounded-circle"/>
                        <h2>減塑</h2>
                        <p className='book-p'>減少、甚至不用塑膠製品。也向顧客傳達同樣的理念，作為環保愛地球的大使。</p>
                    </div>
                    <div className='mark' style={{order:'1'}}>
                        <img src={organic} alt='organic' style={{width:'150px', height:'150px'}} class="rounded-circle"/>
                        <h2>有機小農</h2>
                        <p className='book-p'>耕作過程使用有機的方式，提供消費者最安全的食材。</p>
                    </div>
                    <div className='mark' style={{order:'2'}}>
                        <img src={vegetarianism} alt='vegetarianism' style={{width:'150px', height:'150px'}} class="rounded-circle"/>
                        <h2>純素</h2>
                        <p className='book-p'>可以吃各種類的植物，但除了植物外的食物絕對不碰。</p>
                    </div>
                    <div className='mark' style={{order:'11'}}>
                        <img src={freetrade} alt='freetrade' style={{width:'150px', height:'150px'}} class="rounded-circle"/>
                        <h2>公平交易</h2>
                        <p className='book-p'>公平貿易的產品保障對生產者收購的公平價格，同時也遵從國際勞工組織的規範，禁止童工或奴工、保障安全的工作場所及組成工會的權利。公平貿易不是施捨，而是提供生產者一種永續的方法來改善生計，讓他們真正有機會脫離貧窮，不再需要依靠捐款者的援助。</p>
                    </div>
                
            </div>
        </div>
    )
}

export default Book;