import React, { Component } from "react";

class Patient2 extends Component {
  state = {
    question_1: "",
    question_2: "",
    question_3: "",
    question_4: "",
    question_5: "",
    question_6: "",
    next_button_available: "",
    all_answer: [],
  };

  handleOnChange = (e) => {
    const { name, value } = e.target;

    // Update the corresponding question state dynamically
    this.setState(
      {
        [name]: value,
      },
      () => {
        // Update the "next_button_available" state and prepare answers
        const allAnswered = [
          "question_1",
          "question_2",
          "question_3",
          "question_4",
          "question_5",
          "question_6",
        ].every((key) => this.state[key] !== "");

        const allAnswers = [
          {
            question: "Patient is overweight or obese",
            answer: this.state.question_1,
          },
          {
            question: "Patient smokes cigarettes",
            answer: this.state.question_2,
          },
          {
            question: "Patient has been recently injured",
            answer: this.state.question_3,
          },
          {
            question: "Patient has high cholesterol",
            answer: this.state.question_4,
          },
          {
            question: "Patient has hypertension",
            answer: this.state.question_5,
          },
          { question: "Patient has diabetes", answer: this.state.question_6 },
        ];

        this.setState(
          {
            next_button_available: allAnswered ? "Available" : "Not available",
            all_answer: allAnswers,
          },
          () => {
            // Callback to parent component with updated answers
            this.props.callback(allAnswers, this.state.next_button_available);
          }
        );
      }
    );
  };

  render() {
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    const questions = [
      {
        title: "I am overweight",
        stateKey: "question_1",
        name: "question_1",
        icon: "⚖️"
      },
      {
        title: "I smoke cigarettes",
        stateKey: "question_2",
        name: "question_2",
        icon: "🚬"
      },
      {
        title: "I have been recently injured",
        stateKey: "question_3",
        name: "question_3",
        icon: "🩹"
      },
      {
        title: "I have high cholesterol",
        stateKey: "question_4",
        name: "question_4",
        icon: "💊"
      },
      {
        title: "I have hypertension",
        stateKey: "question_5",
        name: "question_5",
        icon: "🫀"
      },
      {
        title: "I have diabetes",
        stateKey: "question_6",
        name: "question_6",
        icon: "🩺"
      },
    ];

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Patient Information
          </h2>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Please answer all questions to help us provide accurate predictions
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.name}
              className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                this.state[question.stateKey]
                  ? isDarkMode
                    ? 'border-blue-500 bg-gray-700/50'
                    : 'border-blue-500 bg-blue-50/50'
                  : isDarkMode
                    ? 'border-gray-700 bg-gray-800/50'
                    : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{question.icon}</span>
                <p className={`font-semibold text-lg ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {question.title}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  { value: "Yes", label: "Yes", color: "from-red-500 to-pink-500" },
                  { value: "No", label: "No", color: "from-green-500 to-emerald-500" },
                  { value: "Patient doesn't know", label: "I don't know", color: "from-gray-500 to-gray-600" },
                ].map((option) => (
                  <label
                    key={`${question.name}-${option.value}`}
                    className={`flex items-center gap-3 cursor-pointer px-4 py-2.5 rounded-xl transition-all duration-200 ${
                      this.state[question.stateKey] === option.value
                        ? isDarkMode
                          ? 'bg-gradient-to-r ' + option.color + ' text-white shadow-lg'
                          : 'bg-gradient-to-r ' + option.color + ' text-white shadow-lg'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.name}
                      value={option.value}
                      checked={this.state[question.stateKey] === option.value}
                      onChange={this.handleOnChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      this.state[question.stateKey] === option.value
                        ? 'border-white bg-white'
                        : isDarkMode
                          ? 'border-gray-400 bg-transparent'
                          : 'border-gray-400 bg-transparent'
                    }`}>
                      {this.state[question.stateKey] === option.value && (
                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                      )}
                    </div>
                    <span className="font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Patient2;
