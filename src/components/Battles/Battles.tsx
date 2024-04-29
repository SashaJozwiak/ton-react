const Battles = () => {
    return (
        <div>
            <h3 style={{ fontFamily: 'monospace', color: 'rgb(100 116 139)' }}><span style={{ border: '0px solid grey', color: 'rgb(14, 165, 233)', borderRadius: '0.3em', padding: '0.1rem 0.3rem', background: 'rgba(14, 165, 233, 0.15)' }}>
                3
            </span>
                <p style={{ display: 'inline' }}> battles are available to you</p>
            </h3>
            <button
                style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(14, 165, 233, 0.15)', borderRadius: '0.25rem', boxShadow: '0 0px 5px rgba(0,0,0,0.1), 0 0px 0px rgba(0,0,0,0.1)', color: 'rgb(14 165 233)', fontWeight: 'bold' }}>Find an opponent
            </button>
            {/* <button></button> */}
        </div>
    )
}

export default Battles
