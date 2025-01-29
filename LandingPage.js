import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function LandingPage() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [showModal, setShowModal] = useState(true);

  const closeModal = () => setShowModal(false);

  // Stop the propagation of click events from the modal content
  const handleModalContentClick = (event) => {
    event.stopPropagation();
  };

  // Fetch games (topics) from backend
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:5000/games"); // Assuming this returns games as topics
        const data = await response.json();
        setGames(data); // Assuming response has game data
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  // Check if the user is logged in by looking for the authToken in localStorage
  const token = localStorage.getItem('authToken'); // or 'studentToken' if different

  // Navigation handlers
  const handleAdminLogin = () => navigate("/admin-login");
  const handleStudentLogin = () => navigate("/student-login");
  const handleRegister = () => navigate("/register");

  const handleGameClick = (game) => {
    if (token) {
      navigate(`/topic/${game.GName}`); // Navigate to TopicPage with GID
    } else {
      alert("Please login to continue");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // or 'studentToken' if that's your token key
    navigate("/"); // Redirect to the landing page after logout
  };

  return (
    <div>
      <Navbar
        title="Discrete Mathematics Game"
        showBackButton={false}
        // Conditional rendering for auth buttons or login/register buttons
        buttons={
          token
            ? [
                { label: "Profile", onClick: () => navigate("/profile") },
                { label: "Logout", onClick: handleLogout },
              ]
            : [
                { label: "Admin Login", onClick: handleAdminLogin },
                { label: "Student Login", onClick: handleStudentLogin },
                { label: "Register", onClick: handleRegister },
              ]
        }
      />
      <div className="container">
        <h1>Welcome!</h1>
        <p>Select a topic (game) to get started:</p>
        <div className="game-button">
          {games.length > 0 ? (
            games.map((game) => (
              <button
                key={game._id} // Assuming each game has an _id field
                onClick={() => handleGameClick(game)} // Navigate with game GID
                className="game-btn"
              >
                {game.GName} {/* Displaying the game name */}
              </button>
            ))
          ) : (
            <p>Loading games...</p>
          )}
        </div>
      </div>
      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={handleModalContentClick}>
            <span className="close" onClick={closeModal}>&times;</span>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 0,
                paddingTop: "56.25%",
                overflow: "hidden",
                borderRadius: "8px",
                willChange: "transform",
              }}
            >
              <iframe
                loading="lazy"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  border: "none",
                }}
                src="https://www.canva.com/design/DAGbxEvgz5A/wqsaU9PUWUs6S4Ngcpq44Q/view?embed"
                allowFullScreen="allowfullscreen"
                allow="fullscreen"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
