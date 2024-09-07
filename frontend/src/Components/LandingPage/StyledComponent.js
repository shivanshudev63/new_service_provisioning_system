import styled from "styled-components";
export const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url('./bg_image.png');
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh;
  padding: 20px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #000000; /* Darker grey background for contrast */
  padding: 20px;
  text-align: center;
  position: relative; /* Ensure container is relative for absolute positioning of children */
`;
export const WelcomeMessage = styled.h1`
  color: #fff;
  font-size: 2rem;
  margin: 20px 0;
`;

// Service list container
export const ServiceList = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 20px 0;
  padding: 20px;
      background: rgba(17, 25, 40, 0.7);

  border-radius: 8px;
  color: #fff;
`;

// Service item
export const ServiceItem = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  
  h5 {
    margin: 0;
    font-size: 1.5rem;
  }
  
  p {
    margin: 5px 0;
  }
`;

// Buttons
export const Button = styled.button`
  padding: 15px 25px;
  margin: 10px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export const ErrorMessage = styled.h3`
  color: white;
  position: absolute;
  bottom: 60px; /* Adjusted position upwards from the bottom */
  left: 50%;
  transform: translateX(-50%); /* Center horizontally */
  margin: 0;
`;

export const LoginPrompt = styled.div`
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  justify-content: center;
  align-items: center;
  background-color: black; /* Dark background */
  border-radius: 50%; /* Makes it a circle */
  padding: 20px;
  width: 150px; /* Width of the circle */
  height: 150px; /* Height of the circle */
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transition for scaling and shadow effect */
  position: relative; /* Position relative for placing error message below */

  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.5); /* Default shadow effect */

  &:hover {
    transform: scale(1.2); /* Enlarges the circle on hover */
    box-shadow: 0 8px 16px rgba(255, 255, 255, 0.5); /* Increased shadow effect on hover */
  }

  img {
    width: 100px; /* Default image size */
    height: 100px; /* Default image size */
    border-radius: 50%; /* If you want the image itself to be circular */
    transition: transform 0.3s ease; /* Smooth transition for zoom effect */

    transform: scale(1.2);
  }

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none; /* Removes underline */
  }
`;
