import React, {useRef, useState,useEffect,useContext} from 'react';
import cl from "./roulette.module.scss"
import RouletteItem from "./RouletteItem/RouletteItem";
import {Roulette, weaponAttributes, rouletteAttributes} from "../../roulette.classes";
import AuthContext from '../../context/AuthContext';
import Grid from '@mui/material/Grid';
import { withEmotionCache } from '@emotion/react';
import axios ,{AxiosResponse} from 'axios'
import { useDispatch } from "react-redux";

interface RouletteElementParams {
    transitionDuration: number
}


const McRoulette = ({
                             transitionDuration
    }: RouletteElementParams) => {
    const didMount = useRef(false);
    
    const [profile,setProfile] = useState<never>(Object())

    const [weapons, setWeapons] = useState([])
    const [rouletteWeapons, setRouletteWeapons] = useState<weaponAttributes[]>(weapons)
    const [weaponPrizeId, setWeaponPrizeId] = useState<number>(-1)
    const [isReplay, setIsReplay] = useState<boolean>(false)
    const [isSpin, setIsSpin] = useState<boolean>(false)
    const [isWinnerGet, setIsWinnerGet] = useState<boolean>()
    const [isSpinEnd, setIsSpinEnd] = useState<boolean>(false)
    const [winHistory, setWinHistory] = useState<weaponAttributes[]>([])

    const rouletteContainerRef = useRef<HTMLDivElement>(null)
    const weaponsRef = useRef<HTMLDivElement>(null)

    const [winner, setWinner] = useState<never>(Object())
    const isMounted = useRef(false); // Ref to track if component is mounted


    useEffect(() => {

        if (!isMounted.current) {
            getWeapons()
        }
    },[])
                        
    const getWeapons = async() => {
        let response = await fetch('http://127.0.0.1:8000/api/weapon?'+new URLSearchParams({
            slot_name: 'CSGO_1',
        }))

        let data = await response.json()
        if(response.status === 200){
            setRouletteWeapons(data);
            setWeapons(data);
        } 

        await axios.get('http://127.0.0.1:8000/api/profile', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization':'Bearer ' + String(JSON.parse(localStorage.getItem('authTokens')!)['access'] )
            }
            }).then((response) => response.data)
            .then((data) => setProfile(data))

            
    }

    function transitionEndHandler() {
        setWinHistory(winHistory.concat(rouletteWeapons[weaponPrizeId]))
        setIsSpin(false)
        setIsSpinEnd(true)
        
    }

    function prepare() {
        weaponsRef.current!.style.transition = "none"
        weaponsRef.current!.style.left = "0px"
    }

    function load() {
        // let winner = winner;
        //// Не высвечивается winner нужно сделать рандомную генерацию weapons чтобы их было больше

        const roulette = new Roulette({
            winner,
            weapons,
            rouletteContainerRef,
            weaponsRef,
            weaponsCount: weapons.length,
            transitionDuration: transitionDuration
        });

        roulette.set_weapons()
        setRouletteWeapons(weapons)

        return roulette
    }


    async function getWinner() {

        let auth = JSON.parse(localStorage.getItem('authTokens')!)['access'] 
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth
          }
        const response = await axios.post('http://127.0.0.1:8000/api/run_roulette?' + new URLSearchParams({ slot_name: 'CSGO_1',}), {},
                {headers:headers})
        
                setWinner(response.data)

    // Dependency array ensures useEffect runs only when isSpin or isReplay changes

    }

    useEffect(() => {
        // action on update of movies

        if (didMount.current)         {       
            setIsSpin(true);
            if (isReplay) {
                prepare();
            }
            setTimeout( () => {


                const roulette = load();
                setRouletteWeapons(roulette.weapons);
                        // setIsSpin(true);
                setWeaponPrizeId(roulette.spin());
                setIsReplay(true);
        },1000);
        }
        else didMount.current = true;
    }, [winner]);

    const renderButton = () => {
        if (localStorage.getItem('authTokens') === null)
        return (     <Grid container spacing={3} id="grid">            
        <Grid item xs={4}>
            <button className={cl.button} disabled={true} >Roll</button>
        </Grid>
    </Grid>)
     return     (            
     <Grid container spacing={3} id="grid">            
            <Grid item xs={4}>
                <button className={cl.button} disabled={isSpin} onClick={async() => await getWinner()}>Roll</button>
            </Grid>
        </Grid>
 )
    }

    console.log(profile['money'])

    return (
        
        <div>
            <div className={cl.rouletteWrapper}>
            <div><p>{profile['money']}</p></div>
                <div ref={rouletteContainerRef}>
                    <div className={cl.evRoulette}>
                        <div className={cl.evTarget}></div>
                        <div ref={weaponsRef} className={cl.evWeapons} onTransitionEnd={transitionEndHandler}>
                            {
                            rouletteWeapons.map((w, i) => {
                                return <RouletteItem
                                    key={i}
                                    id={i}
                                    isLoser={(i !== weaponPrizeId) && !isSpin && isSpinEnd}
                                    weapon_name={w.weapon_name}
                                    skin_name={w.skin_name}
                                    rarity={w.rarity}
                                    steam_image={w.steam_image}
                                />
                            })
                            }
                        </div>
                    </div>
                </div>
                {renderButton()}
            </div>
        </div>
       
    );
};

export default McRoulette;