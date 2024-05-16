const Teams = ({ userId }) => {

    console.log(userId)
    return (
        <div style={{ position: 'relative' }}>

                <p>You're not on the team yet</p>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', gap: '1px', alignItems: 'center', margin: '0 1rem' }}>
                <input type="text" /* value={userId} */ placeholder='Search' style={{ margin: '0.4rem', border: '1px solid rgba(14, 165, 233, 0.4)', borderRadius: '0.25rem', padding: '0.5rem 0.3rem', width: '60vw' }} />
                <p style={{ top: '1rem' }}>or</p>
                <button style={{ background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0rem 0.5rem', height: '2rem' }}>Create</button>
            </div>

            <div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0.5rem 1rem', padding: '0.5rem', borderRadius: '0.25rem', background: 'rgba(14, 165, 233, 0.4)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px, rgba(0, 0, 0, 0.1) 0px 0px 0px' }}>
                    <p>team_linkname_0</p>
                    <h3>score</h3>
                    <h3 style={{ background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0.05rem 0.3rem' }}
                    >Join</h3>
                </div>
            </div>

            <div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0.5rem 1rem', padding: '0.5rem', borderRadius: '0.25rem', background: 'rgba(14, 165, 233, 0.4)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px, rgba(0, 0, 0, 0.1) 0px 0px 0px' }}>
                    <p>team_linkname_1</p>
                    <h3>score</h3>
                    <h3 style={{ background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0.05rem 0.3rem' }}
                    >Join</h3>
                </div>
            </div>

            <div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0.5rem 1rem', padding: '0.5rem', borderRadius: '0.25rem', background: 'rgba(14, 165, 233, 0.4)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px, rgba(0, 0, 0, 0.1) 0px 0px 0px' }}>
                    <p>team_linkname_2</p>
                    <h3>score</h3>
                    <h3 style={{ background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0.05rem 0.3rem' }}
                    >Join</h3>
                </div>
            </div>

            <div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0.5rem 1rem', padding: '0.5rem', borderRadius: '0.25rem', background: 'rgba(14, 165, 233, 0.4)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px, rgba(0, 0, 0, 0.1) 0px 0px 0px' }}>
                    <p>team_linkname_3</p>
                    <h3>score</h3>
                    <h3 style={{ background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0.05rem 0.3rem' }}
                    >Join</h3>
                </div>
            </div>

            <div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0.5rem 1rem', padding: '0.5rem', borderRadius: '0.25rem', background: 'rgba(14, 165, 233, 0.4)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px, rgba(0, 0, 0, 0.1) 0px 0px 0px' }}>
                    <p>team_linkname_4</p>
                    <h3>score</h3>
                    <h3 style={{ background: 'rgb(14, 165, 233)', borderRadius: '0.25rem', padding: '0.05rem 0.3rem' }}
                    >Join</h3>
                </div>
            </div>

        </div >
    )
}

export default Teams;
