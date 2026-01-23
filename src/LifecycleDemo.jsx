import React from "react";
import moment from "moment";

class LifecycleDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      time: moment().format("HH:mm:ss"),
    };

    console.log("1️⃣ constructor()");
  }

  
  static getDerivedStateFromProps(props, state) {
    console.log("2️⃣ getDerivedStateFromProps()");
    return null; 
  }

  
  componentDidMount() {
    console.log("4️⃣ componentDidMount()");

    this.timer = setInterval(() => {
      this.setState({
        time: moment().format("HH:mm:ss"),
      });
    }, 1000);
  }

  
  shouldComponentUpdate() {
    console.log("3️⃣ shouldComponentUpdate()");
    return true; 
  }

  
  componentDidUpdate() {
    console.log("5️⃣ componentDidUpdate()");
  }

  
  componentWillUnmount() {
    console.log("6️⃣ componentWillUnmount()");
    clearInterval(this.timer);
  }


  render() {
    console.log("➡️ render()");

    return (
      <div className="lifecycle-box">
        <p>Waktu saat ini:</p>
        <h2>{this.state.time}</h2>
      </div>
    );
  }
}

export default LifecycleDemo;
