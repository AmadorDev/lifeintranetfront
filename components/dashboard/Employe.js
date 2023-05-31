import Link from "next/link";


export default function Employe({ items, auth }) {
  return (
    <Link
      key={items._id}
      href={{
        pathname: "/dashboard/messages",
        query: {
          receiverId: items._id,
          senderId: `${auth?.User_id}`,
        },
      }}
    >
      <a>
        <div className="contact-avatar">
          <img src={items.profilePicture} />
          <span
            className={
              items.login ? "user_status status_online" : "user_status"
            }
          />
        </div>
        <div className="contact-username">{items.name}</div>
      </a>
    </Link>
  );
}
