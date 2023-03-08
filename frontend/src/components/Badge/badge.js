import React from 'react'

function Badges(props){
    const BadgeShow = ({ImgSrc, t, show}) => {
        if(show){
            return (
                <img 
                  src={ImgSrc} 
                  alt={t}
                  style={{width:'35px', height:'35px', margin:'1px'}}
                  title={t}
                />
              )
        }
        return null;   
    }

    return(
        <div>
            <BadgeShow ImgSrc={require('../../Badge/t_careweak.png')} t={'關懷弱勢'} show={true}/>
            <BadgeShow ImgSrc={require('../../Badge/t_envfriend.png')} t={'友善環境'} show={true}/>
            <BadgeShow ImgSrc={require('../../Badge/t_foodeduc.png')} t={'食育教育'} show={true}/>
            <BadgeShow ImgSrc={require('../../Badge/t_freetrade.png')} t={'公平交易'} show={true}/>
            <BadgeShow ImgSrc={require('../../Badge/t_localgred.png')} t={'在地食材'} show={true}/>
            <BadgeShow ImgSrc={require('../../Badge/t_organic.png')} t={'有機小農'} show={true}/>
            <BadgeShow ImgSrc={require('../../Badge/t_ovolacto.png')} t={'蛋奶素'} show={true}/>
            <BadgeShow ImgSrc={require('../../Badge/t_petfriend.png')} t={'寵物友善'} show={true}/>
            <BadgeShow ImgSrc={require('../../Badge/t_noplastic.png')} t={'減塑'} show={true}/>
            <BadgeShow ImgSrc={require('../../Badge/t_publicissue.png')} t={'公共議題分享'} show={true}/>
            <BadgeShow ImgSrc={require('../../Badge/t_stray.png')} t={'流浪動物'} show={true}/>
            <BadgeShow ImgSrc={require('../../Badge/t_vegetarianism.png')} t={'純素'} show={true}/>
        </div>
    )
}

export default Badges;