import { useState, useEffect, useCallback } from "react";

interface PhishingAttempt {
  _id: string;
  targetEmail: string;
  emailSubject: string;
  emailContent: string;
  status: string;
  createdAt: string;
  sentAt?: string;
  clickedAt?: string;
  trackingToken: string;
}

function App() {
  const [token, setToken] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);

  // Auth form
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Phishing form
  const [targetEmail, setTargetEmail] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [emailContent, setEmailContent] = useState<string>("");

  // Attempts list
  const [attempts, setAttempts] = useState<PhishingAttempt[]>([]);

  // Clear token on app start to always show login page
  useEffect(() => {
    localStorage.removeItem("token");
    setToken("");
  }, []);

  const fetchAttempts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/phishing-attempts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error("Failed to fetch attempts");
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setAttempts(data);
      } else {
        setAttempts([]);
      }
    } catch (error) {
      console.error("Failed to fetch attempts:", error);
      setAttempts([]);
    }
  }, [token]);

  // Fetch attempts when logged in
  useEffect(() => {
    if (token) {
      fetchAttempts();
    }
  }, [token, fetchAttempts]);

  const handleAuth = async () => {
    const endpoint = isLogin ? "login" : "register";

    try {
      const response = await fetch(`http://localhost:3000/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // Check if request was successful
      if (!response.ok) {
        const error = await response.json();
        alert(`${endpoint} failed: ${error.message || "Invalid credentials"}`);
        return;
      }

      const data = await response.json();

      if (isLogin) {
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
        alert("Login successful!");
      } else {
        alert("Registration successful! Logging you in...");

        const loginResponse = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          setToken(loginData.access_token);
          localStorage.setItem("token", loginData.access_token);
        }
      }
    } catch (error) {
      alert(`${endpoint} failed! Please try again.`);
      console.error(error);
    }
  };

  const handleSendPhishing = async () => {
    // Validate all fields are filled
    if (!targetEmail || !emailSubject || !emailContent) {
      alert("Please fill in all fields!");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(targetEmail)) {
      alert("Please enter a valid email address!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/phishing-attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetEmail, emailSubject, emailContent }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(
          `Failed to create phishing attempt: ${
            error.message || "Unknown error"
          }`
        );
        return;
      }

      const data = await response.json();

      if (data.trackingLink) {
        alert(
          `✅ Phishing simulation sent successfully!\n\nTracking Link: ${data.trackingLink}\n\nNote: Click this link to simulate victim clicking the phishing email.`
        );
      } else {
        alert("✅ Phishing simulation created successfully!");
      }

      // Clear form
      setTargetEmail("");
      setEmailSubject("");
      setEmailContent("");

      // Refresh list
      fetchAttempts();
    } catch (error) {
      alert("❌ Failed to send phishing attempt! Please try again.");
      console.error(error);
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setAttempts([]);
    setUsername("");
    setPassword("");
  };

  // Login/Register Page
  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            width: "400px",
          }}
        >
          <h1
            style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}
          >
            {isLogin ? "Login" : "Register"}
          </h1>

          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />

          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={handleAuth}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "15px",
            }}
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "transparent",
              color: "#007bff",
              border: "1px solid #007bff",
              borderRadius: "4px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            {isLogin ? "Need an account? Register" : "Have an account? Login"}
          </button>
        </div>
      </div>
    );
  }

  // Dashboard Page
  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#007bff",
          padding: "20px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Phishing Simulation Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "white",
            color: "#007bff",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Send Phishing Form */}
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Send Phishing Simulation</h2>

          <input
            type='email'
            placeholder='Target Email'
            value={targetEmail}
            onChange={(e) => setTargetEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />

          <input
            type='text'
            placeholder='Email Subject'
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />

          <textarea
            placeholder='Email Content'
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              minHeight: "100px",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />

          <button
            onClick={handleSendPhishing}
            style={{
              padding: "12px 30px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Send Phishing Test
          </button>
        </div>

        {/* Attempts Table */}
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Phishing Attempts</h2>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    Target Email
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    Subject
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "2px solid #dee2e6",
                      minWidth: "200px",
                    }}
                  >
                    Actions
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "2px solid #dee2e6",
                    }}
                  >
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt) => {
                  const trackingLink = `http://localhost:3001/phishing/track/${attempt.trackingToken}`;

                  const handleCopyLink = () => {
                    navigator.clipboard.writeText(trackingLink);
                    alert("📋 Tracking link copied to clipboard!");
                  };

                  const handleTestClick = () => {
                    window.open(trackingLink, "_blank");
                    // Auto-refresh after 2 seconds to show updated status
                    setTimeout(() => {
                      fetchAttempts();
                    }, 2000);
                  };

                  return (
                    <tr
                      key={attempt._id}
                      style={{ borderBottom: "1px solid #dee2e6" }}
                    >
                      <td style={{ padding: "12px" }}>{attempt.targetEmail}</td>
                      <td style={{ padding: "12px" }}>
                        {attempt.emailSubject}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            backgroundColor:
                              attempt.status === "CLICKED"
                                ? "#dc3545"
                                : attempt.status === "SENT"
                                ? "#28a745"
                                : "#ffc107",
                            color: "white",
                          }}
                        >
                          {attempt.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        {attempt.status === "SENT" ? (
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              onClick={handleCopyLink}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "#6c757d",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "12px",
                                cursor: "pointer",
                                fontWeight: "bold",
                              }}
                            >
                              📋 Copy Link
                            </button>
                            <button
                              onClick={handleTestClick}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "#ffc107",
                                color: "#000",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "12px",
                                cursor: "pointer",
                                fontWeight: "bold",
                              }}
                            >
                              🔗 Test Click
                            </button>
                          </div>
                        ) : (
                          <span
                            style={{
                              color: "#28a745",
                              fontSize: "13px",
                              fontWeight: "bold",
                            }}
                          >
                            ✓ Clicked{" "}
                            {attempt.clickedAt
                              ? `at ${new Date(
                                  attempt.clickedAt
                                ).toLocaleTimeString()}`
                              : ""}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {new Date(attempt.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}

                {attempts.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "40px",
                        textAlign: "center",
                        color: "#6c757d",
                      }}
                    >
                      No phishing attempts yet. Create your first simulation
                      above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
