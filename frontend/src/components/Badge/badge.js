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
            <BadgeShow ImgSrc={require('../../Badge/t_publicissue.png')} t={'關懷弱勢'} show={props.data.publicissue}/>
            <BadgeShow ImgSrc={require('../../Badge/t_freetrade.png')} t={'友善環境'} show={props.data.freetrade}/>
            <BadgeShow ImgSrc={require('../../Badge/t_careforweak.png')} t={'關懷弱勢'} show={props.data.t_careforweak}/>
            <BadgeShow ImgSrc={require('../../Badge/t_envfriend.png')} t={'友善環境'} show={props.data.envfriend}/>
            <BadgeShow ImgSrc={require('../../Badge/t_foodeduc.png')} t={'食育教育'} show={props.data.foodeduc}/>
            <BadgeShow ImgSrc={require('../../Badge/t_freetrade.png')} t={'公平交易'} show={props.data.freetrade}/>
            <BadgeShow ImgSrc={require('../../Badge/t_localgred.png')} t={'在地食材'} show={props.data.localgred}/>
            <BadgeShow ImgSrc={require('../../Badge/t_organic.png')} t={'有機小農'} show={props.data.organic}/>
            <BadgeShow ImgSrc={require('../../Badge/t_ovolacto.png')} t={'蛋奶素'} show={props.data.ovolacto}/>
            <BadgeShow ImgSrc={require('../../Badge/t_petfriend.png')} t={'寵物友善'} show={props.data.petfriend}/>
            <BadgeShow ImgSrc={require('../../Badge/t_noplastic.png')} t={'減塑'} show={props.data.noplastic}/>
            <BadgeShow ImgSrc={require('../../Badge/t_publicissue.png')} t={'公共議題分享'} show={props.data.publicissue}/>
            <BadgeShow ImgSrc={require('../../Badge/t_stray.png')} t={'流浪動物'} show={props.data.stray}/>
            <BadgeShow ImgSrc={require('../../Badge/t_vegetarianism.png')} t={'純素'} show={props.data.vegetarianism}/>
            <BadgeShow ImgSrc={require('../../Badge/t_foodagricultureeducation.png')} t={'食農教育'} show={props.data.foodagricultureeducation}/>
            <BadgeShow ImgSrc={require('../../Badge/t_appreciatefood.png')} t={'惜食不浪費'} show={props.data.appreciatefood}/>
            <BadgeShow ImgSrc={require('../../Badge/t_creativecuisine.png')} t={'創意料理'} show={props.data.creativecuisine}/>
            <BadgeShow ImgSrc={require('../../Badge/t_creativevegetarian.png')} t={'創新蔬食'} show={props.data.creativevegetarian}/>
            <BadgeShow ImgSrc={require('../../Badge/t_sourcereduction.png')} t={'源頭減量'} show={props.data.sourcereduction}/>
            <BadgeShow ImgSrc={require('../../Badge/t_greenprocurement.png')} t={'綠色採購'} show={props.data.greenprocurement}/>
        </div>
    )
}

export default Badges;