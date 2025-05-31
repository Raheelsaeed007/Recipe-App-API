import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  console.log("Logged-in user info:", user);

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">Welcome {user?.username}</h2>
      <p className="text-gray-700">Email: {user?.email}</p>
    </div>
  );
};

export default Profile;
