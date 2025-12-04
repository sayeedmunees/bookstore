import {
  faArrowsRotate,
  faPaperPlane,
  faPencil,
  faPenToSquare,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { updateUserProfileAPI } from "../../services/allAPI";
import { toast, ToastContainer } from "react-toastify";
import { serverURL } from "../../services/serverURL";
import { userProfileUpdateStatusContext } from "../../context/ContextShare";

const EditProfile = () => {
  const [offCanvasStatus, setOffCanvasStatus] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
    cpassword: "",
    bio: "",
    profile: "",
  });

  const [existingImage, setExistingImage] = useState("");
  const [preview, setPreview] = useState("");
  const [token, setToken] = useState("");
  const { setUserProfileUpdateStatus } = useContext(
    userProfileUpdateStatusContext
  );

  const handleUploadImage = (e) => {
    setUserDetails({ ...userDetails, profile: e.target.files[0] });
    const url = URL.createObjectURL(e.target.files[0]);
    setPreview(url);
  };

  const handleReset = () => {
    const user = JSON.parse(sessionStorage.getItem("existingUser"));
    setUserDetails({
      username: user.username,
      password: user.password,
      cpassword: user.password,
      bio: user.bio,
    });
    setExistingImage(user.profile);
    setPreview("");
  };

  const handleSubmit = async () => {
    const { username, password, cpassword, bio, profile } = userDetails;
    console.log(username, password, cpassword, bio, profile);

    if (!username || !password || !cpassword || !bio) {
      toast.info("Please add complete data");
    } else if (password != cpassword) {
      toast.warning("Password must match");
    } else {
      if (preview) {
        const reqBody = new FormData();

        for (let key in userDetails) {
          console.log(key);
          console.log(userDetails[key]);
          reqBody.append(key, userDetails[key]);
        }

        console.log(reqBody);

        const reqHeader = { Authorization: `Bearer ${token}` };

        const result = await updateUserProfileAPI(reqBody, reqHeader);
        console.log(result);

        if (result.status == 200) {
          toast.success("Profile Updated Successfully");
          sessionStorage.setItem("existingUser", JSON.stringify(result.data));
          handleReset();
          setOffCanvasStatus(false);
          setUserProfileUpdateStatus(result.data);
        } else {
          toast.error("Something went wrong");
          handleReset();
        }
      } else {
        const reqHeader = { Authorization: `Bearer ${token}` };
        console.log(reqHeader);

        const result = await updateUserProfileAPI(
          { username, password, profile: existingImage, bio },
          reqHeader
        );
        console.log(result);

        if (result.status == 200) {
          toast.success("Profile Updated Successfully");
          sessionStorage.setItem("existingUser", JSON.stringify(result.data));
          handleReset();
          setOffCanvasStatus(false);
          setUserProfileUpdateStatus(result.data);
        } else {
          toast.error("Something went wrong");
          handleReset();
        }
      }
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      const token = sessionStorage.getItem("token");
      setToken(token);
      const user = JSON.parse(sessionStorage.getItem("existingUser"));
      setUserDetails({
        username: user.username,
        password: user.password,
        cpassword: user.password,
        bio: user.bio,
      });
      setExistingImage(user.profile);
    }
  }, []);

  return (
    <>
      <div className="w-full flex justify-end">
        <button
          className="text-white border border-green-950 bg-green-950 rounded p-3 hover:bg-white hover:text-green-950"
          onClick={() => setOffCanvasStatus(true)}
        >
          <FontAwesomeIcon icon={faPenToSquare} /> Edit
        </button>
      </div>

      {offCanvasStatus && (
        <div>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-500/75 transition-opacity w-full h-full"
            onClick={() => setOffCanvasStatus(false)}
          ></div>

          {/* Off-canvas */}
          <div className="bg-green-950 h-full w-[90%] max-w-sm z-50 fixed top-0 left-0 shadow-lg">
            <div className="bg-green-950 px-3 py-4 flex justify-between items-center text-white text-2xl">
              <h1>Edit User Profile</h1>
              <FontAwesomeIcon
                icon={faXmark}
                className="cursor-pointer"
                onClick={() => setOffCanvasStatus(false)}
              />
            </div>

            <div className="flex flex-col  items-center gap-3 p-4">
              <label
                htmlFor="imageFile"
                className="cursor-pointer flex flex-col items-center"
              >
                <input
                  id="imageFile"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleUploadImage(e)}
                />
                {existingImage == "" ? (
                  <img
                    src={
                      preview
                        ? preview
                        : "https://media.istockphoto.com/id/1130884625/vector/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-app-in-circle-design.jpg?s=612x612&w=0&k=20&c=1ky-gNHiS2iyLsUPQkxAtPBWH1BZt0PKBB1WBtxQJRE="
                    }
                    alt="Profile"
                    className="w-36 h-36 rounded-full object-cover border shadow"
                  />
                ) : existingImage?.startsWith(
                    "https://lh3.googleusercontent.com/"
                  ) ? (
                  <img
                    src={preview ? preview : existingImage}
                    alt="Profile"
                    className="w-36 h-36 rounded-full object-cover border shadow"
                  />
                ) : (
                  <img
                    src={
                      preview ? preview : `${serverURL}/upload/${existingImage}`
                    }
                    alt="Profile"
                    className="w-36 h-36 rounded-full object-cover border shadow"
                  />
                )}
                <FontAwesomeIcon
                  className="-mt-4 -mr-25 text-xl text-white"
                  icon={faPencil}
                />
              </label>

              <input
                type="text"
                placeholder="Username"
                className="p-2 mt-3 border rounded bg-white placeholder-gray-700 w-full"
                value={userDetails.username}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, username: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Password"
                className="p-2 border rounded bg-white placeholder-gray-700 w-full"
                value={userDetails.password}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, password: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Confirm Password"
                className="p-2 border rounded bg-white placeholder-gray-700 w-full"
                value={userDetails.cpassword}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, cpassword: e.target.value })
                }
              />

              <textarea
                rows={5}
                placeholder="Bio"
                className="p-2 border rounded bg-white placeholder-gray-700 w-full"
                value={userDetails.bio}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, bio: e.target.value })
                }
              ></textarea>

              <div className="flex flex-col md:flex-row gap-2 w-full mt-8">
                <button
                  onClick={handleReset}
                  className="bg-green-950 border border-white hover:bg-white rounded hover:text-green-950 text-white w-full p-2"
                >
                  <span className="font-bold me-2">Reset</span>
                  <FontAwesomeIcon icon={faArrowsRotate} />
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-white border border-white hover:bg-green-950 rounded text-green-950 hover:text-white w-full p-2"
                >
                  <span className="font-bold me-2">Submit</span>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer theme="colored" position="top-center" autoClose={3000} />
    </>
  );
};

export default EditProfile;
