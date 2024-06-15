import { useEffect, useState } from "react";
import { BackButton } from "@twa-dev/sdk/react";

import { getTeams, getTeamId, getAllScores } from "../../utils/queries/teams/getTeams";
import { createTeam, inOutTeam } from "../../utils/queries/teams/postTeams";

import './Teams.css';

interface ITeam {
    team_id: number;
    team_name: string;
    score?: number;
}

const Teams = ({ userId, setRoutes }) => {
    const [allTeams, setTeams] = useState<ITeam[]>([]);
    const [myTeam, setMyTeam] = useState<ITeam | null>(null);
    const [myTeamId, setMyTeamId] = useState<number | null>(null);

    const [teamChanged, setTeamChanged] = useState<boolean>(false);

    const [searchTerm, setSearchTerm] = useState<string>('');

    const getTeamsFn = async () => {
        const teams = await getTeams();
        const getMyTeamId = await getTeamId(userId);

        // Fetch scores and integrate them with teams
        const scores = await getAllScores();
        console.log('Fetched scores:', scores);

        // Map scores to teams and add score property
        const teamsWithScores = teams.map(team => {
            const teamScore = scores.find(score => score.team_id === team.team_id);
            return {
                ...team,
                score: teamScore ? Number(teamScore.total_sum) : 0
            };
        });

        // Sort teams by score in descending order
        teamsWithScores.sort((a: ITeam, b: ITeam) => (b.score ?? 0) - (a.score ?? 0));

        setTeams(teamsWithScores);
        setMyTeamId(getMyTeamId);
        console.log('Teams with scores:', teamsWithScores);
    };

    const joinOrLeaveTeam = async (value: string, teamId: number) => {
        const inout = value === 'Join' ? 'in' : 'out';
        console.log('InOut:', inout);
        await inOutTeam(userId, teamId, inout);
        await getTeamsFn()
        setTeamChanged(!teamChanged);
    }
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCreateTeam = async () => {
        console.log('Creating team with name:', searchTerm);
        // Add create team logic
        await createTeam(userId, searchTerm);
        setTeamChanged(!teamChanged);
    };

    useEffect(() => {
        console.log('Fetching teams...');
        getTeamsFn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamChanged])

    useEffect(() => {
        const getMyTeam = allTeams.find(team => team.team_id === myTeamId);
        if (getMyTeam) {
            console.log('Found my team:', getMyTeam);
            setMyTeam(getMyTeam)
        } else {
            console.log('No team found for myTeamId:', myTeamId);
            setMyTeam(null);
        }

    }, [allTeams, myTeamId])

    const filteredTeams = allTeams.filter(team =>
        team.team_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ position: 'relative' }}>
            <BackButton onClick={() => setRoutes('main')} />

            {myTeam ? (
                <div key={myTeam.team_id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0.5rem 1rem', padding: '0.5rem', border: '2px solid rgb(14, 165, 233)', borderRadius: '0.25rem', background: 'rgba(14, 165, 233, 0.4)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px, rgba(0, 0, 0, 0.1) 0px 0px 0px' }}>
                    <h3 className='teamname' style={{ flex: '1.3', textAlign: 'left', fontSize: '0.9rem' }}>{myTeam.team_name}</h3>
                    <p style={{ flex: '1', fontWeight: 'bold', fontSize: '1rem' }}>{myTeam.score || 0}</p>
                    <button
                        onClick={(e) => joinOrLeaveTeam((e.target as HTMLButtonElement).textContent || "", myTeam.team_id)}
                        style={{ flex: '0.3', background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0.3rem 0.5rem', fontWeight: 'bold' }}
                    >Leave</button>
                </div>
            ) : <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0.5rem 1rem', padding: '0.5rem', border: '1px solid rgb(14, 165, 233)', borderRadius: '0.25rem', background: 'rgba(14, 165, 233, 0.4)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px, rgba(0, 0, 0, 0.1) 0px 0px 0px' }}>
                <p>You're not on the team yet</p>
            </div>}

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1px', alignItems: 'center', margin: '0 1rem' }}>
                <input
                    value={searchTerm}
                    onChange={handleInputChange}
                    type="text" /* value={userId} */ placeholder='Search' style={{ margin: '0.4rem', border: '1px solid rgba(14, 165, 233, 0.4)', borderRadius: '0.25rem', padding: '0.5rem 0.3rem', width: '60vw' }} />
                <p style={{ top: '1rem', margin: '0 auto' }}>/</p>
                <button
                    onClick={handleCreateTeam}
                    disabled={!(filteredTeams.length === 0)}
                    className='white' style={{ background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0rem 0.5rem', height: '2rem', opacity: filteredTeams.length === 0 ? 1 : 0.5 }}><h3>Create</h3>
                </button>
            </div>

            <div style={{ overflow: 'scroll', height: '55vh' }}>
            {filteredTeams.map((team: ITeam, indx: number) => {
                return (
                    <div key={team.team_id} className={team.team_id === myTeamId ? "myTeam" : ""} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0.5rem 1rem', padding: '0.5rem', borderRadius: '0.25rem', background: 'rgba(14, 165, 233, 0.4)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px, rgba(0, 0, 0, 0.1) 0px 0px 0px' }}>
                        <h3 className='teamname' style={{ flex: '1.3', textAlign: 'left', fontSize: '0.9rem' }}>
                            <p style={{ display: 'inline-block', color: 'white', background: 'rgb(14, 165, 233)', border: '1px solid gray', borderRadius: '20%', padding: '1.5% 3%' }}>{indx + 1}</p>&nbsp;
                            {team.team_name}
                        </h3>
                        <p style={{ flex: '1', fontSize: '1rem' }}>{team.score || 0}</p>
                        <button
                            onClick={(e) => joinOrLeaveTeam((e.target as HTMLButtonElement).textContent || "", team.team_id)}
                            className={team.team_id === myTeamId ? "black" : "white"} style={{ flex: '0.3', background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0.3rem 0.5rem' }}
                        >{team.team_id === myTeamId ? "Leave" : "Join"}</button>
                    </div>
                )
            })}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1px', alignItems: 'center', margin: '0 1rem' }}>
                    <input
                        value={searchTerm}
                        onChange={handleInputChange}
                        type="text" /* value={userId} */ placeholder='Search' style={{ margin: '0.4rem', border: '1px solid rgba(14, 165, 233, 0.4)', borderRadius: '0.25rem', padding: '0.5rem 0.3rem', width: '60vw' }} />
                    <p style={{ top: '1rem', margin: '0 auto' }}>/</p>
                    <button
                        onClick={handleCreateTeam}
                        disabled={!(filteredTeams.length === 0)}
                        className='white' style={{ background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0rem 0.5rem', height: '2rem', opacity: filteredTeams.length === 0 ? 1 : 0.5 }}><h3>Create</h3>
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1px', alignItems: 'center', margin: '0 1rem' }}>
                    <input
                        value={searchTerm}
                        onChange={handleInputChange}
                        type="text" /* value={userId} */ placeholder='Search' style={{ margin: '0.4rem', border: '1px solid rgba(14, 165, 233, 0.4)', borderRadius: '0.25rem', padding: '0.5rem 0.3rem', width: '60vw' }} />
                    <p style={{ top: '1rem', margin: '0 auto' }}>/</p>
                    <button
                        onClick={handleCreateTeam}
                        disabled={!(filteredTeams.length === 0)}
                        className='white' style={{ background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0rem 0.5rem', height: '2rem', opacity: filteredTeams.length === 0 ? 1 : 0.5 }}><h3>Create</h3>
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1px', alignItems: 'center', margin: '0 1rem' }}>
                    <input
                        value={searchTerm}
                        onChange={handleInputChange}
                        type="text" /* value={userId} */ placeholder='Search' style={{ margin: '0.4rem', border: '1px solid rgba(14, 165, 233, 0.4)', borderRadius: '0.25rem', padding: '0.5rem 0.3rem', width: '60vw' }} />
                    <p style={{ top: '1rem', margin: '0 auto' }}>/</p>
                    <button
                        onClick={handleCreateTeam}
                        disabled={!(filteredTeams.length === 0)}
                        className='white' style={{ background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0rem 0.5rem', height: '2rem', opacity: filteredTeams.length === 0 ? 1 : 0.5 }}><h3>Create</h3>
                    </button>
                </div>
            </div>
        </div >
    )
}

export default Teams;
