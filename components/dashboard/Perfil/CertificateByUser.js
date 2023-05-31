import {useEffect,useState,useRef} from 'react'
import { apiCertificateByUser } from '../../../api/userApi';
import ListCertificate from './ListCertificate'

export default function CertificateByUser({logout,id}) {

    const [certificates, setCertificates] = useState([]);
    const mounted = useRef(true);

    useEffect(() => {
      if (mounted.current) {
        getCertificate();
      }
      return () => {
        mounted.current = false;
      };
    }, []);
  
    async function getCertificate() {
      try {
        const obj = await apiCertificateByUser(logout, id);
        if(obj.msg === 'OK'){
            if (!mounted.current) return null;
            setCertificates(obj?.data);
        }
        
      } catch (error) {
          console.log(error)
      }
    }
    return (
        <ListCertificate certificates={certificates}>
            
        </ListCertificate>
    )
}
