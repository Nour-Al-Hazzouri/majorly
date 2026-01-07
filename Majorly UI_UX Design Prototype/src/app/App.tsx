import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { Assessment, type AssessmentData } from "./components/Assessment";
import { LoadingState } from "./components/LoadingState";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { MajorDetailPage } from "./components/MajorDetailPage";
import { AuthModal } from "./components/AuthModal";
import { UserProfile } from "./components/UserProfile";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

type AppState = "landing" | "assessment" | "loading" | "results" | "major-detail" | "profile";

interface User {
  name: string;
  email: string;
}

function App() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [selectedMajorId, setSelectedMajorId] = useState<string | null>(null);
  const [savedMajors, setSavedMajors] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTrigger, setAuthTrigger] = useState<"save" | "deepdive">("save");

  // Handle assessment start
  const handleStartAssessment = () => {
    setAppState("assessment");
  };

  // Handle assessment completion
  const handleAssessmentComplete = (data: AssessmentData) => {
    setAssessmentData(data);
    setAppState("loading");

    // Simulate AI processing
    setTimeout(() => {
      setAppState("results");
    }, 3000);
  };

  // Handle major selection
  const handleSelectMajor = (majorId: string) => {
    setSelectedMajorId(majorId);
    setAppState("major-detail");
  };

  // Handle back to results
  const handleBackToResults = () => {
    setAppState("results");
    setSelectedMajorId(null);
  };

  // Handle save favorite
  const handleSaveFavorite = (majorId: string) => {
    if (!user) {
      setAuthTrigger("save");
      setShowAuthModal(true);
      return;
    }

    if (savedMajors.includes(majorId)) {
      setSavedMajors(savedMajors.filter(id => id !== majorId));
      toast.success("Removed from favorites");
    } else {
      setSavedMajors([...savedMajors, majorId]);
      toast.success("Added to favorites!");
    }
  };

  // Handle deep dive
  const handleTakeDeepDive = () => {
    if (!user) {
      setAuthTrigger("deepdive");
      setShowAuthModal(true);
    } else {
      toast.info("Deep Dive Assessment coming soon!");
    }
  };

  // Handle authentication
  const handleAuth = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
    toast.success(`Welcome, ${userData.name.split(" ")[0]}!`);
  };

  // Handle view profile
  const handleViewProfile = () => {
    if (!user) {
      setAuthTrigger("save");
      setShowAuthModal(true);
    } else {
      setAppState("profile");
    }
  };

  // Handle retake assessment
  const handleRetakeAssessment = () => {
    setAppState("results");
  };

  // Get saved majors data for profile
  const getSavedMajorsData = () => {
    const allMajors = [
      {
        id: "computer-science",
        title: "Computer Science",
        category: "STEM",
        matchPercentage: 94,
        savedDate: "2 days ago"
      },
      {
        id: "data-science",
        title: "Data Science",
        category: "STEM",
        matchPercentage: 87,
        savedDate: "2 days ago"
      },
      {
        id: "business-analytics",
        title: "Business Analytics",
        category: "Business",
        matchPercentage: 82,
        savedDate: "3 days ago"
      }
    ];

    return allMajors.filter(major => savedMajors.includes(major.id));
  };

  return (
    <>
      {/* Landing Page */}
      {appState === "landing" && (
        <LandingPage onStartAssessment={handleStartAssessment} />
      )}

      {/* Assessment */}
      {appState === "assessment" && (
        <Assessment
          onComplete={handleAssessmentComplete}
          onClose={() => setAppState("landing")}
        />
      )}

      {/* Loading State */}
      {appState === "loading" && <LoadingState />}

      {/* Results Dashboard */}
      {appState === "results" && assessmentData && (
        <ResultsDashboard
          assessmentData={assessmentData}
          onSelectMajor={handleSelectMajor}
          onSaveFavorite={handleSaveFavorite}
          savedMajors={savedMajors}
        />
      )}

      {/* Major Detail Page */}
      {appState === "major-detail" && selectedMajorId && (
        <MajorDetailPage
          majorId={selectedMajorId}
          onBack={handleBackToResults}
          onSaveFavorite={handleSaveFavorite}
          isSaved={savedMajors.includes(selectedMajorId)}
          onTakeDeepDive={handleTakeDeepDive}
        />
      )}

      {/* User Profile */}
      {appState === "profile" && user && (
        <UserProfile
          user={user}
          savedMajors={getSavedMajorsData()}
          onSelectMajor={handleSelectMajor}
          onRemoveFavorite={handleSaveFavorite}
          onRetakeAssessment={handleRetakeAssessment}
          lastAssessmentDate="January 5, 2026"
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
        trigger={authTrigger}
      />

      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
