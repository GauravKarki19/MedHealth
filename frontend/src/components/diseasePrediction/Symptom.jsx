import React, { Component } from "react";
import { Diseases } from "../../data/diseases";
import { Symptoms } from "../../data/symptoms";
import httpClient from "../../httpClient";

class Symptom extends Component {
  state = {
    gender: this.props.gender,
    age: this.props.age,
    user_symptoms: this.props.userSymptoms || [],
    disease_possibility: this.props.disease_possibility || [],
    searched: "",
  };

  sendSymptomsToBackend = () => {
    // Check if there are symptoms to send
    if (!this.state.user_symptoms || this.state.user_symptoms.length === 0) {
      console.error("No symptoms selected");
      alert("Please select at least one symptom before proceeding.");
      return;
    }

    // Check if we have at least 2 symptoms
    if (this.state.user_symptoms.length < 2) {
      alert("Please select at least 2 symptoms for accurate disease prediction.");
      return;
    }

    console.log("Sending symptoms to backend:", this.state.user_symptoms);

    // Try main backend first, then fallback to external service
    const modelUrl = import.meta.env.VITE_MODEL_URL;
    const apiUrl = modelUrl || "/predict";

    // Use fetch for external URLs, httpClient for internal
    const requestPromise = modelUrl 
      ? fetch(modelUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.state.user_symptoms),
        }).then(res => res.json())
      : httpClient.post(apiUrl, this.state.user_symptoms).then(res => res.data);

    requestPromise
      .then((result) => {
        console.log("Received result:", result);
        
        // Handle error response
        if (result && result.error) {
          throw new Error(result.error);
        }
        
        // Check if result is an array (successful prediction)
        if (result && Array.isArray(result) && result.length > 0) {
          this.setState({ disease_possibility: result });
          this.props.updateDiseasePossibility(result);
        } else {
          console.error("Invalid result format:", result);
          alert("No disease predictions found. Please try selecting different symptoms.");
          this.props.updateDiseasePossibility([]);
        }
      })
      .catch((error) => {
        console.error("Error sending symptoms:", error);
        const errorMessage = error.response?.data?.error || error.message || "Failed to predict disease. The prediction service may be unavailable. Please try again later or contact support.";
        alert(errorMessage);
        this.props.updateDiseasePossibility([]);
      });
  };

  addSymptom = (symptom) => {
    if (!this.state.user_symptoms.includes(symptom)) {
      this.setState(
        (prevState) => {
          const newSymptoms = [symptom, ...prevState.user_symptoms];
          return { user_symptoms: newSymptoms, searched: "" };
        },
        () => this.props.updateSymptoms(this.state.user_symptoms)
      );
    }
  };

  handleSearchChange = (e) => {
    this.setState({ searched: e.target.value });
  };

  on_click_reset_button = () => {
    this.setState(
      {
        user_symptoms: [],
        disease_with_possibility: [],
      },
      () => this.props.updateSymptoms([], [])
    );
  };

  deleteSymptomButtonEvent = (symptomToDelete) => {
    this.setState((prevState) => ({
      user_symptoms: prevState.user_symptoms.filter(
        (s) => s !== symptomToDelete
      ),
    }));
  };

  render() {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const filteredSymptoms = Symptoms.filter((symptom) =>
      symptom.toLowerCase().includes(this.state.searched.toLowerCase())
    );

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className={`text-2xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Select Your Symptoms
          </h2>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Search and select at least 2 symptoms to get accurate predictions
          </p>
          {this.state.user_symptoms.length > 0 && (
            <p className={`text-sm mt-2 font-semibold ${
              this.state.user_symptoms.length >= 2
                ? 'text-green-600 dark:text-green-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}>
              {this.state.user_symptoms.length} symptom{this.state.user_symptoms.length !== 1 ? 's' : ''} selected
              {this.state.user_symptoms.length < 2 && ' (Select at least 2)'}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search Input & Symptoms List */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  isDarkMode
                    ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                }`}
                type="text"
                value={this.state.searched}
                onChange={this.handleSearchChange}
                placeholder="Search symptoms..."
              />
            </div>
            
            {/* Symptoms List */}
            <div className={`rounded-xl border-2 ${
              isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
              <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {filteredSymptoms.length > 0 ? (
                  <div className="space-y-1">
                    {filteredSymptoms.map((symptom) => (
                      <button
                        key={symptom}
                        onClick={() => this.addSymptom(symptom)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                          isDarkMode
                            ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                            : 'hover:bg-blue-50 text-gray-700 hover:text-blue-700'
                        }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-8 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    No symptoms found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selected Symptoms */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Selected Symptoms
            </h3>
            {this.state.user_symptoms.length > 0 ? (
              <div className="space-y-2">
                {this.state.user_symptoms.map((symptom) => (
                  <div
                    key={symptom}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      isDarkMode
                        ? 'bg-gray-700 border border-gray-600'
                        : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <span className={`font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {symptom}
                    </span>
                    <button
                      onClick={() => this.deleteSymptomButtonEvent(symptom)}
                      className={`p-1.5 rounded-lg transition-all duration-200 ${
                        isDarkMode
                          ? 'hover:bg-gray-600 text-gray-400 hover:text-red-400'
                          : 'hover:bg-red-100 text-gray-500 hover:text-red-600'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-8 rounded-xl text-center border-2 border-dashed ${
                isDarkMode
                  ? 'border-gray-700 bg-gray-800/50 text-gray-500'
                  : 'border-gray-300 bg-gray-50 text-gray-400'
              }`}>
                <p>No symptoms selected yet</p>
                <p className="text-sm mt-2">Search and click on symptoms to add them</p>
              </div>
            )}

            {/* Reset Button */}
            {this.state.user_symptoms.length > 0 && (
              <button
                onClick={this.on_click_reset_button}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-md'
                }`}
              >
                Reset All Symptoms
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Symptom;