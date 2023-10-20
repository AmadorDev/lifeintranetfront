import React, { useEffect, useState } from "react";
import Container from "../../../components/base";
import { Picker } from "emoji-mart";
import useAuth from "../../../hooks/useAuth";
import Posts from "../../../components/dashboard/post";
import LoaderSimple from "../../../components/utils/LoaderSimple";
export default function clearup() {
  const [refresPost, setrefresPost] = useState(true);
  const [emoji, setemoji] = useState("");
  const { auth, logout } = useAuth();
  const handleChange = (e) => {
    setemoji(e.target.value);
  };
  const addEmoji = (e) => {
    // window.preventDefault();
    // let emojitext = e.native;
    // setemoji(emojitext);

    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emojis = String.fromCodePoint(...codesArray);
    setemoji(emoji + emojis);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // postMessage(this.state);
    setemoji("");
  };
  return (
    <Container>
      {/* {refresPost ? (
        <Posts logout={logout} auth={auth} setrefresPost={setrefresPost} />
      ) : (
        <LoaderSimple></LoaderSimple>
      )} */}
      holalaa
    </Container>
  );
}
