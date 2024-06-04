import { BackButton } from "@twa-dev/sdk/react";

import { getTeams } from "../../utils/queries/teams/getTeams";
import { useEffect, useState } from "react";

import './Teams.css';

interface ITeam {
    team_id: number;
    team_name: string;
    /* team_score: number;
    team_members: string[];
    team_owner: string;
    team_created_at: string;
    team_updated_at: string;
    team_deleted_at: string; */
}

const Teams = ({ userId, setRoutes }) => {

    const [allTeams, setTeams] = useState<ITeam[]>([]);
    console.log(userId)

    const getTeamsFn = async () => {
        const teams = await getTeams();
        setTeams(teams)
        console.log(teams)
    }

    useEffect(() => {
        getTeamsFn();
    }, [])

    return (
        <div style={{ position: 'relative' }}>
            <BackButton onClick={() => setRoutes('main')} />
                <p>You're not on the team yet</p>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', gap: '1px', alignItems: 'center', margin: '0 1rem' }}>
                <input type="text" /* value={userId} */ placeholder='Search' style={{ margin: '0.4rem', border: '1px solid rgba(14, 165, 233, 0.4)', borderRadius: '0.25rem', padding: '0.5rem 0.3rem', width: '60vw' }} />
                <p style={{ top: '1rem' }}>or</p>
                <button className='white' style={{ background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0rem 0.5rem', height: '2rem' }}><h3>Create</h3></button>
            </div>

            {allTeams.map((team: ITeam) => {
                return (
                    <div key={team.team_id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0.5rem 1rem', padding: '0.5rem', borderRadius: '0.25rem', background: 'rgba(14, 165, 233, 0.4)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px, rgba(0, 0, 0, 0.1) 0px 0px 0px' }}>
                        <p style={{ flex: '1', textAlign: 'left' }}>{team.team_name}</p>
                        <h3 style={{ flex: '1' }}>score</h3>
                        <h3 className='white' style={{ flex: '0.3', background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0.05rem 0.3rem' }}
                        >Join</h3>
                    </div>
                )
            })}

        </div >
    )
}

export default Teams;
