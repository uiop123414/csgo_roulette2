import React, {useRef, useState,useEffect,useContext} from 'react';
import cl from "./roulette.module.scss"
import RouletteItem from "./RouletteItem/RouletteItem";
import {Roulette, weaponAttributes} from "../../roulette.classes";
import AuthContext from '../../context/AuthContext';

interface RouletteElementParams {
    transitionDuration: number
}

const McRoulette = ({
                             transitionDuration
    }: RouletteElementParams) => {

    const [weapons, setWeapons] = useState([])
    const [rouletteWeapons, setRouletteWeapons] = useState<weaponAttributes[]>(weapons)
    const [weaponPrizeId, setWeaponPrizeId] = useState<number>(-1)
    const [isReplay, setIsReplay] = useState<boolean>(false)
    const [isSpin, setIsSpin] = useState<boolean>(false)
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
        // let winner = weapons[Math.floor(Math.random() * weapons.length)];
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

    const copyItemsTenTimes = (array: weaponAttributes[]): weaponAttributes[] => {
        const copiedArray: weaponAttributes[] = [];
        array.forEach(item => {
            for (let i = 0; i < 10; i++) {
                copiedArray.push(item);
            }
        });
        return copiedArray;
    };

    //Два раза приходят запросы сразу и после прокрута
    const run_roulette = async() => {
        let auth = JSON.parse(localStorage.getItem('authTokens')!)['access'] 
        let response = await fetch('http://127.0.0.1:8000/api/run_roulette?' + new URLSearchParams({
            slot_name: 'CSGO_1',
        }),
        {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + auth
            },
        }
        )
        localStorage.getItem('authTokens')
        let data = await response.json()
        if(response.status === 200){
            setWinner(data)
        } 
    }

    useEffect(() => {
        if(isSpin){
            if (isReplay) {
                prepare();
            }
            run_roulette()

            const roulette = load();
            setRouletteWeapons(roulette.weapons);
            setTimeout(() => {
                    // setIsSpin(true);
                    setWeaponPrizeId(roulette.spin());
                    setIsReplay(true);
            }, 1000);
        setIsSpin(false);
        }
    }, [isSpin]); // Dependency array ensures useEffect runs only when isSpin or isReplay changes

    const Play = () => {
        setIsSpin(true);
    };
    return (
        <div>
            <div className={cl.rouletteWrapper}>
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
                <button className={cl.button} disabled={isSpin} onClick={Play}>Roll</button>
            </div>
        </div>
    );
};

export default McRoulette;