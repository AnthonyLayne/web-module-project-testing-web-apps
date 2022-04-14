import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

test("renders without errors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);
  const contactHeader = screen.queryByText(/Contact Form/);
  expect(contactHeader).toBeInTheDocument();
  expect(contactHeader).toHaveTextContent(/Contact Form/);
  expect(contactHeader).toBeTruthy();
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  render(<ContactForm />);
  const firstName = screen.getByLabelText(/First Name*/i);
  userEvent.type(firstName, "1235");
  const errMssg = await screen.findAllByTestId("error");
  expect(errMssg).toHaveLength(1);
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);
  const submitBttn = screen.getByRole("button");
  userEvent.click(submitBttn);
  await waitFor(() => {
    const errMssg = screen.queryAllByTestId("error");
    expect(errMssg).toHaveLength(3);
  });
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByLabelText(/First Name*/i);
  userEvent.type(firstNameInput, "Johnny");
  const lastNameInput = screen.getByLabelText(/Last Name*/i);
  userEvent.type(lastNameInput, "Cash");
  const bttn = screen.getByRole("button");
  userEvent.click(bttn);
  const errMssg = screen.getAllByTestId("error");
  expect(errMssg).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const emailInput = screen.getByLabelText(/email*/i);
  userEvent.type(emailInput, "johnnycash@gmail");
  const errMssg = await screen.findByText(/email must be a valid email address/i);
  expect(errMssg).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);
  const submitBttn = screen.getByRole("button");
  userEvent.click(submitBttn);
  const errMssg = await screen.findByText(/lastName is a required field/i);
  expect(errMssg).toBeInTheDocument();
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);

  const emailInput = screen.getByLabelText(/email*/i);
  const firstNameInput = screen.getByLabelText(/first name*/i);
  const lastNameInput = screen.getByLabelText(/last name*/i);

  userEvent.type(emailInput, "johnnycash@gmail.com");
  userEvent.type(firstNameInput, "johnny");
  userEvent.type(lastNameInput, "cash");

  const button = screen.getByRole("button");
  userEvent.click(button);
  await waitFor(() => {
    const emailDisplay = screen.queryByText("johnnycash@gmail.com");
    const firstNameDisplay = screen.queryByText("johnny");
    const lastNameDisplay = screen.queryByText("cash");
    const mssgDisplay = screen.queryByText("mssgDisplay");

    expect(firstNameDisplay).toBeInTheDocument();
    expect(lastNameDisplay).toBeInTheDocument();
    expect(emailDisplay).toBeInTheDocument();
    expect(mssgDisplay).not.toBeInTheDocument();
  });
});

test("renders all fields text when all fields are submitted.", async () => {
  render(<ContactForm />);

  const emailInput = screen.getByLabelText(/email*/i);
  const firstNameInput = screen.getByLabelText(/first name*/i);
  const lastNameInput = screen.getByLabelText(/last name*/i);

  userEvent.type(emailInput, "johnnycash@gmail.com");
  userEvent.type(firstNameInput, "johnny");
  userEvent.type(lastNameInput, "cash");

  const button = screen.getByRole("button");
  userEvent.click(button);
  await waitFor(() => {
    const emailDisplay = screen.queryByText("johnnycash@gmail.com");
    const firstNameDisplay = screen.queryByText("johnny");
    const lastNameDisplay = screen.queryByText("cash");

    expect(firstNameDisplay).toBeInTheDocument();
    expect(lastNameDisplay).toBeInTheDocument();
    expect(emailDisplay).toBeInTheDocument();
  });
});
