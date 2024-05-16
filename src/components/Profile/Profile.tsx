import WebApp from "@twa-dev/sdk";


const Profile = ({ userId }) => {

    console.log(userId)
    console.log(WebApp.initDataUnsafe)
    console.log(WebApp.initDataUnsafe.user)

    return (
        <div>
            <h1>Profile</h1>
        </div>
    )
}

export default Profile;
