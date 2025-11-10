import React, { Component } from "react";

class Disease extends Component {
  state = {
    gender: this.props.gender,
    age: this.props.age,
    patientInfo:
      JSON.parse(localStorage.getItem("patient_question") || "[]") ||
      this.props.patient_question ||
      [], // Initialize patientInfo as an empty array
    disease_possibility: this.props.disease_possibility || [], // To store the diseases with possibilities
  };

  get_current_html = () => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const filtered_list = this.state.disease_possibility.filter(
      (e) => e.probability
    );
    filtered_list.sort(
      (a, b) =>
        b.probability - a.probability || a.disease.localeCompare(b.disease)
    );

    return filtered_list.length !== 0 ? (
      <div className="space-y-8">
        {/* Patient Info Summary */}
        <div className={`p-6 rounded-xl ${
          isDarkMode
            ? 'bg-gray-700/50 border border-gray-600'
            : 'bg-blue-50/50 border border-blue-200'
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Patient Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gender</span>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{this.state.gender}</p>
            </div>
            <div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Age</span>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{this.state.age} years</p>
            </div>
          </div>
          {this.state.patientInfo.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
              <h3 className={`text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Additional Information</h3>
              <div className="space-y-2">
                {this.state.patientInfo.map((key, id) => (
                  <div key={id} className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <span className="font-medium">{key.question}: </span>
                    <span>{key.answer}</span>
        </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Diagnosis Results */}
        <div>
          <h2 className={`text-2xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Diagnosis Report
          </h2>
          <div className="space-y-6">
            {filtered_list.map((key, id) => {
              const probability = Math.round(key.probability * 100);
              const getProbabilityColor = (prob) => {
                if (prob >= 70) return 'from-red-500 to-pink-500';
                if (prob >= 40) return 'from-orange-500 to-yellow-500';
                return 'from-blue-500 to-cyan-500';
              };
              
              return (
                <div
              key={id}
                  className={`p-6 rounded-xl border-2 ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  } shadow-lg`}
                >
                  {/* Disease Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {key.disease}
                      </h3>
                      <div className="flex items-center gap-4">
                        <div>
                          <span className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Probability
                          </span>
                          <p className={`text-2xl font-black bg-gradient-to-r ${getProbabilityColor(probability)} bg-clip-text text-transparent`}>
                            {probability}%
                          </p>
                        </div>
                      </div>
                    </div>
                  <a
                    href={`https://en.wikipedia.org/wiki/${key.name}`}
                      target="_blank"
                    rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Learn More
                    </a>
                </div>

                  {/* Probability Bar */}
                  <div className={`h-3 rounded-full overflow-hidden mb-6 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className={`h-full bg-gradient-to-r ${getProbabilityColor(probability)} rounded-full transition-all duration-500`}
                      style={{ width: `${probability}%` }}
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <h4 className={`font-semibold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Description
                    </h4>
                    <p className={`leading-relaxed ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {key.description}
                    </p>
                </div>

                  {/* Precautions */}
                  <div>
                    <h4 className={`font-semibold mb-3 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Precautions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {key.precautions.map((precaution, index) => (
                        <div
                      key={index}
                          className={`flex items-start gap-2 p-3 rounded-lg ${
                            isDarkMode
                              ? 'bg-gray-700/50 border border-gray-600'
                              : 'bg-blue-50 border border-blue-100'
                          }`}
                        >
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                          <span className={`text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {precaution}
                          </span>
                        </div>
                      ))}
                    </div>
              </div>
            </div>
              );
            })}
          </div>
        </div>

        {/* Warning Banner */}
        <div className={`p-6 rounded-xl border-l-4 ${
          isDarkMode
            ? 'bg-yellow-900/20 border-yellow-600 text-yellow-200'
            : 'bg-yellow-50 border-yellow-500 text-yellow-800'
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold mb-1">
            Always visit a doctor if you have any symptoms of a disease or call your local hospital
          </p>
              <p className="text-sm opacity-90">
                This tool is for informational purposes only and does not replace professional medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center py-12">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <svg className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className={`text-xl font-bold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Cannot determine possible diseases
        </h3>
        <p className={`mb-6 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Please retry the analysis with actual symptoms.
        </p>
        <div className={`p-6 rounded-xl border-l-4 ${
          isDarkMode
            ? 'bg-yellow-900/20 border-yellow-600 text-yellow-200'
            : 'bg-yellow-50 border-yellow-500 text-yellow-800'
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold mb-1">
            Always visit a doctor if you have any symptoms of a disease or call your local hospital
          </p>
              <p className="text-sm opacity-90">
                This tool is for informational purposes only and does not replace professional medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return <div id="Disease">{this.get_current_html()}</div>;
  }
}

export default Disease;
