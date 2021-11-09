import React, { Component } from "react";
import "./signIn.css";
import LoginContext from "../context/login-context";

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      isLogin: false,
    };
  }

  static contextType = LoginContext;

  onChange = (event) => {
    event.preventDefault();
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);

      let requestBody = {
        query: `
        query{
          login(email:"${this.state.email}",password:"${this.state.password}"){
            userId
            token
          }
        }
      `,
      };
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        if (res.status !== 200 && res.status !== 201) {
          new Error("Failed!");
        }
        return res.json();
      }).then((resData=>{
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      }
        ))
      .catch((err) => {
        console.log(err);
      });
  };
  signUp = () =>{
    this.props.history.push("/signup")
  }
  render() {
    return (
      <>
      <h4>Sign-In Page</h4>
        <form className="auto-form">
          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              onChange={this.onChange}
              name="email"
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={this.onChange}
              name="password"
            />
            <button type="button" className="btn btn-lg" onClick={this.signUp} id="signIn">
              Sign Up
            </button>
            <button
              type="submit"
              onClick={(event) => this.onSubmit(event)}
              className="btn btn-lg"
              id="signIn"
            >
              Sign In
            </button>
          </div>
        </form>
      </>
    );
  }
}

export default SignIn;
