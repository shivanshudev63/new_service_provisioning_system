import styled from "styled-components";

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

export const WelcomeMessage = styled.h3`
  color: #333;
`;

export const ServiceList = styled.div`
  margin: 20px 0;
`;

export const ServiceItem = styled.div`
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;
  width: 200px; /* Fixed width for all buttons */
  height: 50px; /* Fixed height for all buttons */

  &:hover {
    background-color: #0056b3;
    /* Diagonal fill effect */
    background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 50%, transparent 50%),
                      linear-gradient(225deg, rgba(255, 255, 255, 0.5) 50%, transparent 50%);
    background-size: 10px 10px;
    background-position: 0 0, 10px 10px;
    background-repeat: no-repeat;
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
