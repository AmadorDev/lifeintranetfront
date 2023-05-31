

export default function PerfilAbout({ data, isFriend }) {
  if (data.length === 0) return null;

 
  return (
    <div className="w-full space-y-6">
      <div className="widget card p-3">
        <ul className="text-gray-600 space-y-3 my-3">
          {/* {owner === to ?
          <li className="flex items-center space-x-2">
          <img
            src="/imgs/dni.svg"
            width="23"
            className="flex items-center justify-center"
          />
          <span className="ml-1 t-sub t-color">DNI:</span>
          <span className="pl-1 t-title t-color"> {data?.dni}</span>
        </li>:null} */}
          <li className="flex items-center space-x-2">
            <img
              src="/imgs/name.svg"
              width="25"
              className=" flex items-center justify-center p-1 "
            />
            <span className="ml-1 t-sub t-color">Nombres:</span>
            <span className="pl-1 t-title t-color">{data?.name}</span>
          </li>
          <li className="flex items-center space-x-2">
            <img
              src="/imgs/name.svg"
              width="25"
              className=" flex items-center justify-center p-1 "
            />
            <span className="ml-1 t-sub t-color">Apellidos:</span>
            <span className="pl-1 t-title t-color">{data?.surnames}</span>
          </li>
          {/* {owner === to?
          <li className="flex items-center space-x-2">
          <img
            src="/imgs/hb.svg"
            width="25"
            className=" flex items-center justify-center p-1 "
          />
          <span className="ml-1 t-sub t-color">Fecha de nacimiento:</span>
          <span className="pl-1 t-title t-color"> {data?.date_birth}</span>
        </li>:null} */}

          {isFriend?<li className="flex items-center space-x-2">
            <img
              src="/imgs/phone.svg"
              width="25"
              className=" flex items-center justify-center p-1 "
            />
            <span className="ml-1 t-sub t-color">Teléfono:</span>
            <span className="pl-1 t-title t-color">{data?.phone}</span>
          </li>:null}
          

          <li className="flex items-center space-x-2">
            <img
              src="/imgs/area.svg"
              width="25"
              className=" flex items-center justify-center p-1 "
            />
            <span className="ml-1 t-sub t-color">Área:</span>
            <span className="pl-2 t-title t-color">{data?.area[0].name} </span>
          </li>

          {isFriend?<li className="flex items-center space-x-2">
            <img
              src="/imgs/email.svg"
              width="25"
              className=" flex items-center justify-center p-1 "
            />
            <span className="ml-1 t-sub t-color" >Correo:</span>
            <span className="pl-1 t-title t-color"> {data?.email} </span>
          </li>:null}
        </ul>
      </div>
    </div>
  );
}
