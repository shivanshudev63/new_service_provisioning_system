import React from 'react';
import './LandingPage.css'; // Add styles for the modal in this CSS file

const Modal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="pop-up">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="modal-btn confirm-btn" onClick={onConfirm}>
            Okay
          </button>
          <button className="modal-btn cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;


// import React, { useState } from 'react';
// import './LandingPage.css';

// const Modal = ({ title, message, onConfirm, onCancel, isTermination, setFeedback }) => {
//   const [feedback, setLocalFeedback] = useState('Not Available');

//   const handleFeedbackChange = (e) => {
//     const inputFeedback = e.target.value;
//     setLocalFeedback(inputFeedback); // Update the local feedback state
//     setFeedback(inputFeedback); // Pass the feedback to the parent component (Configuresidebar)
//   };

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <h2>{title}</h2>
//         <p>{message}</p>

//         {isTermination && (
//           <div className="feedback-section">
//             <textarea
//               placeholder="Please provide feedback for the termination..."
//               value={feedback}
//               onChange={handleFeedbackChange}
//             />
//           </div>
//         )}

//         <div className="modal-actions">
//           <button className="confirm-btn" onClick={onConfirm}>
//             Okay
//           </button>
//           <button className="cancel-btn" onClick={onCancel}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;

