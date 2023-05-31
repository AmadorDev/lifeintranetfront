import React, { useState, useEffect, useRef } from "react";

export default function Reloj() {
  const [state, setState] = useState({ date: new Date() });
  function Tick() {
    setState({ date: new Date() });
  }

  useEffect(() => {
    let timerID = setInterval(() => Tick(), 1000);
    return () => {
      clearInterval(timerID);
    };
  }, []);

  return (
    <div>
      <FormattedDate date={state.date}></FormattedDate>
    </div>
  );
}
// class Clock extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { date: new Date() };
//   }

//   componentDidMount() {
//     this.timerID = setInterval(() => this.tick(), 1000);
//   }

//   componentWillUnmount() {
//     clearInterval(this.timerID);
//   }

//   tick() {
//     this.setState({
//       date: new Date(),
//     });
//   }

//   render() {
//     return (
//       <div>
//         <h1>Hello, world!</h1>
//         <FormattedDate date={this.state.date} />
//       </div>
//     );
//   }
// }

function FormattedDate({ date }) {
  const dt = new Date();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];
  // return (
  //   <div className="row text-center p-3 ">
  //     <div className="col-12">
  //       {days[dt.getDay()]}, {dt.getDate()} {months[dt.getMonth()]}
  //       <span className="ml-1">{dt.getFullYear()}</span>
  //     </div>
  //     <div className="col-12 mt-2">
  //       <span className="css_hours"> {date.toLocaleTimeString()}</span>
  //     </div>
  //   </div>
  // );
  return (
    <div>
      {days[dt.getDay()]}, {dt.getDate()} {months[dt.getMonth()]}
      <span className="ml-1">{dt.getFullYear()}</span>{" "}
      <span className="css_hours"> {date.toLocaleTimeString()}</span>
    </div>
  );
}
