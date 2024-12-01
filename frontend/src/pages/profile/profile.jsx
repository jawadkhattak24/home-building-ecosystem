import PropTypes from "prop-types";
import ViewProfessionalProfile from "../professionalProfile/viewProfessionalProfile/viewProfessionalProfile";
// import ViewSupplierProfile from "../supplierProfile/viewSupplierProfile/viewSupplierProfile";
import { useParams } from "react-router-dom";
const Profile = () => {
  const { userId } = useParams();
  console.log("User id in profile", userId);
  return (
    <div>
      {userId && userId.userType === "professional" ? (
        <ViewProfessionalProfile userId={userId} />
      ) : (
        // <ViewSupplierProfile userId={userId} />
        <div>Supplier Profile</div>
      )}
    </div>
  );
};

Profile.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default Profile;
