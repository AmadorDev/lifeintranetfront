import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiActivity, FiGift, FiHome } from "react-icons/fi";

export default function SideDrop() {
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  const handleItemClick = () => {
    setIsActive(!isActive);
  };
  useEffect(() => {
    if(router.asPath == "/dashboard/commercial/marketings" || router.asPath =="/dashboard/commercial/trainings"){
      setIsActive(true)
    }
  }, [isActive])
  

  return (
    <div onClick={handleItemClick}>
      <li className={router.asPath == "/dashboard/commercial/marketings" || router.asPath == "/dashboard/commercial/trainings"? "active" : "" }>
        <a>
          <FiGift
            className="text-gray-600"
            size={15}
            style={{ borderRadius: 0 }}
          />
          <span>Comercial</span>
        </a>
      </li>
      {isActive && (
        <div className=" m-1">
          <li  >
            <Link href="/dashboard/commercial/trainings" >
              <a className={router.asPath == "/dashboard/commercial/trainings" ? "active-sub-item" : "" }>
                <FiActivity
                  className="text-gray-600"
                  size={15}
                  style={{ borderRadius: 0 }}
                />
                <span>Capacitaciones</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/commercial/marketings">
              <a className={router.asPath == "/dashboard/commercial/marketings" ? "active-sub-item" : "" }>
                <FiActivity
                  className="text-gray-600"
                  size={15}
                  style={{ borderRadius: 0 }}
                />
                <span>Marketing</span>
              </a>
            </Link>
          </li>
        </div>
      )}
    </div>
  );
}
