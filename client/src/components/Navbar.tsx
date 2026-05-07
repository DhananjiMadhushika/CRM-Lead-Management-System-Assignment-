import axios from "axios";
import { useEffect, useState } from "react";
import { HiOutlineSearch, HiOutlineBell, HiMenuAlt2 } from "react-icons/hi";

const Navbar = () => {
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: token },
        });

        if (response.status === 200) {
          setUserName(response.data.name || "");
          setUserImage(response.data.userImage || "");
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUser();
  }, []);

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-100">
      <div className="flex items-center flex-1 gap-4">
        <button className="text-gray-400 lg:hidden hover:text-gray-600">
          <HiMenuAlt2 className="w-6 h-6" />
        </button>

        <div className="relative w-full max-w-md">
          <HiOutlineSearch className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads, companies, contacts..."
            className="w-full py-2 pr-4 text-sm placeholder-gray-400 transition-all border border-gray-200 rounded-full pl-9 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4">
        {/* Bell */}
        <button className="relative flex items-center justify-center transition-colors rounded-full w-9 h-9 hover:bg-gray-100">
          <HiOutlineBell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="flex items-center gap-2.5">
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              className="object-cover border-2 border-gray-100 rounded-full w-9 h-9"
            />
          ) : (
            <div className="flex items-center justify-center flex-shrink-0 text-sm font-bold text-white bg-blue-600 rounded-full w-9 h-9">
              {initials}
            </div>
          )}
          <span className="hidden text-sm font-semibold text-gray-700 md:block">
            {userName.split(" ")[0] || "User"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;