import Header from "./Header";
import './Protected.css';


const Profile = () => {

      const { 
        data: user, 
        isLoading, 
        error, 
        refetch 
      } = useGetUserProfileQuery();

    return(
        <div className="app">
            <Header />
        </div>
    );
};

export default Profile;