import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Container from "../../../components/base";
import ListContacts from "../../../components/dashbord/ListContacts";
import useAuth from "../../../hooks/useAuth";
import { BASE_PATH } from "../../../utils/constants";
// api
import { apiMeCall } from "../../../api/userApi";

export default function index({ resps }) {
  // window.history.replaceState(null, "", "/dashboard/messages");
}
export const getServerSideProps = async ({ query }) => {
  const res = await fetch(
    `${BASE_PATH}/conversations/find/${query.senderId}/${query.receiverId}`
  );
  const data = await res.json();
  return {
    redirect: {
      permanent: false,
      destination: `/dashboard/messages/${data.data._id}`,
    },
    props: {},
  };
  return {
    props: { resps: data.data._id },
  };
};
