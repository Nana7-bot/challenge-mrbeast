import { Close } from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IconLogo from "../image/assets/blue-icon-logo.svg";
import GoogleLogo from "../image/assets/google.png";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import {
  auth,
  firestoreDb,
  getSpecificUser,
  googleProvider,
} from "../firebase/firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { loginUser } from "../reduxConfig/slices/userSlice";
import LoadingComponent from "../components/Loading";
import { CircularProgress } from "@mui/material";

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const userDetail = useSelector((state) => state.user.userDetail);
  const [btnIsLoading, setBtnIsLoading] = useState(false);

  const googleSignIn = () => {
    setBtnIsLoading(true);
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;

        getUserDetailFromFirestore(user.uid);

      })
      .catch((error) => {
        // Handle Errors here.
        setBtnIsLoading(false);
        const errorMessage = error.message;
        alert("Error ", errorMessage);
      });
  };

  async function getUserDetailFromFirestore(userUid) {
    const docRef = getSpecificUser(userUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      dispatch(loginUser(docSnap.data()));
    } else {
      const docRef = doc(firestoreDb, "users", auth.currentUser.uid);
      await setDoc(docRef, {
        displayName: auth.currentUser.displayName,
        username: "@" + auth.currentUser.email?.split("@")[0].toLowerCase(),
        emailAddress: auth.currentUser.email,
        photoURL: auth.currentUser.photoURL,
        uid: auth.currentUser.uid,
      });
      dispatch(
        loginUser({
          displayName: auth.currentUser.displayName,
          username: "@" + auth.currentUser.email?.split("@")[0].toLowerCase(),
          emailAddress: auth.currentUser.email,
          photoURL: auth.currentUser.photoURL,
          uid: auth.currentUser.uid,
        })
      );
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        getUserDetailFromFirestore(auth.currentUser.uid);

        if (userDetail !== null) {
          setBtnIsLoading(false);
          setPageLoading(false);
          navigate("/challenges");
        }
      } else {
        setPageLoading(false);
      }
    });
  });

  return pageLoading ? (
    <LoadingComponent />
  ) : (
    <div className="login-signup-section signup-section">
      <div className="auth-container">
        <div className="close-btn">
          <Link to="/challenges">
            <Close />
          </Link>
        </div>
        <div className="auth">
          <img src={IconLogo} width="50" height="50" alt="login-logo" />
          <div className="">
            <h2>Join ChallengeMrBeast today</h2>

            {btnIsLoading ? (
              <button>
                <div className="google-btn-container">
                  <img
                    src={GoogleLogo}
                    width="20"
                    height="20"
                    alt="google-icon"
                  />
                  <CircularProgress className="is-loading-login-signup" />
                </div>
              </button>
            ) : (
              <button onClick={googleSignIn}>
                <div className="google-btn-container">
                  <img
                    src={GoogleLogo}
                    width="20"
                    height="20"
                    alt="google-icon"
                  />
                  Sign in with Google
                </div>
              </button>
            )}

            <div className="old-user-account">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
