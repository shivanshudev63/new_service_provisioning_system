import { screen } from "@testing-library/react";
import { render } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import React from 'react';
import '@testing-library/jest-dom'; // Add this line to extend Jest matchers
 
// Mocking the components to avoid rendering the actual components
jest.mock("./Pages/Home", () => () => <div>Home Page</div>);
jest.mock("./Authentication/Register", () => () => <div>Register Page</div>);
jest.mock("./Authentication/Login", () => () => <div>Login Page</div>);
jest.mock("./Authentication/Logout", () => () => <div>Logout Page</div>);
jest.mock("./Pages/AdminHome", () => () => <div>Admin Home Page</div>);
jest.mock("./Pages/Configure", () => () => <div>Configure Page</div>);
jest.mock("./Pages/Enroll", () => () => <div>Enroll Service Page</div>);
jest.mock("./Pages/Terminate", () => () => <div>Terminate Service Page</div>);
jest.mock("./Pages/ArchiveData", () => () => <div>Archive Data Page</div>);
 
describe("App Routing", () => {
  test("renders Home component for root path", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });
 
  test("renders Register component for /register path", () => {
    window.history.pushState({}, "Test page", "/register");
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText("Register Page")).toBeInTheDocument();
  });
 
  test("renders Login component for /login path", () => {
    window.history.pushState({}, "Test page", "/login");
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
 
  test("renders Logout component for /logout path", () => {
    window.history.pushState({}, "Test page", "/logout");
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText("Logout Page")).toBeInTheDocument();
  });
 
  test("renders AdminHome component for /adminhome path", () => {
    window.history.pushState({}, "Test page", "/adminhome");
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText("Admin Home Page")).toBeInTheDocument();
  });
 
  test("renders Enroll component for /enroll-service path", () => {
    window.history.pushState({}, "Test page", "/enroll-service");
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText("Enroll Service Page")).toBeInTheDocument();
  });
 
  test("renders Terminate component for /terminate-service path", () => {
    window.history.pushState({}, "Test page", "/terminate-service");
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText("Terminate Service Page")).toBeInTheDocument();
  });
 
  test("renders Configure component for /configure-service path", () => {
    window.history.pushState({}, "Test page", "/configure-service");
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText("Configure Page")).toBeInTheDocument();
  });
 
  test("renders ArchiveData component for /archive path", () => {
    window.history.pushState({}, "Test page", "/archive");
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText("Archive Data Page")).toBeInTheDocument();
  });
});