import { useState } from "react";

export default function Marks() {
  const [marks, setMarks] = useState([
    {
      id: 1,
      name: "Placenta Life",
      redes: [
        { name: "fb", url: "https://www.facebook.com/PlacentaLifePe" },
        { name: "in", url: "https://www.instagram.com/benatural_pe/" },
      ],
    },
    {
      id: 2,
      name: "Be Natural",
      redes: [
        { name: "fb", url: "https://www.facebook.com/PLBeNatural" },
        { name: "in", url: "https://www.instagram.com/benatural_pe/" },
      ],
    },
    {
      id: 3,
      name: "Smoll",
      redes: [
        { name: "fb", url: "https://www.facebook.com/SmollPE" },
        { name: "in", url: "" },
      ],
    },
    {
      id: 4,
      name: "Tonno Plus",
      redes: [
        { name: "fb", url: "https://www.facebook.com/TonnoPlus/" },
        { name: "in", url: "https://www.instagram.com/tonnoplus/" },
      ],
    },
    {
      id: 5,
      name: "Radiant",
      redes: [
        { name: "fb", url: "https://www.facebook.com/RadiantProfessionalLine" },
        { name: "in", url: "https://www.instagram.com/radiant_pe/" },
      ],
    },
    {
      id: 6,
      name: "Life For Men",
      redes: [
        { name: "fb", url: "https://www.facebook.com/LifeForMenPeru" },
        { name: "in", url: "" },
      ],
    },
    {
      id: 7,
      name: "Hanna Caball",
      redes: [
        { name: "fb", url: "https://www.facebook.com/hannacaball" },
        { name: "in", url: "https://www.instagram.com/hannacaball/" },
      ],
    },
    {
      id: 8,
      name: "Keratimask",
      redes: [
        { name: "fb", url: "https://www.facebook.com/KeratimaskPeru/" },
        { name: "in", url: "https://www.instagram.com/keratimask_pe/" },
      ],
    },
    {
      id: 9,
      name: "Mr. Classic",
      redes: [
        { name: "fb", url: "https://www.facebook.com/MrClassicPeru" },
        { name: "in", url: "https://www.instagram.com/mrclassic_pe/" },
      ],
    },
    {
      id: 10,
      name: "Naturals",
      redes: [
        { name: "fb", url: "https://www.facebook.com/PlacentaLifeColorPeru" },
        { name: "in", url: "https://www.instagram.com/placentalife_color/" },
      ],
    },
    {
      id: 11,
      name: "Color Fashion",
      redes: [
        { name: "fb", url: "https://www.facebook.com/PlacentaLifeColorPeru" },
        { name: "in", url: "https://www.instagram.com/placentalife_color/" },
      ],
    },
    {
      id: 12,
      name: "Coquette",
      redes: [
        { name: "fb", url: "https://www.facebook.com/PlacentaLifeColorPeru" },
        { name: "in", url: "https://www.instagram.com/placentalife_color/" },
      ],
    },
    {
      id: 13,
      name: "Amazonic",
      redes: [
        { name: "fb", url: "https://www.facebook.com/PlacentaLifeAmazonic" },
        { name: "in", url: "https://www.instagram.com/amazonic_pe/" },
      ],
    },
    {
      id: 14,
      name: "Kinetics",
      redes: [
        { name: "fb", url: "" },
        { name: "in", url: "https://www.instagram.com/kinetics_pe/" },
      ],
    },
    {
      id: 15,
      name: "Genetics",
      redes: [
        { name: "fb", url: "https://www.facebook.com/PlacentaLifeColorPeru" },
        { name: "in", url: "https://www.instagram.com/placentalife_color/" },
      ],
    },
    {
      id: 16,
      name: "Omygad",
      redes: [
        { name: "fb", url: "https://www.facebook.com/omygadperu" },
        { name: "in", url: "" },
      ],
    },
  ]);
  return (
    <>
      <ol className="list-group list-group-flush">
        {marks.map((item, index) => (
          <ListItem data={item} key={index}></ListItem>
        ))}
      </ol>
    </>
  );
}

function ListItem({ data }) {
  return (
    <li
      className="li-bg li-css list-group-item d-flex justify-content-between align-items-start m-1"
      key={data.id}
    >
      <div className="ms-2 me-auto">
        <div className="t-title">{data?.name}</div>
      </div>

      {data?.redes.map((item,index) => (
        <RedesName item={item} key={index}></RedesName>
      ))}
    </li>
  );
}

function RedesName({ item }) {
  switch (item.name) {
    case "fb":
      return (
        <>
          {item?.url ? (
            <a
              href={item.url}
              target="_blank"
              className="rounded-full fill-current p-1 ml-1 icon-bg hover:scale-105 transition transform duration-500"
            >
              <svg
                className="w-4 h-4 fill-current text-white"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          ) : null}
        </>
      );
    case "in":
      return (
        <>
          {item?.url ? (
            <a
              href={item.url}
              target="_blank"
              className="rounded-full fill-current p-1 ml-1 bg-green-300 icon-bg hover:scale-105 transition transform duration-500"
            >
              <img src="/imgs/in.svg" width="17"></img>
            </a>
          ) : null}
        </>
      );
    default:
      return null;
  }
}
