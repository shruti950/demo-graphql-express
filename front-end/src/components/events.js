import React, { Component } from "react";
import Modal from "react-modal";
import "./events.css";
import LoginContext from "../context/login-context";
class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      name: null,
      age: null,
      date: null,
    };
  }
  static contextType = LoginContext;

  openModal = () => {
    this.setState({ showModal: true });
  };
  closeModal = () => {
    this.setState({ showModal: false });
  };

  onChange = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    });
    // this.setState({
    //   ...this.state,
    //   [event.target.name]: event.target.value,
    // });
    console.log(
      "🚀 ~ file: events.js ~ line 27 ~ Events ~ this.state.user",
      this.state
    );
  };

  submitHandler = (event) => {
    let body = {
      query: `mutation{
      createEvent(eventInput:{name:"${this.state.name}",age:${this.state.age}}){
        name
      }
    }
    `,
    };
    debugger;
    const token = this.context.token;
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log(res);
        if (res.status !== 200 && res.status !== 201) {
          new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        debugger;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <>
        {this.context.token && (<div className="createEvent">
          <h5>Add as you like</h5>
          <button className="btn" onClick={this.openModal}>
            Create Event
          </button>
        </div>)}
        <Modal
          isOpen={this.state.showModal}
          className="Modal"
          style={{
            overlay: {
              background: "rgb(90 90 90 / 75%)"
            },
            content: {
              position: "absolute",
              top: "100px",
              left: "600px",
              right: "40px",
              bottom: "100px",
              border: "1px solid #ccc",
              background: "#fff",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: "4px",
              outline: "none",
              padding: "0px",
            },
          }}
        >
          <div className="">
            <div className="title">
              <h4>Add Event</h4>
            </div>
            <div className="modalContent">
              <form className="events">
                <div className="form-control">
                  <label>Name</label>
                  <input name="name" onChange={this.onChange} type="text" />
                  <label>Age</label>
                  <input name="age" onChange={this.onChange} type="number" />
                  <label>Date</label>
                  <input name="date" onChange={this.onChange} type="date" />
                </div>
                <div>
                  <button
                    className="btn"
                    type="submit"
                    onClick={(event) => this.submitHandler(event)}
                  >
                    Submit
                  </button>
                  <button className="btn" onClick={this.closeModal}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default Events;
