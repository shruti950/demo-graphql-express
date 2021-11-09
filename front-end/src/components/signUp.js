import React, { Component } from "react";
import "./signUp.css";
class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      isLogin: false,
    };
  }
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
        mutation {
          createAdmin(adminInput: {email: "${this.state.email}", password: "${this.state.password}"}) {
            _id
            email
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
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        this.setState({
          isLogin: true,
        });
        console.log(res);
        return res.json();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  signIn = () =>{
   this.props.history.push("/signin")
  }
  render() {
    return (
      <>
      <h4>Sign-Up Page</h4>
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
            <button
              type="submit"
              onClick={(event) => this.onSubmit(event)}
              className="btn btn-lg"
              id="signUp"
            >
              Sign Up
            </button>
            <button type="button" className="btn btn-lg" onClick={this.signIn} id="signIn">
              Sign In
            </button>
          </div>
        </form>
      </>
    );
  }
}

export default SignUp;
