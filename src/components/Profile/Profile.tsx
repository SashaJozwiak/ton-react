//import WebApp from "@twa-dev/sdk";
import { BackButton } from "@twa-dev/sdk/react";
import { useEffect, useState } from "react";
import { TonConnectButton } from '@tonconnect/ui-react';
//import { useTonConnect } from '../../hooks/useTonConnect';


const Profile = ({ userId, setRoutes, authData }) => {
    const [isTeam, setIsTeam] = useState<boolean>(false);
    const [link, setLink] = useState<string>(`https://t.me/fitton_bot?start=${userId}`);
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true)
            const timerId = setTimeout(() => {
                setCopied(false);
            }, 2000);

            return () => clearTimeout(timerId);
        }).catch(err => {
            setCopied(false)
            console.error('Error copying link', err);
        });

    }

    const changeLink = () => {
        setIsTeam(prevIsTeam => {
            const newIsTeam = !prevIsTeam;
            if (newIsTeam) {
                setLink(`https://t.me/fitton_bot?start=${userId}_${authData.ref_team_by}`);
            } else {
                setLink(`https://t.me/fitton_bot?start=${userId}`);
            }
            return newIsTeam;
        });
    }

    useEffect(() => {
        if (authData.ref_team_by) {
            console.log('authData team: ', authData.ref_team_by);
            setIsTeam(true);
            const linkWithTeam = `https://t.me/fitton_bot?start=${userId}_${authData.ref_team_by}`;
            setLink(linkWithTeam)
        } else {
            setIsTeam(false);
            console.log('authData no team:', authData);
            const link = `https://t.me/fitton_bot?start=${userId}`;
            setLink(link)
        }
    }, [authData, userId])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <BackButton onClick={() => setRoutes('main')} />
            <h2>Hi, champion!</h2>

            <TonConnectButton />
            <div style={{ marginTop: '1em', display: 'flex', flexDirection: 'column' }}>
                <h2 >Invite frens</h2>
                <input
                    type="text"
                    readOnly={true}
                    style={{ margin: '0.4rem', border: '1px solid rgba(14, 165, 233, 0.4)', borderRadius: '0.25rem', padding: '0.5rem 0.3rem', width: '60vw', textAlign: 'center', background: 'lightgray' }}
                    value={link}
                />
                <div style={{ display: 'flex', alignItems: 'center', margin: '0 auto' }}>
                    <input type="checkbox" id='withteam' readOnly={true} disabled={!authData.ref_team_by} checked={isTeam}
                        style={{ border: '1px solid rgba(14, 165, 233, 0.4)', borderRadius: '0.25rem', transform: 'scale(1.3)' }}
                        onChange={changeLink} />
                    <label htmlFor="withteam" style={{ fontSize: 'calc(1.2vh + 1.2vw)' }}>&nbsp;and invite to your team</label>
                </div>
                <button onClick={handleCopyClick}
                    style={{ background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0rem 0.5rem', margin: '2vh 0', height: '2rem', fontSize: 'calc(1.3vh + 1.3vw)', fontWeight: 'bold', color: 'white' }}
                ><h3 style={{ display: 'inline-block' }}>Copy Link</h3>{copied && ' ✅'}</button>
            </div>
        </div>
    )
}

export default Profile;
