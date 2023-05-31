import { useState, useEffect, useRef } from "react";
import { apiFriend } from "../../../api/userApi";
import useAuth from "../../../hooks/useAuth";
import { useAppContext } from "../../../providers/AppProvider";

// import Link from "next/link";
import { useRouter } from "next/router";
export default function Friend({ id = null, setCountFriend }) {
  const { logout } = useAuth();
  const { dispatch } = useAppContext();

  const router = useRouter();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  const Mounted = useRef(true);

  async function getList() {
    setLoading(true);
    try {
      const resp = await apiFriend(logout, id);
      if (resp?.msg === "OK") {
        if(!Mounted.current)return false
        setFriends(resp.data[0].friends);
        setCountFriend(() => resp.data[0].friends.length);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (Mounted.current) {
      getList();
    }
    return () => {
      Mounted.current = false;
    };
  }, []);
  function viewPerfil(id) {
    router.push(`/dashboard/profile/` + id);
  }

  // abrir chat
  function viewChat(reci) {
    // dispachet box
    dispatch({
      type: "ADD_BOX",
      value: {
        receiver: reci,
        data: ["n"],
        ventana: true,
      },
    });
  }

  return (
    <>
      {loading === false ? (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends?.map((item) => (
              <CardFriend
                data={item}
                key={item._id}
                viewPerfil={viewPerfil}
                viewChat={viewChat}
              ></CardFriend>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

function CardFriend({ data, viewPerfil, viewChat }) {
  return (
    <>
      <div
        className="w-full bg-white rounded-lg sahdow-lg p-3 flex flex-col justify-center items-center "
        style={{ border: "solid 1px #28A09C" }}
      >
        <div
          className="mb-1 cursor-pointer"
          onClick={() => viewPerfil(data._id)}
        >
          <img
            className="object-center object-cover rounded-full h-36 w-36"
            src={data.profilePicture}
            alt="photo"
          />
        </div>
        <div className="text-center">
          <p className="text-xl t-title mb-2">
            {data.name} {data.surnames}
          </p>
          <p className="text-base text-gray-400 font-normal">{data.puesto}</p>{" "}
          {/* <Link href={`/dashboard/profile/${data._id}`}> */}
          <div className="flex bg-white-500 rounded-full font-bold text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-white-600  mt-3 justify-center items-center">
            <img
              src="/imgs/coment.svg"
              alt=""
              width="30"
              className="cursor-pointer"
              onClick={() => viewChat(data)}
            />
          </div>
          {/* </Link> */}
        </div>
      </div>
    </>
  );
}
