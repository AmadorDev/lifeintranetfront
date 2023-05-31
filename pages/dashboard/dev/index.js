import Container from "../../../components/base";

import { useAppContext } from "../../../providers/AppProvider";

import toast from "react-hot-toast";

export default function dev() {
  const { presupuesto, dispatch } = useAppContext();

  function restar() {
    const nevalue = presupuesto - 5;
    dispatch({ type: "resta_pre", value: nevalue });
  }
  function sumar() {
    const nevalue = presupuesto + 5;
    dispatch({ type: "resta_pre", value: nevalue });
  }
  function mandara() {
    toast.success("Successfully toasted!");
  }
  return (
    <Container>
      {presupuesto}
      <button type="button" className="btn btn-success" onClick={restar}>
        restart
      </button>
      <button type="button" className="btn btn-info" onClick={sumar}>
        sumar
      </button>

      <button onClick={mandara}>alert</button>
    </Container>
  );
}
